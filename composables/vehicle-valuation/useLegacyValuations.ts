import type {
	CleanedRearangedAndMapped,
	PaginationData,
	ValuationData,
	FetchMode,
} from '~/types/corporate-valuations/legacy-valuations';
import type { ValuationBooking } from '~/types/corporate-valuations/valuation-report';
import type { GenericResponse } from '~/types/corporate-valuations/generic-response-type';
import type { StandardSuccessResponse } from '~/types/proxy-types';

export default function () {
	const { getPrincipal } = useAuth();
	// for fetching corp valuations
	const page: Ref<number> = ref(0);
	const pageSize: number = 10;
	const searchRegNo: Ref<string> = ref('');
	const startDate: Ref<string> = ref('2025-01-01');
	const endDate: Ref<string> = ref('2025-01-31');
	const corpValuations: ComputedRef<ValuationBooking[]> = computed(
		() => fetchedLegacyData.value?.valuationData || [],
	);
	const totalPages: ComputedRef<number> = computed(
		() => fetchedLegacyData.value?.paginationData?.total_pages || 0,
	);

	const {
		status: fetchLegacyValuationsStatus,
		execute: executeFetchLegacyValuations,
		error: fetchLegacyValuationsError,
		data: fetchedLegacyData,
	} = useApiData<CleanedRearangedAndMapped, CleanedRearangedAndMapped>(
		null,
		computed(() => {
			let requestURL = `/api/vehicle-valuation/get-legacy-reports?corp=AUTO CHEK LIMITED&current_page=${page.value}`; // TODO: Remove the hardcoded corp
			{
				if (searchRegNo.value !== '') {
					requestURL += `&reg_no=${searchRegNo.value}&mode=SEARCH`;
				} else {
					requestURL += '&mode=LIST';
				}

				if (startDate.value !== null) {
					requestURL += `&period_from=${startDate.value}`;
				}

				if (endDate.value !== null) {
					requestURL += `&period_to=${endDate.value}`;
				}
			}

			return requestURL;
		}),
		{
			method: 'GET',
			server: false,
			transform: (d: StandardSuccessResponse<CleanedRearangedAndMapped>) => {
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
		startDate.value = '2025-01-01';
		endDate.value = '2025-01-31';

		// ecxecute the request
		executeFetchLegacyValuations();
	}

	return {
		page,
		pageSize,
		fetchLegacyValuationsStatus,
		fetchLegacyValuationsError,
		corpValuations,
		totalPages,
		startDate,
		endDate,
		searchRegNo,
		executeFetchLegacyValuations,
		clearFilters,
	};
}
