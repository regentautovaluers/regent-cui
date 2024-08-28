import {
	setRoadsideIncidents,
	getRoadsideIncidents,
	cleanRoadsideIncidents,
} from '~/stores/roadside-incidents-store';

const useRoadsideIncidents = () => {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const currentPage: Ref<number> = ref(0);
	const size: Ref<number> = ref(10);

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

	const { status: fetchRoadsideIncidentsStatus } = useFetch(
		`/api/v1/corp/reports/services/corporate/${getPrincipal.value.corpId}`,
		{
			key: 'roadside-incidents',
			baseURL: runtimeConfig.public.AVA_BASE_URL,
			method: 'GET',
			server: false,
			lazy: true,
			onResponse({ response }) {
				if (response.status !== 200) {
					// TODO: Replace this with a toast message
					throw new Error('Failed to retrieve incidents!');
				}

				const roadsideIncidentsData = response._data;
				setRoadsideIncidents([
					...roadsideIncidentsData.towing,
					...roadsideIncidentsData.fueldelivery,
					...roadsideIncidentsData.tyrechange,
					...roadsideIncidentsData.jumpstarting,
				]);
			},
		},
	);

	return {
		fetchRoadsideIncidentsStatus,
		incidentsListSlice,
		currentPage,
		getRoadsideIncidents,
		totalIncidents,
	};
};

export default useRoadsideIncidents;
