export const useValuationFleets = () => {
	const { getPrincipal } = useAuth();
	const runtimeConfig = useRuntimeConfig();
	const corpFleets: Ref<any[]> = ref([]);
	const corpFleetsJobs: Ref<any[]> = ref([]);
	const { params } = useRoute();

	// for mworking with fleets
	const fleetPage: Ref<number> = ref(0);
	const fleetPageSize: number = 10;
	const totalFleetPages: Ref<number> = ref(0);

	// for working with fleet jobs
	const fleetJobPage: Ref<number> = ref(0);
	const fleetJobPageSize: number = 10;
	const totalFleetJobPages: Ref<number> = ref(0);

	const {
		status: fetchFleetsStatus,
		execute: executeFetchFleets,
		error: fetchFleetsError,
	} = useFetch(
		`/api/v1/valuation/fleets/get-all?page=${fleetPage.value}&size=${fleetPageSize}&corpId=${getPrincipal.value.corpId}`,
		{
			key: 'corporate-fleets',
			baseURL: runtimeConfig.public.VALUATION_BASE_URL,
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
			server: false,
			lazy: true,
			onResponse({ response }) {
				if (response.status === 200 && response._data.data !== null) {
					const data = response._data.data;
					corpFleetsJobs.value = data;
					const extras = response._data.requestExtras;
					totalFleetJobPages.value = extras.totalPages;
				}
			},
		},
	) as any;

	const {
		status: fetchFleetsJobsStatus,
		execute: executeFetchJobsFleets,
		error: fetchFleetsJobsError,
	} = useFetch(
		`/api/v1/valuation/fleets/get-jobs?page=${fleetJobPage.value}&size=${fleetJobPageSize}&fleetId=${params.fleet_id}`,
		{
			key: 'corporate-fleet-jobs',
			baseURL: runtimeConfig.public.VALUATION_BASE_URL,
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
			server: false,
			lazy: true,
			onResponse({ response }) {
				if (response.status === 200 && response._data.data !== null) {
					const data = response._data.data;
					corpFleetsJobs.value = data;
					const extras = response._data.requestExtras;
					totalFleetJobPages.value = extras.totalPages;
				}
			},
		},
	) as any;

	return {
		fetchFleetsStatus,
		executeFetchFleets,
		fetchFleetsError,
		corpFleets,
		fleetPage,
		totalFleetPages,
		fetchFleetsJobsStatus,
		executeFetchJobsFleets,
		fetchFleetsJobsError,
		corpFleetsJobs,
		fleetJobPage,
		totalFleetJobPages,
	};
};
