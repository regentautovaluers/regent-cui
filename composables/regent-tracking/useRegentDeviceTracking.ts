import { type TrackedVehicles, type Online } from '~/types/regent-tracking/tracked-vehicles';
import { type StandardSuccessResponse, type StandardErrorResponse } from '~/types/proxy-types';
import {
	getTrackedVehicle,
	setTrackedVehicle,
	cleanTrackedVehicle,
	state,
	cleanTrackedVehicleLocation,
	getTrackedVehicleLocation,
	setTrackedVehicleLocation,
	getClientDevices,
	setClientDevices,
	cleanClientDevices,
} from '~/stores/regent-tracking-devices-store';
import { useGeolocation } from '@vueuse/core';

export type ActiveDeviceTab = 'details' | 'alerts' | 'history';

export function useRegentDeviceTracking() {
	const today = new Date();
	const deviceOnlineStatus: Ref<Online | null> = ref(null);
	const searchString: Ref<string | null> = ref(null);
	const activeDeviceTab: Ref<ActiveDeviceTab> = ref('details');
	const { coords, error: geolocationError, isSupported: geolocationSupported } = useGeolocation();
	const { gecodeLocation } = useGoogleMaps();
	const { authToken } = useRegentTrackingAuth();
	const loadingLocation: Ref<boolean> = ref(false);

	const computedURL: ComputedRef<string> = computed(
		() => `/api/regent-tracking/load-vehicles?api_hash=${authToken.value}`,
	);

	const {
		pending: fetchingClientVehicles,
		error: errorFetchingClientVehicles,
		execute: refetchClientVehicles,
	} = useApiData<TrackedVehicles[], TrackedVehicles[]>('client-devices', computedURL, {
		method: 'GET',
		server: false,
		immediate: false,
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
		onResponse({ response }) {
			setClientDevices(response._data.data as TrackedVehicles[]);
		},
	});

	watch(
		authToken,
		async (newValue) => {
			if (typeof newValue === 'string' && newValue.length > 0) {
				const cached = getClientDevices.value;
				// if data does not exist in the store
				if (!cached) {
					await refetchClientVehicles();
				}
			}
		},
		{ immediate: true },
	);

	const totalVehicles: ComputedRef<number> = computed(() => getClientDevices.value?.length ?? 0);

	const computedVehicles: ComputedRef<TrackedVehicles[] | null> = computed(() => {
		if (!getClientDevices.value) {
			return null;
		}

		// Return early if no filters
		if (!deviceOnlineStatus.value && !searchString.value) {
			return getClientDevices.value as TrackedVehicles[];
		}

		const lowerCaseSearch = searchString.value?.toLowerCase();

		return getClientDevices.value.filter((v) => {
			// Online status filter
			let statusMatch = true;
			if (deviceOnlineStatus.value === 'offline') {
				statusMatch = v.online === 'offline';
			} else if (deviceOnlineStatus.value === 'expired') {
				const expirationDate = v.device_data.expiration_date;
				statusMatch = expirationDate ? isDateInThePast(expirationDate.toString()) : false;
			} else if (deviceOnlineStatus.value === 'ack') {
				statusMatch = ['ack', 'engine', 'online'].includes(v.online);
			}

			// Search string filter
			const searchMatch =
				!lowerCaseSearch ||
				v.name?.toLowerCase().includes(lowerCaseSearch) ||
				v.driver_data.name?.toLowerCase().includes(lowerCaseSearch);

			return statusMatch && searchMatch;
		}) as TrackedVehicles[];
	});

	const mapCenter: ComputedRef<{ lat: number; lng: number }> = computed(() => {
		if (!getClientDevices.value) {
			if (geolocationSupported) {
				return {
					lat: coords.value.latitude,
					lng: coords.value.longitude,
				};
			}
		} else {
			const firstActive = getClientDevices.value.find((v) =>
				['ack', 'engine', 'online'].includes(v.online),
			);

			return {
				lat: firstActive?.lat as number,
				lng: firstActive?.lng as number,
			};
		}

		return {
			lat: -1.2686925224944912,
			lng: 36.80951195575046,
		};
	});

	// watch the change in active device and only fetch vehicle on demand
	watch(
		() => state.activeTrackedVehicle,
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

	return {
		totalVehicles,
		computedVehicles,
		searchString,
		deviceOnlineStatus,
		fetchingClientVehicles,
		errorFetchingClientVehicles,
		getTrackedVehicle,
		activeDeviceTab,
		mapCenter,
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
	};
}
