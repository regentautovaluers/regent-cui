import { type DeviceHistory } from '~/types/regent-tracking/device-history';
import { type StandardSuccessResponse, type StandardErrorResponse } from '~/types/proxy-types';
import { type VehiclePing, type AnalyzedLocation } from '~/types/regent-tracking/device-history';

export async function useRegentTrackingDeviceHistory() {
	const { query } = useRoute();
	const filterPeriod: Ref<'today' | 'this-week' | 'last-30-days ' | 'last-3-months' | 'custom'> =
		ref('this-week');

	function setFilterPeriod(
		period: 'today' | 'this-week' | 'last-30-days ' | 'last-3-months' | 'custom',
	) {
		filterPeriod.value = period;
	}

	const {
		data: deviceHistory,
		pending: fetchingDeviceHistory,
		error: errorFetchingDeviceHistory,
	} = await useApiData<DeviceHistory, DeviceHistory>(
		`device-history-${query.device_id}`,
		`/api/regent-tracking/device-history?api_hash=$2y$10$VG5xofVqWW6B1gu2zLDFYezsoLkyUonucCKZyR5tAFqb7XV5Tx2yi&device_id=${query.device_id}&from_date=2025-09-15&from_time=00:00:00&to_date=2025-09-15&to_time=23:59:59`,
		{
			method: 'GET',
			server: false,
			transform: (response) => {
				// Check if the API call was successful
				if (response.success) {
					// The response.data is correctly typed as DeviceHistory here.
					return (response as StandardSuccessResponse<DeviceHistory>).data;
				}

				// If it failed, throw the error
				throw new Error(
					(response as StandardErrorResponse).metadata.message || 'Unknown error',
				);
			},
			lazy: true,
		},
	);

	const nestingAreas: ComputedRef<AnalyzedLocation[]> = computed(() => {
		if (deviceHistory.value) {
			return analyzeVehicleStops(
				deviceHistory.value.items.map((item) => ({
					lat: item.items[0].lat,
					lng: item.items[0].lng,
					time_recorded: item.items[0].time,
				})),
				50,
				2,
			);
		}

		return [];
	});

	return {
		filterPeriod,
		deviceHistory,
		fetchingDeviceHistory,
		errorFetchingDeviceHistory,
		nestingAreas,
		setFilterPeriod,
	};
}
