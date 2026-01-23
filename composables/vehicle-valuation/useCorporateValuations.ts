export const useCorporateValuations = () => {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal, isPrincipalAdmin } = useAuth();
	const { name: routeName } = useRoute();
	const { getBlob } = useStandardizedApi();

	const activeView: Ref<'pending' | 'complete'> = ref('pending');

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
	const reportDownloading: Ref<boolean> = ref(false);
	const downloadedReport: Ref<string | undefined> = ref(undefined);

	const {
		status: fetchValuationsStatus,
		execute: executeFetchValuations,
		error: fetchValuationsError,
		data: fetchedData,
	} = useFetch(
		() => {
			let requestURL = `/api/v1/valuation/booking/get-all?corpId=${getPrincipal.value?.corpId}&page=${page.value}&size=${pageSize}`;

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

			// for finance valuation
			if (
				['BANK', 'SACCO', 'MICRO_FINANCE'].includes(getPrincipal.value?.corpType as string)
			) {
				if (!isPrincipalAdmin && getPrincipal.value?.corpId) {
					requestURL = requestURL + `&corpBranchId=${getPrincipal.value?.corpId}`;
				}
			}

			return requestURL;
		},
		{
			key: 'corporate-valuations',
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
			watch: [activeView, page],
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

	async function downloadReport(link: string) {
		reportDownloading.value = true;
		try {
			const responseBlob = await getBlob(link);

			// check if there is no blob
			if (!responseBlob) {
				throw new Error(`Failed to download report!`);
			}

			downloadedReport.value = URL.createObjectURL(responseBlob) + '#zoom=75';
			useToast('Download successful!', {
				type: 'success',
			});
		} catch (error) {
			console.log('An error occured: ', error);
			useToast('Failed. Try Again!', {
				type: 'error',
			});
		} finally {
			reportDownloading.value = false;
		}
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
		reportDownloading,
		downloadedReport,
		executeFetchValuations,
		clearFilters,
		downloadReport,
	};
};
