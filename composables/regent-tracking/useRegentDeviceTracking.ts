import {
	type TrackedVehicles,
	type TrackedVehicleFetchTick,
	type Online,
} from '~/types/regent-tracking/tracked-vehicles';
import { fetchEventSource } from '@microsoft/fetch-event-source';

export type ActiveDeviceTab = 'details' | 'alerts' | 'history';

export function useRegentDeviceTracking() {
	const deviceOnlineStatus: Ref<Online | null> = ref(null);
	const searchString: Ref<string | null> = ref(null);
	const activeDeviceTab: Ref<ActiveDeviceTab> = ref('details');
	const { gecodeLocation } = useGoogleMaps();
	const { authToken } = useRegentTrackingAuth();
	const loadingLocation: Ref<boolean> = ref(false);
	const lastUpdateTime: Ref<string> = ref(new Date().toLocaleTimeString());
	const { name: routeName } = useRoute();
	let frequecyUpdatesAbortController = new AbortController();

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
				let expiredDevices = (response._data.data as TrackedVehicles[]).filter((v) =>
					isDeviceSubscriptionExpired(v),
				);
				let activeDevices = (response._data.data as TrackedVehicles[]).filter(
					(v) => !isDeviceSubscriptionExpired(v),
				);
				setClientDevices([...activeDevices, ...expiredDevices]);

				// for the home route we initiate the sse
				if (routeName == 'regent-tracking-home') {
					initializeFrequestUpdateSSE();
				}
			},
			onResponseError: (_e) => {
				useToast('Failed to load vehicles! Try Again', {
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
			let wrappedStatus = deriveProperTrackerStatus(
				v.online,
				v.device_data.expiration_date,
			).proper_status;

			if (activeStatusFilter) {
				switch (activeStatusFilter) {
					case 'offline':
						statusMatch = wrappedStatus === 'Offline';
						break;
					case 'expired':
						statusMatch = wrappedStatus === 'Expired';
						break;
					case 'ack':
						statusMatch = wrappedStatus === 'Online';
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

	async function initializeFrequestUpdateSSE() {
		try {
			await fetchEventSource('/api/regent-tracking/load-vehicles-sse', {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
				signal: frequecyUpdatesAbortController.signal,
				onmessage(msg) {
					// If the user aborted, this might still fire once; guard against it
					if (frequecyUpdatesAbortController.signal.aborted) return;

					try {
						const result: TrackedVehicleFetchTick = JSON.parse(msg.data);
						result.vehicles.forEach((e) =>
							setTickedDeviceLocation({
								deviceId: e.id,
								newLat: e.lat,
								newLng: e.lng,
								time: e.time as Date,
							}),
						);

						lastUpdateTime.value = result.tick_time;
					} catch (e) {
						console.error('Failed to parse stream segment', e);
					}
				},
			});
		} catch (error) {
			useToast('Failed to update vehicles!', {
				type: 'error',
				title: 'Next tick failed!',
			});
		}
	}

	function setDeviceOnlineStatus(newStatus: Online | null) {
		deviceOnlineStatus.value = newStatus;
	}

	function setActiveDevice(device: TrackedVehicles) {
		setTrackedVehicle(device);
	}

	function setActiveDeviceTab(tab: ActiveDeviceTab) {
		activeDeviceTab.value = tab;
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
		lastUpdateTime,
		setDeviceOnlineStatus,
		setActiveDevice,
		setActiveDeviceTab,
		refetchClientVehicles,
		cleanTrackedVehicle,
		cleanTrackedVehicleLocation,
		isDeviceSubscriptionExpired,
	};
}
