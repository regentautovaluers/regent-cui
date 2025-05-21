import type { CookieRef } from '#app';
import { Loader } from '@googlemaps/js-api-loader';
import { type TrackedDevice } from '~/types';

const useRegentTracking = () => {
	const runtimeConfig = useRuntimeConfig();
	const email: Ref<string> = ref('');
	const password: Ref<string> = ref('');
	const loginAttemptLoading: Ref<boolean> = ref(false);
	const regentTrackingAuthToken: CookieRef<string | null | undefined> = useCookie(
		'regent-tracking-auth-token',
	);
	const searchRegNo: Ref<string> = ref('');
	const activeTrackedDevice: Ref<TrackedDevice | null> = ref(null);
	const activeTrackedDeviceLocation: Ref<String> = ref('');

	const attemptLogin = async () => {
		loginAttemptLoading.value = true;
		try {
			await $fetch(`/api/login?email=${email.value}&password=${password.value}`, {
				baseURL: runtimeConfig.public.REGENT_TRACK_BASE_URL,
				method: 'POST',
				headers: {
					Accept: 'application/json',
				},

				onResponse({ response }) {
					if (response.ok) {
						const loginResponse = response._data;
						regentTrackingAuthToken.value = loginResponse.user_api_hash;

						useToast('Login Successful', {
							type: 'success',
							showIcon: true,
							showCloseButton: false,
							hideProgressBar: true,
						});
					}
				},
			});
		} catch (er) {
			console.log('Error encountered. Reason: ', er);
			useToast('Error. Try Again!', {
				type: 'danger',
				showIcon: true,
				showCloseButton: false,
				hideProgressBar: true,
			});
		} finally {
			loginAttemptLoading.value = false;
		}
	};

	const {
		status: fetchTrackedVehiclesStatus,
		execute: fetchTrackedVehicles,
		data: trackedVehicles,
	} = useFetch(`/api/get_devices?lang=en&user_api_hash=${regentTrackingAuthToken.value}`, {
		key: 'tracked-vehicles',
		baseURL: runtimeConfig.public.REGENT_TRACK_BASE_URL,
		method: 'GET',
		headers: {
			Accept: 'application/json',
		},
		server: false,
		lazy: true,
		watch: [regentTrackingAuthToken],
		transform(data: any) {
			return data[0].items.map((item: any) => {
				return {
					vehicleReg: item.name,
					lastPing: item.time,
					location: {
						lat: item.lat,
						lng: item.lng,
					},
					stopDuration: item.stop_duration,
					driver: {
						name: item.driver_data.name,
						phone: item.driver_data.phone,
						email: item.driver_data.email,
					},
					sensors: item.sensors,

					speed: item.speed,
					speedUnits: item.distance_unit_hour,
				};
			});
		},
		onResponse({ response }) {
			if (!response.ok) {
				useToast('Failed to retrieve tracked!.', {
					type: 'danger',
					showIcon: true,
					showCloseButton: false,
					hideProgressBar: true,
					transition: 'slide',
				});
			}
		},
	}) as unknown as TrackedDevice[];

	const vehicles: ComputedRef<any[]> = computed(() => {
		if (!searchRegNo.value) {
			return trackedVehicles.value;
		}
		return trackedVehicles.value.filter((vehicle: TrackedDevice) =>
			vehicle.vehicleReg.toLowerCase().includes(searchRegNo.value.toLowerCase()),
		);
	});

	watch(activeTrackedDevice, async () => {
		const loader = new Loader({
			apiKey: 'AIzaSyDMGtdKrUaAiV_xXpNv4Ktshpe-NbDUpjY',
			version: 'weekly',
		});
		const lat = activeTrackedDevice.value!.location.lat;
		const lng = activeTrackedDevice.value!.location.lng;
		const Geocoding = await loader.importLibrary('geocoding');

		const geocoder = new Geocoding.Geocoder();
		geocoder.geocode({ location: { lat, lng } }, (results, status) => {
			if (status === 'OK' && results) {
				if (results[0]) {
					activeTrackedDeviceLocation.value = results[0].formatted_address;
				} else {
					activeTrackedDeviceLocation.value = 'Geocoding failed!';
				}
			} else {
				activeTrackedDeviceLocation.value = 'Geocoding failed!';
			}
		});
	});

	return {
		email,
		password,
		loginAttemptLoading,
		regentTrackingAuthToken,
		fetchTrackedVehiclesStatus,
		fetchTrackedVehicles,
		vehicles,
		searchRegNo,
		activeTrackedDevice,
		attemptLogin,
		activeTrackedDeviceLocation,
	};
};

export default useRegentTracking;
