import type { CookieRef } from '#app';
import crypto from 'crypto-js';
import { getPrincipal, setPrincipal, cleanPrincipal } from '~/stores/authenticated-principal';
import type { LoggedInPrincipal } from '~/types';

const useAuth = () => {
	const runtimeConfig = useRuntimeConfig();
	const email: Ref<string> = ref('');
	const password: Ref<string> = ref('');
	const corpOrBrokerSearchTerm: Ref<string> = ref('');
	const loginAttemptLoading: Ref<boolean> = ref(false);
	const updateProfilePictureLoading: Ref<boolean> = ref(false);
	const searchCorpOrBrokerLoading: Ref<boolean> = ref(false);
	const searchCorpOrBrokerResults: Ref<any[] | null> = ref(null);
	const authToken: CookieRef<string | null | undefined> = useCookie('auth-token');

	const getAuthToken: ComputedRef<string | null | undefined> = computed(() => {
		return authToken.value;
	});

	const attemptLogin = async () => {
		loginAttemptLoading.value = true;
		try {
			await $fetch('/api/v1/auth/corporate-account/login', {
				baseURL: runtimeConfig.public.VALUATION_BASE_URL,
				method: 'POST',
				headers: {
					Accept: '',
					'Content-Type': '',
				},
				body: JSON.stringify({
					email: email.value,
					password: password.value,
				}),

				onResponse({ response }) {
					switch (response.status) {
						case 401: {
							useToast('Invalid Credentials', {
								type: 'warn',
							});
							break;
						}

						case 200: {
							useToast('Login Successful', {
								type: 'success',
							});

							setPrincipal(response._data.data as LoggedInPrincipal);
							// set the auth and csrf tokens
							authToken.value = response._data.data.jwtToken;
							navigateTo({ name: 'mobivaluer-home' });
						}
					}
				},
			});
		} catch (er) {
			console.log('Error encountered. Reason: ', er);
			useToast('Error. Try Again!', {
				type: 'error',
			});
		} finally {
			loginAttemptLoading.value = false;
		}
	};

	const isPrincipalAdmin: ComputedRef<boolean> = computed(
		() =>
			getPrincipal.value?.roles.includes('role_corp_admin'.toUpperCase()) ??
			(false as boolean),
	);

	const attemptLogout = () => {
		// unset the auth token and stored principal
		authToken.value = null;
		cleanPrincipal();

		useToast('Logout Successful!', {
			type: 'success',
		});

		// redirect to the login page
		navigateTo({ name: 'exterior-home' });
	};

	const displayCookieConsent = (): boolean => {
		if (!authToken.value || !getPrincipal.value) {
			return true;
		}

		return false;
	};

	const isPrincipalBroker = (): boolean => {
		return getPrincipal.value?.isBroker as boolean;
	};

	function encryptCorporateClientId(clientId: string) {
		const ENCRYPTION_KEY = '7x!A%D*G-KaPdSgVkYp3s6v9y$B?E(H+';
		const encrypted = crypto.AES.encrypt(clientId, ENCRYPTION_KEY);
		return encrypted.toString();
	}

	return {
		email,
		password,
		corpOrBrokerSearchTerm,
		loginAttemptLoading,
		updateProfilePictureLoading,
		searchCorpOrBrokerLoading,
		searchCorpOrBrokerResults,
		getAuthToken,
		getPrincipal,
		attemptLogin,
		attemptLogout,
		isPrincipalAdmin,
		displayCookieConsent,
		isPrincipalBroker,
		encryptCorporateClientId,
	};
};

export default useAuth;
