import { type TrackedVehicles, type Online } from '~/types/regent-tracking/tracked-vehicles';
import { type StandardSuccessResponse, type StandardErrorResponse } from '~/types/proxy-types';

export type ActiveDeviceTab = 'details' | 'alerts' | 'history';

export function useRegentDeviceTracking() {
	const today = new Date();
	const deviceOnlineStatus: Ref<Online | null> = ref(null);
	const searchString: Ref<string | null> = ref(null);
	const activeDeviceTab: Ref<ActiveDeviceTab> = ref('details');
	const { gecodeLocation } = useGoogleMaps();
	const { authToken } = useRegentTrackingAuth();
	const loadingLocation: Ref<boolean> = ref(false);

	const {
		pending: fetchingClientVehicles,
		error: errorFetchingClientVehicles,
		execute: refetchClientVehicles,
	} = useApiData<TrackedVehicles[], TrackedVehicles[]>(
		'client-devices',
		computed(() => `/api/regent-tracking/load-vehicles?api_hash=${authToken.value}`),
		{
			method: 'GET',
			server: false,
			getCachedData(_key) {
				const cached = getClientDevices.value;
				if (cached) return cached as TrackedVehicles[];
			},
			onResponse: ({ response }) => {
				setClientDevices(response._data.data as TrackedVehicles[]);
			},
			onResponseError: (_e) => {
				useToast('Failed to vehicles! Try Again', {
					type: 'error',
					title: 'Unable to load devices!',
				});
			},
		},
	);

	const totalVehicles: ComputedRef<number> = computed(() => getClientDevices.value?.length ?? 0);

	const computedVehicles: ComputedRef<TrackedVehicles[] | null> = computed(() => {
		// Initial Null Check
		const vehicles = getClientDevices.value;
		if (!vehicles) {
			return null;
		}

		// Pre-calculate search term
		const lowerCaseSearch = searchString.value?.toLowerCase() || '';

		// Pre-calculate active status filter
		const activeStatusFilter = deviceOnlineStatus.value;

		return vehicles.filter((v) => {
			let statusMatch = true;

			if (activeStatusFilter) {
				switch (activeStatusFilter) {
					case 'offline':
						statusMatch = v.online === 'offline';
						break;
					case 'expired':
						const expirationDate = v.device_data.expiration_date;
						// Note: If expiration_date is null/undefined, it can't be expired, so default to false.
						statusMatch =
							!!expirationDate && isDateInThePast(expirationDate.toString());
						break;
					case 'ack':
						statusMatch = ['ack', 'engine', 'online'].includes(v.online);
						break;
					default:
						// If deviceOnlineStatus.value is set but isn't one of the filter options (e.g., 'all' or empty string)
						statusMatch = true;
						break;
				}
			}

			const searchMatch =
				!lowerCaseSearch ||
				v.name?.toLowerCase().includes(lowerCaseSearch) ||
				v.driver_data.name?.toLowerCase().includes(lowerCaseSearch);

			// Vehicle must pass BOTH filters
			return statusMatch && searchMatch;
		}) as TrackedVehicles[];
	});

	// watch the change in active device and only fetch vehicle on demand
	watch(
		() => getTrackedVehicle.value,
		async (newValue) => {
			// clean location when expanded view is closed
			if (!newValue) {
				cleanTrackedVehicleLocation();
			}

			// use geocode functionality when expanded view is open
			if (newValue) {
				// for expired vehicles
				let expirationDate = newValue.device_data.expiration_date;
				if (expirationDate && isDateInThePast(expirationDate.toString())) {
					setTrackedVehicleLocation('Subscription expired!');
					return;
				}

				// for invalid vehicles, we don't show co-ordinates
				if (newValue.online == 'offline' && newValue.timestamp == 0) {
					setTrackedVehicleLocation('Location unfindable!');
					return;
				}

				try {
					loadingLocation.value = true;
					let location = await gecodeLocation(newValue.lat, newValue.lng);
					setTrackedVehicleLocation(location);
					loadingLocation.value = false;
				} catch (e) {
					setTrackedVehicleLocation('Failed to load location!');
				}
			}
		},
	);

	function setDeviceOnlineStatus(newStatus: Online | null) {
		deviceOnlineStatus.value = newStatus;
	}

	function setActiveDevice(device: TrackedVehicles) {
		setTrackedVehicle(device);
	}

	function setActiveDeviceTab(tab: ActiveDeviceTab) {
		activeDeviceTab.value = tab;
	}

	function isDateInThePast(dateString: string): boolean {
		const inputDate = new Date(dateString.replace(/-/g, '/'));

		return inputDate.getTime() < today.getTime();
	}

	function isDeviceSubscriptionExpired(vehicle: TrackedVehicles): boolean {
		return vehicle?.online == 'offline' && vehicle?.timestamp == 0;
	}

	return {
		totalVehicles,
		computedVehicles,
		searchString,
		deviceOnlineStatus,
		fetchingClientVehicles,
		errorFetchingClientVehicles,
		getTrackedVehicle,
		activeDeviceTab,
		loadingLocation,
		getTrackedVehicleLocation,
		authToken,
		getClientDevices,
		setDeviceOnlineStatus,
		setActiveDevice,
		setActiveDeviceTab,
		refetchClientVehicles,
		cleanTrackedVehicle,
		cleanTrackedVehicleLocation,
		isDeviceSubscriptionExpired,
	};
}
