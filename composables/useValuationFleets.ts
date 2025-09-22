export function useValuationFleets() {
	const { getPrincipal } = useAuth();
	const runtimeConfig = useRuntimeConfig();
	const corpFleets: Ref<any[]> = ref([]);

	// for mworking with fleets
	const fleetPage: Ref<number> = ref(0);
	const fleetPageSize: number = 10;
	const totalFleetPages: Ref<number> = ref(0);

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
				Accept: '',
			},
			server: false,
			lazy: true,
			onResponse({ response }) {
				if (response.ok && response._data.data !== null) {
					const data = response._data.data;
					corpFleets.value = data;
					const extras = response._data.requestExtras;
					totalFleetPages.value = extras.totalPages;
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
	};
}

export const useValuationFleetJobs = () => {
	const { params } = useRoute();
	const runtimeConfig = useRuntimeConfig();

	// for working with fleet jobs
	const activeView: Ref<'pending' | 'complete' | 'all'> = ref('all');
	const corpFleetsJobs: ComputedRef<any[]> = computed(() => fetchedData.value?.fleetJobs);
	const fleetJobPage: Ref<number> = ref(0);
	const fleetJobPageSize: number = 10;
	const totalFleetJobPages: ComputedRef<number> = computed(() => fetchedData.value?.totalPages);
	const searchRegNo: Ref<string> = ref('');

	const {
		status: fetchFleetsJobsStatus,
		execute: executeFetchJobsFleets,
		error: fetchFleetsJobsError,
		data: fetchedData,
	} = useFetch(
		() => {
			let requestURL = `/api/v1/valuation/fleets/get-jobs?page=${fleetJobPage.value}&size=${fleetJobPageSize}&fleetId=${params.fleet_id}`;

			// rendering completed or pending requests
			if (activeView.value != 'all') {
				if (activeView.value == 'pending') {
					requestURL = requestURL + '&completed=false';
				} else {
					requestURL = requestURL + '&completed=true';
				}
			}

			if (searchRegNo.value !== '') {
				requestURL = requestURL + `&regNo=${searchRegNo.value}`;
			}

			return requestURL;
		},
		{
			key: 'corporate-fleet-jobs',
			baseURL: runtimeConfig.public.VALUATION_BASE_URL,
			method: 'GET',
			headers: {
				Accept: '',
			},
			server: false,
			lazy: true,
			transform(response: any) {
				if (
					response?.data &&
					Array.isArray(response.data) &&
					(response.data as []).length > 0
				) {
					return {
						fleetJobs: response.data,
						totalPages: response.requestExtras?.totalPages || 0,
					};
				} else {
					return {
						fleetJobs: [],
						totalPages: 0,
					};
				}
			},
			watch: [activeView, fleetJobPage],
		},
	) as any;

	return {
		fleetJobPage,
		totalFleetJobPages,
		fetchFleetsJobsStatus,
		corpFleetsJobs,
		executeFetchJobsFleets,
		fetchFleetsJobsError,
		activeView,
		searchRegNo,
	};
};
