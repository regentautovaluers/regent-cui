import type { LegacyValuation, VehicleValue } from '~/types/corporate-valuations/legacy-valuations';
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

	function cleanAwardedValues(
		values: VehicleValue | null,
	): { name: string; id: number; value: string }[] | null {
		if (!values) {
			return null;
		}

		const cleanedValues: { name: string; id: number; value: string }[] = [];
		if (
			values.market_value != null &&
			values.market_value != '' &&
			values.market_value != '0'
		) {
			cleanedValues.push({ name: 'Market Value', id: 0, value: values.market_value });
		}

		if (
			values.assessed_value != null &&
			values.assessed_value != '' &&
			values.assessed_value != '0'
		) {
			cleanedValues.push({ name: 'Assessed Value', id: 1, value: values.assessed_value });
		}

		if (
			values.forced_sale_value != null &&
			values.forced_sale_value != '' &&
			values.forced_sale_value != '0'
		) {
			cleanedValues.push({
				name: 'Forced Sale Value',
				id: 2,
				value: values.forced_sale_value,
			});
		}

		if (
			values.windscreen_value != null &&
			values.windscreen_value != '' &&
			values.windscreen_value != '0'
		) {
			cleanedValues.push({ name: 'Windscreen Value', id: 3, value: values.windscreen_value });
		}

		if (values.radio_value != null && values.radio_value != '' && values.radio_value != '0') {
			cleanedValues.push({ name: 'Radio Value', id: 4, value: values.radio_value });
		}

		if (
			values.auction_value != null &&
			values.auction_value != '' &&
			values.auction_value != '0'
		) {
			cleanedValues.push({ name: 'Auction Value', id: 5, value: values.auction_value });
		}

		return cleanedValues;
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
		cleanAwardedValues,
		clearFilters,
	};
}
