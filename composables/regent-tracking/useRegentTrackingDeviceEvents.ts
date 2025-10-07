import { type StandardSuccessResponse, type StandardErrorResponse } from '~/types/proxy-types';
import { type DeviceEvent } from '~/types/regent-tracking/device-event';
import { getTrackedVehicle } from '~/stores/regent-tracking-devices-store';

export function useRegentTrackingDeviceEvents() {
	const dateFrom: Ref<string | null> = ref(null);
	const dateTo: Ref<string | null> = ref(null);
	const { authToken } = useRegentTrackingAuth();
	const alertsFilterPeriod: Ref<'today' | 'this-week' | 'last-30-days ' | 'last-3-months' | 'custom'> =
		ref('today');

	const computedURL: ComputedRef<string> = computed(() => {
		let requestUrl = `/api/regent-tracking/device-event?api_hash=${authToken.value}&device_id=${getTrackedVehicle.value?.id}`;

		if (dateFrom.value) {
			requestUrl = requestUrl + `&date_from=${dateFrom.value}`;
		}

		if (dateTo.value) {
			requestUrl = requestUrl + `&date_to=${dateTo.value}`;
		}

		return requestUrl;
	});

	const {
		data: events,
		pending: fetchingDeviceAlerts,
		error: errorFetchingDeviceAlerts,
		execute: executeFetchDeviceAlerts,
	} = useApiData<DeviceEvent[], DeviceEvent[]>(
		`device-alerts-${getTrackedVehicle.value?.id}`,
		computedURL,
		{
			method: 'GET',
			server: false,
			immediate: false,
			transform: (response) => {
				// Check if the API call was successful
				if (response.success) {
					// The response.data is correctly typed as TrackedVehicles[] here.
					return (response as StandardSuccessResponse<DeviceEvent[]>).data;
				}

				// If it failed, throw the error
				throw new Error(
					(response as StandardErrorResponse).metadata.message || 'Unknown error',
				);
			},
		},
	);

	function setAlertsFilterPeriod(
		period: 'today' | 'this-week' | 'last-30-days ' | 'last-3-months' | 'custom',
	) {
		alertsFilterPeriod.value = period;
		executeFetchDeviceAlerts();
	}

	return {
		dateFrom,
		dateTo,
		events,
		alertsFilterPeriod,
		fetchingDeviceAlerts,
		errorFetchingDeviceAlerts,
		executeFetchDeviceAlerts,
		setAlertsFilterPeriod,
	};
}
