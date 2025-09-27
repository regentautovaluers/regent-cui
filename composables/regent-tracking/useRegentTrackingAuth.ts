import type { CookieRef } from '#app';
import { type StandardResponse, type StandardSuccessResponse } from '~/types/proxy-types';
import { type RegentTrackingLoginResponse } from '~/types/regent-tracking/client-auth';

export function useRegentTrackingAuth() {
	const authToken: CookieRef<string | null | undefined> = useCookie('tracking-auth-token');
	const email: Ref<string | null> = ref(null);
	const password: Ref<string | null> = ref(null);
	const loginLoading: Ref<boolean> = ref(false);
	const { post } = useStandardizedApi();

	async function attemptLogin() {
		const url = `/api/regent-tracking/client-login?email=${email.value}&password=${password.value}`;
		try {
			loginLoading.value = false;
			const response = await post<RegentTrackingLoginResponse>(url);
			if (response.success) {
				authToken.value = (
					response as StandardSuccessResponse<RegentTrackingLoginResponse>
				).data.user_api_hash;

				useToast('Vehicles will load in a few.', {
					type: 'success',
					title: 'Success!',
				});

				return;
			}

			useToast('Kindly check your credentials!', {
				type: 'warn',
				title: 'Login Attempt Failed!',
			});
		} catch (err: any) {
			useToast('Error. Try Again!', {
				type: 'error',
			});
		} finally {
			loginLoading.value = false;
		}
	}
    
	return {
		authToken,
		email,
		password,
		loginLoading,
		attemptLogin,
	};
}
