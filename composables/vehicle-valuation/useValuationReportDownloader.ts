import { type StandardSuccessResponse, type StandardErrorResponse } from '~/types/proxy-types';

export default function () {
	const { params: routeParams } = useRoute();
	const { getValuationAuthToken } = useAuth();
	const activeImage: Ref<number> = ref(0);
	const imageStretched: Ref<boolean> = ref(true);

	const {
		pending: fetchingValuationReport,
		error: errorFetchingValuationReport,
		execute: refetchValuationReport,
		data: valuationReport,
	} = useApiData<any>(
		'valuation-report',
		computed(() => `/api/vehicle-valuation/get-valuation-report`),
		{
			// lazy: true,
			// server: true,
			query: {
				api_key: getValuationAuthToken.value,
				valuation_id: routeParams.valuation_id,
			},
			transform: (response) => {
				// Check if the API call was successful
				if (response.success) {
					// The response.data is correctly typed as TrackedVehicles[] here.
					return (response as StandardSuccessResponse<any>).data;
				}

				// If it failed, throw the error
				throw new Error(
					(response as StandardErrorResponse).metadata.message || 'Unknown error',
				);
			},
		},
	);

	return {
		fetchingValuationReport,
		errorFetchingValuationReport,
		valuationReport,
		activeImage,
		imageStretched,
		refetchValuationReport,
	};
}
