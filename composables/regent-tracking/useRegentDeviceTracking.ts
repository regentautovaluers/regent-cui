import { type TrackedVehicles, type Online } from '~/types/regent-tracking/tracked-vehicles';
import { type StandardSuccessResponse, type StandardErrorResponse } from '~/types/proxy-types';

export type ActiveDeviceTab = 'details' | 'alerts' | 'history';

export async function useRegentDeviceTracking() {
	const deviceOnlineStatus: Ref<Online | null> = ref(null);
	const searchString: Ref<string | null> = ref(null);
	const activeDevice: Ref<TrackedVehicles | null> = ref(null);
	const activeDeviceTab: Ref<ActiveDeviceTab> = ref('details');

	const {
		data: vehicles,
		pending: fetchingClientVehicles,
		error: errorFetchingClientVehicles,
	} = await useApiData<TrackedVehicles[], TrackedVehicles[]>(
		'client-devices',
		'/api/regent-tracking/load-vehicles',
		{
			method: 'GET',
			server: false,
			transform: (response) => {
				// Check if the API call was successful
				if (response.success) {
					// The response.data is correctly typed as TrackedVehicles[] here.
					return (response as StandardSuccessResponse<TrackedVehicles[]>).data;
				}

				// If it failed, throw the error
				throw new Error(
					(response as StandardErrorResponse).metadata.message || 'Unknown error',
				);
			},
		},
	);

	const totalVehicles: ComputedRef<number> = computed(() => vehicles.value?.length ?? 0);

	const computedVehicles: ComputedRef<TrackedVehicles[] | null> = computed(() => {
		if (!vehicles.value) {
			return null;
		}

		let filteredVehicles = vehicles.value;

		// Filter by online status
		if (deviceOnlineStatus.value === 'offline' || deviceOnlineStatus.value === 'expired') {
			filteredVehicles = filteredVehicles.filter(
				(v) => v.online === deviceOnlineStatus.value,
			);
		}

		// Filter by search string
		if (searchString.value) {
			const lowerCaseSearch = searchString.value.toLowerCase();
			filteredVehicles = filteredVehicles.filter(
				(v) =>
					// Check for a match in name, which is assumed to always exist
					(v.name && v.name.toLowerCase().includes(lowerCaseSearch)) ||
					// Use optional chaining for regNo to safely check if it exists before filtering
					v.driver_data.name?.toLowerCase().includes(lowerCaseSearch),
			);
		}

		return filteredVehicles;
	});

	function deriveColor(online_status: Online): string {
		switch (online_status) {
			case 'ack':
				return 'green';
			case 'engine':
				return 'green';
			case 'online':
				return 'green';
			case 'offline':
				return 'yellow';
			case 'expired':
				return 'red';
		}
	}

	function setDeviceOnlineStatus(newStatus: Online | null) {
		deviceOnlineStatus.value = newStatus;
	}

	function setActiveDevice(device: TrackedVehicles) {
		activeDevice.value = device;
	}

	function setActiveDeviceTab(tab: ActiveDeviceTab) {
		activeDeviceTab.value = tab;
	}

	return {
		totalVehicles,
		computedVehicles,
		searchString,
		deviceOnlineStatus,
		fetchingClientVehicles,
		errorFetchingClientVehicles,
		activeDevice,
		activeDeviceTab,
		deriveColor,
		setDeviceOnlineStatus,
		setActiveDevice,
		setActiveDeviceTab,
	};
}
