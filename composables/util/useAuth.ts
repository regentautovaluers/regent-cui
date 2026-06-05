import type { CookieRef } from '#app';
import crypto from 'crypto-js';
import type {
	ValuationPrinicpal,
	CorpClass,
	LoginResponse,
} from '~/types/app-security/app-principal-types';
import type { StandardSuccessResponse } from '~/types/proxy-types';
const useAuth = () => {
	const email: Ref<string> = ref('');
	const password: Ref<string> = ref('');
	const corpOrBrokerSearchTerm: Ref<string> = ref('');
	const loginAttemptLoading: Ref<boolean> = ref(false);
	const updateProfilePictureLoading: Ref<boolean> = ref(false);
	const searchCorpOrBrokerLoading: Ref<boolean> = ref(false);
	const searchCorpOrBrokerResults: Ref<any[] | null> = ref(null);
	const valuationAuthToken: CookieRef<string | null | undefined> =
		useCookie('valuation_auth_token');
	const avaBasicAuthToken: CookieRef<string | null | undefined> =
		useCookie('ava_basic_auth_token');
	const avaApiKey: CookieRef<string | null | undefined> = useCookie('ava_api_key');
	// const { getPrincipal, setPrincipal, cleanPrincipal } = useValuationPrincipalStore();
	const { post } = useStandardizedApi();
	const { principal, setPrincipal, cleanPrincipal, isBroker } = useValuationPrincipalStore();

	const getValuationAuthToken: ComputedRef<string | null | undefined> = computed(() => {
		return valuationAuthToken.value;
	});
	const getAvaBasicAuthToken: ComputedRef<string | null | undefined> = computed(() => {
		return avaBasicAuthToken.value;
	});
	const getAvaApiKey: ComputedRef<string | null | undefined> = computed(() => {
		return avaApiKey.value;
	});

	function getPrincipal(): ValuationPrinicpal | null {
		return principal;
	}

	async function attemptLogin() {
		const requestURL = '/api/app-security/login-valuation-principal';
		try {
			loginAttemptLoading.value = true;
			const response = await post<LoginResponse>(requestURL, {
				email: email.value,
				password: password.value,
			});

			if (response.success) {
				const data: LoginResponse = (response as StandardSuccessResponse<LoginResponse>)
					.data;

				const principal: ValuationPrinicpal = {
					...data,
					corpOrganization: {
						broker: data.isBroker,
						corpName: data.corpName,
						corpId: data.corpId,
						corpClass: data.corpType,
					},
					accountEnabled: true,
				};
				setPrincipal(principal);
				console.log(principal);

				// handle re-routing
				routeAfterLoadPrincipal(data);
			}
		} catch (ex) {
			useToast('Failed to login. Try Again!', {
				type: 'error',
				title: 'Authentication Error!',
			});
		} finally {
			loginAttemptLoading.value = false;
		}
	}

	const isPrincipalAdmin: ComputedRef<boolean> = computed(() => {
		if (!principal) return false;
		return principal.userRoles.includes('ROLE_CORP_ADMIN');
	});

	function routeAfterLoadPrincipal(data: LoginResponse) {
		if (data.passwordUpdated != undefined && !data.passwordUpdated) {
			return navigateTo({ name: 'password-setup' });
		} else {
			return navigateTo({ name: 'mobivaluer-home' });
		}
	}

	function attemptLogout() {
		// unset the cokies
		valuationAuthToken.value = null;
		avaBasicAuthToken.value = null;
		avaApiKey.value = null;

		cleanPrincipal();

		// clean the vehicles loaded by tracking
		cleanClientDevices();

		// delete the users tracking token
		// trackingAuthToken.value = null;

		// redirect to the login page
		navigateTo({ name: 'exterior-home' });
		useToast('Logout Successful!', {
			type: 'success',
		});
	}

	function displayCookieConsent(): boolean {
		if (!valuationAuthToken.value || !principal) {
			return true;
		}

		return false;
	}

	const isPrincipalBroker: ComputedRef<boolean> = computed(() => isBroker);

	function corporateTypeMatches(t: CorpClass): boolean {
		if (!principal) return false;
		return principal.corpOrganization.corpClass == t;
	}

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
		getValuationAuthToken,
		getAvaBasicAuthToken,
		getAvaApiKey,
		getPrincipal,
		attemptLogin,
		attemptLogout,
		isPrincipalAdmin,
		displayCookieConsent,
		isPrincipalBroker,
		encryptCorporateClientId,
		corporateTypeMatches,
	};
};

export default useAuth;
