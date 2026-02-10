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
	const authToken: CookieRef<string | null | undefined> = useCookie('valuation_auth_token');
	// const { getPrincipal, setPrincipal, cleanPrincipal } = useValuationPrincipalStore();
	const { post } = useStandardizedApi();
	const { principal, setPrincipal, cleanPrincipal, isBroker } = useValuationPrincipalStore();

	const getAuthToken: ComputedRef<string | null | undefined> = computed(() => {
		return authToken.value;
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

				// set the auth token
				authToken.value = data.jwtToken;

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

				// navigate to console homepage
				navigateTo({ name: 'mobivaluer-home' });
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

	const attemptLogout = () => {
		// unset the auth token and stored principal
		authToken.value = null;
		cleanPrincipal();

		// clean the vehicles loaded by tracking
		cleanClientDevices();

		// delete the users tracking token
		// trackingAuthToken.value = null;

		useToast('Logout Successful!', {
			type: 'success',
		});

		// redirect to the login page
		navigateTo({ name: 'exterior-home' });
	};

	const displayCookieConsent = (): boolean => {
		if (!authToken.value || !principal) {
			return true;
		}

		return false;
	};

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
		getAuthToken,
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
