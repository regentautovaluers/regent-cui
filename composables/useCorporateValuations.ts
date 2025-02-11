export const useCorporateValuations = () => {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const { name: routeName } = useRoute();

	const activeView: Ref<'pending' | 'complete'> = ref('pending');

	// for fetching corp valuations
	const page: Ref<number> = ref(0);
	const pageSize: number = 10;
	const corpValuations: Ref<any[]> = ref([]);
	const totalPages: Ref<number> = ref(0);
	const searchRegNo: Ref<string> = ref('');

	const {
		status: fetchValuationsStatus,
		execute: executeFetchValuations,
		error: fetchValuationsError,
	} = useFetch(
		() => {
			let requestURL = `/api/v1/valuation/booking/get-all?corpId=${getPrincipal.value.corpId}&page=${page.value}&size=${pageSize}`;

			if (routeName == 'vehicle-valuation-tampered-vehicles') {
				requestURL = requestURL + `&isVehicleTampered=true`;
			}

			if (searchRegNo.value !== '') {
				requestURL = requestURL + `&registrationNumber=${searchRegNo.value}`;
			}

			// rendering completed or pending requests
			if (activeView.value == 'complete') {
				requestURL = requestURL + '&completed=true';
			} else if (activeView.value == 'pending') {
				requestURL = requestURL + '&completed=false';
			}

			return requestURL;
		},
		{
			key: 'corporate-valuations',
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
					corpValuations.value = data;
					const extras = response._data.requestExtras;
					totalPages.value = extras.totalPages;
				}
			},
		},
	) as any;

	return {
		activeView,
		fetchValuationsStatus,
		fetchValuationsError,
		corpValuations,
		totalPages,
		page,
		executeFetchValuations,
	};
};
