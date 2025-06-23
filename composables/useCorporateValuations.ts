export const useCorporateValuations = () => {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const { name: routeName } = useRoute();

	const activeView: Ref<'pending' | 'complete'> = ref('complete');

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
			if (activeView.value == 'pending') {
				requestURL = requestURL + '&completed=false';
			} else {
				requestURL = requestURL + '&completed=true';
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
				if (response.ok && response._data.data !== null) {
					const data = response._data.data;
					corpValuations.value = data;
					const extras = response._data.requestExtras;
					totalPages.value = extras.totalPages;
				}
			},
			watch: [activeView, page],
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
