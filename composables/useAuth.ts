import { useStorage, type RemovableRef } from '@vueuse/core';
import { type LoggedInPrincipal } from '~/types';
import type { CookieRef } from '#app';

const useAuth = () => {
	const runtimeConfig = useRuntimeConfig();
	const email: Ref<string> = ref('');
	const password: Ref<string> = ref('');
	const corpOrBrokerSearchTerm: Ref<string> = ref('');
	const loginAttemptLoading: Ref<boolean> = ref(false);
	const updateProfilePictureLoading: Ref<boolean> = ref(false);
	const searchCorpOrBrokerLoading: Ref<boolean> = ref(false);
	const searchCorpOrBrokerResults: Ref<any[] | null> = ref(null);

	const authenticatedPrincipal: RemovableRef<LoggedInPrincipal> = useStorage(
		'authenticated-principal',
		{
			userId: '',
			username: '',
			email: '',
			phonenumber: '',
			roles: [],
			profilePicture: '',
			corpId: '',
			branchId: '',
			corpName: '',
			roleInOrganization: '',
			isBroker: false,
		},
	);
	const authToken: CookieRef<string | null | undefined> = useCookie('auth-token');
	const csrfToken: CookieRef<string | null | undefined> = useCookie('csrf-token');

	const getPrincipal: ComputedRef<LoggedInPrincipal> = computed(() => {
		return authenticatedPrincipal.value;
	});

	const getAuthToken: ComputedRef<string | null | undefined> = computed(() => {
		return authToken.value;
	});

	const getCsrfToken: ComputedRef<string | null | undefined> = computed(() => {
		return csrfToken.value;
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
					switch (response.status) {
						case 401: {
							useToast('Invalid Credentials', {
								type: 'warning',
								showIcon: true,
								showCloseButton: false,
								hideProgressBar: true,
							});
							break;
						}

						case 200: {
							useToast('Login Successful', {
								type: 'success',
								showIcon: true,
								showCloseButton: false,
								hideProgressBar: true,
							});

							setCredentialsInBrowserStorage(response._data.data);
							navigateTo({ name: 'mobivaluer-home' });
						}
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

	const isPrincipalAdmin = (): boolean => {
		return authenticatedPrincipal.value.roles.includes('role_corp_admin'.toUpperCase());
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

	const setCredentialsInBrowserStorage = (data: any) => {
		// set the principal
		const principal: LoggedInPrincipal = {
			userId: data.userId,
			username: data.username,
			email: data.email,
			phonenumber: data.phoneNumber,
			roles: data.userRoles,
			profilePicture:
				data.profilePicture === null
					? '/images/profile-pic-placeholder.png'
					: data.profilePicture,
			corpId: data.corpId,
			branchId: data.branchId,
			corpName: data.corpName,
			roleInOrganization: data.roleInOrganization,
			isBroker: data.isBroker,
		};

		authenticatedPrincipal.value = principal;

		// set the auth and csrf tokens
		authToken.value = data.jwtToken;
		csrfToken.value = data.xsrfToken;
	};

	const attemptLogout = () => {
		// unset the principal
		authenticatedPrincipal.value = {
			userId: '',
			username: '',
			email: '',
			phonenumber: '',
			roles: [],
			profilePicture: '',
			corpId: '',
			branchId: '',
			corpName: '',
			roleInOrganization: '',
			isBroker: false,
		};

		// unset the auth token and csrf token
		authToken.value = '';
		csrfToken.value = '';
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
		if (!authToken.value || !csrfToken.value || !authenticatedPrincipal.value) {
			return true;
		}

		return false;
	};

	const isPrincipalBroker = (): boolean => {
		return authenticatedPrincipal.value.isBroker;
	};

	return {
		email,
		password,
		corpOrBrokerSearchTerm,
		loginAttemptLoading,
		updateProfilePictureLoading,
		searchCorpOrBrokerLoading,
		searchCorpOrBrokerResults,
		getPrincipal,
		getAuthToken,
		getCsrfToken,
		attemptLogin,
		attemptLogout,
		isPrincipalAdmin,
		displayCookieConsent,
		isPrincipalBroker,
		searchCorporateOrBroker,
	};
};

export default useAuth;
