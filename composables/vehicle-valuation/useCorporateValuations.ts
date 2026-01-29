export const useCorporateValuations = () => {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal, isPrincipalAdmin } = useAuth();
	const { name: routeName } = useRoute();

	// for fetching corp valuations
	const page: Ref<number> = ref(0);
	const pageSize: number = 10;
	const corpValuations: ComputedRef<any[]> = computed(() => fetchedData.value?.valuations);
	const totalPages: ComputedRef<number> = computed(() => fetchedData.value?.totalPages);
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
		data: fetchedData,
	} = useFetch(
		computed(() => {
			let requestURL = `/api/v1/valuation/booking/get-all?corpId=${getPrincipal.value?.corpId}&page=${page.value}&size=${pageSize}`;

			if (routeName == 'vehicle-valuation-tampered-vehicles') {
				requestURL = requestURL + `&isVehicleTampered=true`;
			}

			if (searchRegNo.value !== '') {
				requestURL = requestURL + `&regNo=${searchRegNo.value}`;
			}

			// rendering completed or pending requests
			if (routeName == 'vehicle-valuation-ongoing-reports') {
				requestURL = requestURL + '&completed=false';
			}

			if (routeName == 'vehicle-valuation-complete-reports') {
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

			// for finance valuation
			if (
				['BANK', 'SACCO', 'MICRO_FINANCE'].includes(getPrincipal.value?.corpType as string)
			) {
				if (!isPrincipalAdmin && getPrincipal.value?.corpId) {
					requestURL = requestURL + `&corpBranchId=${getPrincipal.value?.corpId}`;
				}
			}

			return requestURL;
		}),
		{
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
						valuations: response.data,
						totalPages: response.requestExtras?.totalPages || 0,
					};
				} else {
					return {
						valuations: [],
						totalPages: 0,
					};
				}
			},
			watch: [page],
		},
	);

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
