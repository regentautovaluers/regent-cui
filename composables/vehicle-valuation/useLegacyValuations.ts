import type { LegacyValuation } from '~/types/corporate-valuations/legacy-valuations';
import type { GenericResponse } from '~/types/corporate-valuations/generic-response-type';
import type { StandardSuccessResponse } from '~/types/proxy-types';

export default function () {
	const page: Ref<number> = ref(0);
	const pageSize: number = 10;
	const searchTerm: Ref<string | null> = ref(null);
	const startDate: Ref<string | null> = ref(null);
	const endDate: Ref<string | null> = ref(null);
	const corpValuations: ComputedRef<LegacyValuation[]> = computed(
		() => fetchedLegacyData.value?.data || [],
	);
	const totalPages: ComputedRef<number> = computed(
		() => fetchedLegacyData.value?.requestExtras?.totalPages || 0,
	);
	const { getPrincipal } = useAuth();

	const {
		status: fetchLegacyValuationsStatus,
		execute: executeFetchLegacyValuations,
		error: fetchLegacyValuationsError,
		data: fetchedLegacyData,
	} = useApiData<GenericResponse<LegacyValuation[]>, GenericResponse<LegacyValuation[]>>(
		`${getPrincipal()?.corpOrganization.corpId}-legacy-${page.value}`,
		computed(() => {
			let requestURL = `/api/vehicle-valuation/get-legacy-reports?corpId=${getPrincipal()?.corpOrganization.corpId}&page=${page.value}&size=${pageSize}`;
			{
				if (startDate.value !== null) {
					requestURL += `&startDate=${startDate.value}`;
				}

				if (endDate.value !== null) {
					requestURL += `&endDate=${endDate.value}`;
				}

				if (searchTerm.value != null) {
					requestURL += `&searchTerm=${searchTerm.value}`;
				}
			}

			return requestURL;
		}),
		{
			method: 'GET',
			server: false,
			transform: (d: StandardSuccessResponse<GenericResponse<LegacyValuation[]>>) => {
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
		searchTerm.value = null;
		startDate.value = null;
		endDate.value = null;

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
		searchTerm,
		executeFetchLegacyValuations,
		clearFilters,
	};
}
