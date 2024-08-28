const useRoadsideIncidents = () => {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const roadsideIncidents: Ref<any[]> = ref([]);

	const { status: fetchRoadsideIncidentsStatus } = useFetch(
		`/api/v1/corp/reports/services/corporate/${getPrincipal.value.corpId}`,
		{
			key: 'roadside-incidents',
			baseURL: runtimeConfig.public.AVA_BASE_URL,
			method: 'GET',
			server: false,
			lazy: true,
			async onResponse({ response }) {
				if (response.status !== 200) {
					// TODO: Replace this with a toast message
					throw new Error('Failed to retrieve incidents!');
				}

				const roadsideIncidentsData = response._data;
				roadsideIncidents.value = [
					...roadsideIncidentsData.towing,
					...roadsideIncidentsData.fueldelivery,
					...roadsideIncidentsData.tyrechange,
					...roadsideIncidentsData.jumpstarting,
				];
			},
		},
	);

	return {
		fetchRoadsideIncidentsStatus,
		roadsideIncidents,
	};
};

export default useRoadsideIncidents;
