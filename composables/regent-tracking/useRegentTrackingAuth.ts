import type { CookieRef } from '#app';
import { type StandardSuccessResponse } from '~/types/proxy-types';
import { type RegentTrackingLoginResponse } from '~/types/regent-tracking/client-auth';

export function useRegentTrackingAuth() {
	const authToken: CookieRef<string | null | undefined> = useCookie('tracking-auth-token', {
		default: () => null,
		watch: true,
		expires: new Date(Date.now() + 1209600000), // after 14 days
	});
	const email: Ref<string | null> = ref(null);
	const password: Ref<string | null> = ref(null);
	const loginLoading: Ref<boolean> = ref(false);
	const { post } = useStandardizedApi();
	const { getPrincipal } = useAuth();

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

				// redirect to the correct page
				if (getPrincipal && getPrincipal.value?.corpType == 'INSURANCE') {
					return navigateTo({ name: 'insurance-telematics-all-vehicles' });
				} else if (
					getPrincipal &&
					['BANK', 'MICRO_FINANCE'].includes(getPrincipal.value?.corpType!)
				) {
					return navigateTo({ name: 'regent-tracking-home' });
				}

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

	function bypassRegentTrackingLogin(): boolean {
		return !!authToken.value;
	}

	return {
		authToken,
		email,
		password,
		loginLoading,
		attemptLogin,
		bypassRegentTrackingLogin,
	};
}
