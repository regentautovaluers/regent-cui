import type {
	ValuationBooking,
	PaymentMethod,
	PaymentStatus,
} from '~/types/corporate-valuations/valuation-report';
import type { GenericResponse } from '~/types/corporate-valuations/generic-response-type';
import type { StandardSuccessResponse } from '~/types/proxy-types';

export const useCorporateValuations = () => {
	const { getPrincipal, isPrincipalAdmin } = useAuth();
	const { name: routeName } = useRoute();

	// for fetching corp valuations
	const page: Ref<number> = ref(0);
	const pageSize: number = 10;
	const corpValuations: ComputedRef<ValuationBooking[]> = computed(
		() => fetchedData.value?.data || [],
	);
	const totalPages: ComputedRef<number> = computed(
		() => fetchedData.value?.requestExtras?.totalPages || 0,
	);
	const searchRegNo: Ref<string> = ref('');
	const startDate: Ref<string | null> = ref(null);
	const endDate: Ref<string | null> = ref(null);
	const paymentStatus: Ref<PaymentStatus | null> = ref(null);
	const showTampered: Ref<boolean | null> = ref(null);
	const paymentMethod: Ref<PaymentMethod | null> = ref(null);

	const {
		status: fetchValuationsStatus,
		execute: executeFetchValuations,
		error: fetchValuationsError,
		data: fetchedData,
	} = useApiData<GenericResponse<ValuationBooking[]>, GenericResponse<ValuationBooking[]>>(
		null,
		computed(() => {
			let requestURL = `/api/vehicle-valuation/load-client-valuations?corpId=${getPrincipal.value?.corpId}&page=${page.value}&size=${pageSize}`;
			{
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
					['BANK', 'SACCO', 'MICRO_FINANCE'].includes(
						getPrincipal.value?.corpType as string,
					)
				) {
					if (!isPrincipalAdmin && getPrincipal.value?.corpId) {
						requestURL = requestURL + `&corpBranchId=${getPrincipal.value?.corpId}`;
					}
				}
			}

			return requestURL;
		}),
		{
			method: 'GET',
			server: false,
			transform: (d: StandardSuccessResponse<GenericResponse<ValuationBooking[]>>) => {
				return d.data;
			},
			onResponseError: (_e) => {
				useToast('Failed to load reports! Try Again', {
					type: 'error',
					title: 'Unable to load reports!',
				});
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
