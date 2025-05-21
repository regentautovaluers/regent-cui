import type { CookieRef } from '#app';

const useRegentTracking = () => {
	const runtimeConfig = useRuntimeConfig();
	const email: Ref<string> = ref('');
	const password: Ref<string> = ref('');
	const loginAttemptLoading: Ref<boolean> = ref(false);
	const regentTrackingAuthToken: CookieRef<string | null | undefined> = useCookie(
		'regent-tracking-auth-token',
	);

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
			console.log('items: ', data[0].items);

			return data[0].items.map((item: any) => {
				return {
					vehicleReg: item.name,
					lastPing: item.time,
					location: {
						lat: item.lat,
						lng: item.lng,
					},
				};
			});
		},
		onResponse({ response }) {
			if (response.ok) {
				useToast('Tracked Devices Retrieved Successfully!', {
					type: 'success',
					showIcon: true,
					showCloseButton: false,
					hideProgressBar: true,
				});
			}
		},
	}) as any;

	return {
		email,
		password,
		loginAttemptLoading,
		regentTrackingAuthToken,
		fetchTrackedVehiclesStatus,
		fetchTrackedVehicles,
		trackedVehicles,
		attemptLogin,
	};
};

export default useRegentTracking;
