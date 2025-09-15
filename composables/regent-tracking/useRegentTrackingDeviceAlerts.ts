import { type StandardSuccessResponse, type StandardErrorResponse } from '~/types/proxy-types';
import { type DeviceAlerts } from '~/types/regent-tracking/device-alerts';
import { type TrackedVehicles } from '~/types/regent-tracking/tracked-vehicles';
export async function useRegentTrackingDeviceAlerts() {
	const alertsActiveDevice: Ref<TrackedVehicles | null> = ref(null);
	const dateFrom: Ref<string | null> = ref(null);
	const dateTo: Ref<string | null> = ref(null);

	const computedURL: ComputedRef<string> = computed(() => {
		let requestUrl = `/api/regent-tracking/device-alerts?api_hash=$2y$10$VG5xofVqWW6B1gu2zLDFYezsoLkyUonucCKZyR5tAFqb7XV5Tx2yi&device_id=${alertsActiveDevice.value?.id}`;

		if (dateFrom.value) {
			requestUrl = requestUrl + `&date_from=${dateFrom.value}`;
		}

		if (dateTo.value) {
			requestUrl = requestUrl + `&date_to=${dateTo.value}`;
		}

		return requestUrl;
	});

	const {
		data: alerts,
		pending: fetchingDeviceAlerts,
		error: errorFetchingDeviceAlerts,
		execute: executeFetchDeviceAlerts,
	} = await useApiData<DeviceAlerts[], DeviceAlerts[]>(
		`device-alerts-${alertsActiveDevice.value?.id}`,
		computedURL.value,
		{
			method: 'GET',
			server: false,
			transform: (response) => {
				// Check if the API call was successful
				if (response.success) {
					// The response.data is correctly typed as TrackedVehicles[] here.
					return (response as StandardSuccessResponse<DeviceAlerts[]>).data;
				}

				// If it failed, throw the error
				throw new Error(
					(response as StandardErrorResponse).metadata.message || 'Unknown error',
				);
			},
			immediate: false,
		},
	);

	return {
		alertsActiveDevice,
		dateFrom,
		dateTo,
		alerts,
		fetchingDeviceAlerts,
		errorFetchingDeviceAlerts,
		executeFetchDeviceAlerts,
	};
}
