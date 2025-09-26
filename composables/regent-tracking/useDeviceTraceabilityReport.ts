import { type Response } from '~/types/regent-tracking/trace-report';
import { type StandardSuccessResponse, type StandardErrorResponse } from '~/types/proxy-types';

export default function useDeviceTraceabilityReport() {
	const size: Ref<number> = ref(10);
	const page: Ref<number> = ref(0);

	const {
		data: reports,
		pending: fetchingTraceabilityReports,
		error: errorFetchingTraceabilityReports,
		execute: refetchTraceabilityReports,
	} = useApiData<Response, Response>(
		'traceability-reports',
		`/api/regent-tracking/load-trace-reports?limit=${size.value}&page=${page.value + 1}`,
		{
			method: 'GET',
			server: false,
			transform: (response) => {
				// Check if the API call was successful
				if (response.success) {
					return (response as StandardSuccessResponse<Response>).data;
				}

				// If it failed, throw the error
				throw new Error(
					(response as StandardErrorResponse).metadata.message || 'Unknown error',
				);
			},
		},
	);
	return {
		reports,
		fetchingTraceabilityReports,
		errorFetchingTraceabilityReports,
		refetchTraceabilityReports,
		size,
		page,
	};
}
