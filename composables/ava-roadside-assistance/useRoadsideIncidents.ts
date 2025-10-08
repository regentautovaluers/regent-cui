import { setRoadsideIncidents, getRoadsideIncidents } from '~/stores/roadside-incidents-store';

const useRoadsideIncidents = () => {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const currentPage: Ref<number> = ref(0);
	const size: Ref<number> = ref(10);
	const topRecentPerService: Ref<any[]> = ref([]);

	// for showing incidents on the map with pins
	const activeService: Ref<string> = ref('towing');
	const completionStatus: Ref<string> = ref('completed');

	const incidentsListSlice: ComputedRef<any[]> = computed(() => {
		const startIndex = currentPage.value * size.value;
		const endIndex = (currentPage.value + 1) * size.value;
		return getRoadsideIncidents.value.slice(startIndex, endIndex).length
			? getRoadsideIncidents.value.slice(startIndex, endIndex)
			: [];
	});

	const totalIncidents: ComputedRef<number> = computed(
		() => getRoadsideIncidents.value.length || 0,
	);

	const totalPages: ComputedRef<number> = computed(() => {
		return Math.ceil(totalIncidents.value / size.value);
	});

	const mapPinsIncidents: ComputedRef<any[]> = computed(() => {
		return getRoadsideIncidents.value
			.map((incident) => {
				return {
					service: incident.service,
					username: incident.user_name,
					registration: incident.registration_no,
					lat: incident.pickup_cordinates.latitude,
					lng: incident.pickup_cordinates.longitude,
					service_status: incident.service_status,
				};
			})
			.filter((m) => {
				if (completionStatus.value === 'completed') {
					return m.service_status === 'completed';
				}

				if (completionStatus.value === 'on-going') {
					return ['on-going', 'pending'].includes(m.service_status);
				}

				if (completionStatus.value === 'cancelled') {
					return m.service_status === 'cancelled';
				}
			})
			.filter((m) => m.service === activeService.value);
	});

	const ongoingIncidents: ComputedRef<number> = computed(
		() =>
			getRoadsideIncidents.value.filter(
				(incident) =>
					incident.service_status === 'on-going' || incident.service_status === 'pending',
			).length || 0,
	);

	const pickMostRecentPerService = (
		towing: any[],
		fuelDelivery: any[],
		tyreChange: any[],
		jumpstarting: any[],
	): any[] => {
		return [
			...(towing.length ? [towing[0]] : []),
			...(fuelDelivery.length ? [fuelDelivery[0]] : []),
			...(tyreChange.length ? [tyreChange[0]] : []),
			...(jumpstarting.length ? [jumpstarting[0]] : []),
		];
	};

	const { status: fetchRoadsideIncidentsStatus } = useFetch(
		`/api/v1/corp/reports/services/corporate/${getPrincipal.value?.corpId}`,
		{
			key: 'roadside-incidents',
			baseURL: runtimeConfig.public.AVA_BASE_URL,
			method: 'GET',
			server: false,
			lazy: true,
			onResponse({ response }) {
				const roadsideIncidentsData = response._data;
				setRoadsideIncidents([
					...roadsideIncidentsData.towing,
					...roadsideIncidentsData.fueldelivery,
					...roadsideIncidentsData.tyrechange,
					...roadsideIncidentsData.jumpstarting,
				]);

				// without waiting for another thread, select the most recent per service
				topRecentPerService.value = pickMostRecentPerService(
					roadsideIncidentsData.towing,
					roadsideIncidentsData.fueldelivery,
					roadsideIncidentsData.tyrechange,
					roadsideIncidentsData.jumpstarting,
				);
			},
		},
	);

	return {
		fetchRoadsideIncidentsStatus,
		incidentsListSlice,
		currentPage,
		getRoadsideIncidents,
		totalIncidents,
		totalPages,
		ongoingIncidents,
		mapPinsIncidents,
		activeService,
		completionStatus,
		topRecentPerService,
	};
};

export default useRoadsideIncidents;
