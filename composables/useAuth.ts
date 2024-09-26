import { useStorage, type RemovableRef } from '@vueuse/core';
import { type LoggedInPrincipal } from '~/types';
import type { CookieRef } from '#app';

const useAuth = () => {
	const runtimeConfig = useRuntimeConfig();
	const email: Ref<string> = ref('');
	const password: Ref<string> = ref('');
	const corpOrBrokerSearchTerm: Ref<string> = ref('');
	const loginAttemptLoading: Ref<boolean> = ref(false);
	const updateCorporateAccountLoading: Ref<boolean> = ref(false);
	const updateProfilePictureLoading: Ref<boolean> = ref(false);
	const searchCorpOrBrokerLoading: Ref<boolean> = ref(false);
	const searchCorpOrBrokerResults: Ref<any[] | null> = ref(null);
	const addNewAccountLoading: Ref<boolean> = ref(false);
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
		return `/api/v1/auth/corp-org/search-corp?searchKey=${corpOrBrokerSearchTerm.value}&isBroker=${isPrincipalBroker() ? false : true}`;
	});

	const attemptLogin = async () => {
		loginAttemptLoading.value = true;
		try {
			await $fetch('/api/v1/auth/corp-account/login', {
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

	const updateMyAccountDetails = async (
		userId: string,
		firstName: string,
		lastName: string,
		email: string,
		phoneNumber: string,
		roleInOrganization: string,
		isAccountEnabled: boolean,
		corporateBranchId: string,
		roles?: string[],
	) => {
		updateCorporateAccountLoading.value = true;
		try {
			await $fetch('/api/v1/auth/corp-account/update-account-details', {
				baseURL: runtimeConfig.public.VALUATION_BASE_URL,
				method: 'PUT',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId: userId,
					firstName: firstName,
					lastName: lastName,
					email: email,
					phoneNumber: phoneNumber,
					roleInOrganization: roleInOrganization,
					corpBranchId: corporateBranchId,
					isAccountEnabled: isAccountEnabled,
					userRoles: !roles ? null : roles,
				}),
				onResponse({ response }) {
					if (response.status === 200) {
						useToast('Update Successful!', {
							type: 'success',
							showIcon: false,
							showCloseButton: false,
							hideProgressBar: true,
						});
					} else {
						throw new Error('Account updating failed. Try again!');
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
			updateCorporateAccountLoading.value = false;
		}
	};

	const addNewAccount = async (
		firstName: string,
		lastName: string,
		email: string,
		phoneNumber: string,
		password: string,
		corporateBranchId: string,
		roleInOrganization: string,
		roles: string[],
		cleanRefs: () => void,
	) => {
		addNewAccountLoading.value = true;
		try {
			await $fetch('/api/v1/auth/corp-account/signup', {
				baseURL: runtimeConfig.public.VALUATION_BASE_URL,
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					firstName: firstName,
					lastName: lastName,
					email: email,
					phoneNumber: phoneNumber,
					password: password,
					profilePicture: null,
					corporateId: getPrincipal.value.corpId,
					corpBranchId: corporateBranchId,
					roleInOrganization: roleInOrganization,
					userRoles: roles,
				}),
				onResponse({ response }) {
					if (response.status === 200) {
						useToast('Account Creation Successful!', {
							type: 'success',
							showIcon: false,
							showCloseButton: false,
							hideProgressBar: true,
						});
					} else {
						throw new Error('Account creation failed. Try again!');
					}
					cleanRefs();
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
			addNewAccountLoading.value = false;
		}
	};

	const isPrincipalAdmin = (): boolean => {
		return authenticatedPrincipal.value.roles.includes('role_corp_admin'.toUpperCase());
	};

	const updateProfilePicture = async () => {
		const fileInput = document.getElementById('profile-picture') as HTMLInputElement;
		if (fileInput.files && fileInput.files.length > 0) {
			const file = fileInput.files[0];
			if (file.size > 2 * 1024 * 1024) {
				alert('File size exceeds 2MB. Please select a smaller file.');
				return;
			}

			const formData = new FormData();
			formData.append('profilePicture', file);
			formData.append('userId', getPrincipal.value.userId);
			formData.append('corporateId', getPrincipal.value.corpId);
			updateProfilePictureLoading.value = true;

			try {
				await $fetch('/api/v1/auth/corp-account/update-profile-picture', {
					baseURL: runtimeConfig.public.VALUATION_BASE_URL,
					method: 'PATCH',
					headers: {
						Accept: 'application/json',
					},
					body: formData,
					onResponse({ response }) {
						if (response.status === 200) {
							const serverResponse = response._data.data;
							authenticatedPrincipal.value.profilePicture = serverResponse;
							useToast('Profile Picture Updated Successfully!', {
								type: 'success',
								showIcon: false,
								showCloseButton: false,
								hideProgressBar: true,
							});
						} else {
							throw new Error('Account updating failed. Try again!');
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
				updateProfilePictureLoading.value = false;
			}
		}
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
					if (response.status === 200) {
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
		updateCorporateAccountLoading,
		updateProfilePictureLoading,
		addNewAccountLoading,
		searchCorpOrBrokerLoading,
		searchCorpOrBrokerResults,
		getPrincipal,
		getAuthToken,
		getCsrfToken,
		attemptLogin,
		attemptLogout,
		isPrincipalAdmin,
		updateMyAccountDetails,
		addNewAccount,
		updateProfilePicture,
		displayCookieConsent,
		isPrincipalBroker,
		searchCorporateOrBroker,
	};
};

export default useAuth;
