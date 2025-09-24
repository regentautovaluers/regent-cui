import { type TrackedVehicles, type Online } from '~/types/regent-tracking/tracked-vehicles';
import { type StandardSuccessResponse, type StandardErrorResponse } from '~/types/proxy-types';
import {
	getTrackedVehicle,
	setTrackedVehicle,
	cleanTrackedVehicle,
} from '~/stores/regent-tracking-devices-store';
import { useGeolocation } from '@vueuse/core';

export type ActiveDeviceTab = 'details' | 'alerts' | 'history';

export async function useRegentDeviceTracking() {
	const today = new Date();
	const timeExpiredString = 'Expired';
	const deviceOnlineStatus: Ref<Online | null> = ref(null);
	const searchString: Ref<string | null> = ref(null);
	const activeDeviceTab: Ref<ActiveDeviceTab> = ref('details');
	const { coords, error: geolocationError, isSupported: geolocationSupported } = useGeolocation();

	const {
		data: vehicles,
		pending: fetchingClientVehicles,
		error: errorFetchingClientVehicles,
		execute: refetchClientVehicles,
	} = await useApiData<TrackedVehicles[], TrackedVehicles[]>(
		'client-devices',
		'/api/regent-tracking/load-vehicles?api_hash=$2y$10$VG5xofVqWW6B1gu2zLDFYezsoLkyUonucCKZyR5tAFqb7XV5Tx2yi',
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
		if (deviceOnlineStatus.value === 'offline') {
			filteredVehicles = filteredVehicles.filter(
				(v) => v.online === deviceOnlineStatus.value,
			);
		}

		if (deviceOnlineStatus.value === 'expired') {
			filteredVehicles = filteredVehicles.filter((v) => {
				let expirationDate = v.device_data.expiration_date;
				if (expirationDate) {
					return isDateInThePast(expirationDate.toString());
				}
			});
		}

		if (deviceOnlineStatus.value === 'ack') {
			filteredVehicles = filteredVehicles.filter((v) =>
				['ack', 'engine', 'online'].includes(v.online),
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

	const mapCenter: ComputedRef<{ lat: number; lng: number }> = computed(() => {
		if (!vehicles.value) {
			if (geolocationSupported) {
				return {
					lat: coords.value.latitude,
					lng: coords.value.longitude,
				};
			}
		} else {
			const firstActive = vehicles.value.find((v) =>
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
		setDeviceOnlineStatus,
		setActiveDevice,
		setActiveDeviceTab,
		refetchClientVehicles,
		cleanTrackedVehicle,
	};
}
