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
	const startDate: Ref<string | null> = ref(null);
	const endDate: Ref<string | null> = ref(null);
	const paymentStatus: Ref<'paid' | 'not-paid' | null> = ref(null);
	const showTampered: Ref<boolean | null> = ref(null);
	const paymentMethod: Ref<'cash' | 'cheque' | 'mpesa' | 'invoice' | null> = ref(null);

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
				requestURL = requestURL + `&regNo=${searchRegNo.value}`;
			}

			// rendering completed or pending requests
			if (activeView.value == 'pending') {
				requestURL = requestURL + '&completed=false';
			} else {
				requestURL = requestURL + '&completed=true';
			}

			if (startDate.value !== null) {
				requestURL = requestURL + `&startDate=${startDate.value}`;
			}

			if (endDate.value !== null) {
				requestURL = requestURL + `&endDate=${endDate.value}`;
			}

			if (paymentStatus.value !== null) {
				requestURL = requestURL + `&paymentStatus=${paymentStatus.value}`;
			}

			if (showTampered.value !== null) {
				requestURL = requestURL + `&isVehicleTampered=${showTampered.value}`;
			}

			if (paymentMethod.value !== null) {
				requestURL = requestURL + `&paymentMethod=${paymentMethod.value}`;
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

	function clearFilters(): void {
		searchRegNo.value = '';
		startDate.value = null;
		endDate.value = null;
		paymentStatus.value = null;
		showTampered.value = null;
		paymentMethod.value = null;

		// ecxecute the request
		executeFetchValuations();
	}

	return {
		activeView,
		fetchValuationsStatus,
		fetchValuationsError,
		corpValuations,
		totalPages,
		page,
		startDate,
		endDate,
		paymentStatus,
		showTampered,
		paymentMethod,
		searchRegNo,
		executeFetchValuations,
		clearFilters,
	};
};
