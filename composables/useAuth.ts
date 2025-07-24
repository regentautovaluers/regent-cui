import type { CookieRef } from '#app';
import {
	getAuthenticatedPrincipal,
	setAuthenticatedPrincipal,
} from '~/stores/authenticated-principal';

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
	const refreshToken: CookieRef<string | null | undefined> = useCookie('refresh-token');

	const getAuthToken: ComputedRef<string | null | undefined> = computed(() => {
		return authToken.value;
	});

	const searchBrokerOrCorpURI: ComputedRef<string> = computed(() => {
		return `/api/v1/corporate-organization/get-all?searchKey=${corpOrBrokerSearchTerm.value}&isBroker=${isPrincipalBroker() ? false : true}`;
	});

	const attemptLogin = async () => {
		loginAttemptLoading.value = true;
		try {
			await $fetch('/api/v1/auth/corporate-account/login', {
				baseURL: runtimeConfig.public.VALUATION_BASE_URL,
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: email.value,
					password: password.value,
				}),

				onResponse({ response }) {
					if (!response.ok) {
						useToast('Invalid Credentials', {
							type: 'warning',
							showIcon: true,
							showCloseButton: false,
							hideProgressBar: true,
						});
						return;
					}

					const data = response._data.data;
					// set the refresh and access tokens
					authToken.value = data.jwtToken;
					refreshToken.value = data.refreshToken;

					// set the authenticated principal
					const principal = {
						userId: data.userId,
						username: data.username,
						email: data.email,
						phonenumber: data.phoneNumber,
						roles: data.userRoles,
						branchName: '',
						corpId: data.corpId,
						branchId: data.branchId,
						corpName: data.corpName,
						roleInOrganization: data.roleInOrganization,
						isBroker: data.isBroker,
					};
					setAuthenticatedPrincipal(principal);

					navigateTo({ name: 'mobivaluer-home' });
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

	const isPrincipalAdmin = (): boolean => {
		return getAuthenticatedPrincipal.value?.roles.includes('role_corp_admin'.toUpperCase());
	};

	const searchCorporateOrBroker = async () => {
		searchCorpOrBrokerResults.value = null;
		searchCorpOrBrokerLoading.value = true;

		try {
			await $fetch(searchBrokerOrCorpURI.value, {
				baseURL: runtimeConfig.public.VALUATION_BASE_URL,
				method: 'GET',
				headers: {
					Accept: 'application/json',
				},
				onResponse({ response }) {
					if (response.ok) {
						const serverResponse = response._data.data;
						searchCorpOrBrokerResults.value = serverResponse;
					} else {
						throw new Error('Search failed. Try again!');
					}
				},
			});
		} catch (error) {
			console.log('An error occured: ', error);
			useToast('Failed. Try Again!', {
				type: 'danger',
				showIcon: false,
				showCloseButton: false,
				hideProgressBar: true,
			});
		} finally {
			searchCorpOrBrokerLoading.value = false;
		}
	};

	const attemptLogout = () => {
		// unset the auth token and csrf token
		authToken.value = '';
		refreshToken.value = '';
		useToast('Logout Successful!', {
			type: 'success',
			showIcon: false,
			showCloseButton: false,
			hideProgressBar: true,
		});

		// redirect to the login page
		navigateTo({ name: 'exterior-home' });
	};

	const displayCookieConsent = (): boolean => {
		if (!authToken.value || !refreshToken.value || !getAuthenticatedPrincipal.value) {
			return true;
		}

		return false;
	};

	const isPrincipalBroker = (): boolean => {
		return getAuthenticatedPrincipal.value?.isBroker;
	};

	return {
		email,
		password,
		corpOrBrokerSearchTerm,
		loginAttemptLoading,
		updateProfilePictureLoading,
		searchCorpOrBrokerLoading,
		searchCorpOrBrokerResults,
		getAuthenticatedPrincipal,
		getAuthToken,
		attemptLogin,
		attemptLogout,
		isPrincipalAdmin,
		displayCookieConsent,
		isPrincipalBroker,
		searchCorporateOrBroker,
	};
};

export default useAuth;
