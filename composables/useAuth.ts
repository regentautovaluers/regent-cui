import { useStorage, type RemovableRef } from '@vueuse/core';
import { type LoggedInPrincipal } from '~/types';
import type { CookieRef } from '#app';

const useAuth = () => {
	const email: Ref<string> = ref('');
	const password: Ref<string> = ref('');
	const loginAttemptLoading: Ref<boolean> = ref(false);
	const updateCorporateAccountLoading: Ref<boolean> = ref(false);
	const updateProfilePictureLoading: Ref<boolean> = ref(false);
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
		},
	);
	const authToken: CookieRef<string | null | undefined> = useCookie('auth-token');
	const csrfToken: CookieRef<string | null | undefined> = useCookie('csrf-token');
	const runtimeConfig = useRuntimeConfig();

	const getPrincipal: ComputedRef<LoggedInPrincipal> = computed(() => {
		return authenticatedPrincipal.value;
	});

	const getAuthToken: ComputedRef<string | null | undefined> = computed(() => {
		return authToken.value;
	});

	const getCsrfToken: ComputedRef<string | null | undefined> = computed(() => {
		return csrfToken.value;
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
							// loginSuccess.value = false;
							// loginAttemptMessage.value = 'Invalid credentials. Try again!';
							// break;
						}

						case 200: {
							// loginSuccess.value = true;
							// loginAttemptMessage.value = 'Success. Will redirect you shortly!';

							setCredentialsInBrowserStorage(response._data.data);
							navigateTo({ name: 'mobivaluer-home' });
						}
					}
				},

				onRequestError({ error }) {
					// loginSuccess.value = false;
					// loginAttemptMessage.value = 'Something went wrong! Try again!';
				},
			});
		} catch (er) {
			console.log('Error encountered. Reason: ', er);
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
						// openToast('Account updated successfully!', 'success');
					} else {
						throw new Error('Account updating failed. Try again!');
					}
				},
			});
		} catch (error) {
			console.log('An error occured: ', error);
			// openToast('Account updating failed. Try again!', 'danger');
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
						// openToast('Account creation successfull!', 'success');
					} else {
						throw new Error('Account creation failed. Try again!');
					}
					cleanRefs();
				},
			});
		} catch (error) {
			console.log('An error occured: ', error);
			// openToast('Account creation failed. Try again!', 'danger');
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
							// openToast('Success! Effect takes place on next login.', 'success');
						} else {
							throw new Error('Account updating failed. Try again!');
						}
					},
				});
			} catch (error) {
				console.log('An error occured: ', error);
				// openToast('Failed to upload profile picture. Try again!', 'danger');
			} finally {
				updateProfilePictureLoading.value = false;
			}
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
					? '/images/profile-pic-placeholder.jpg'
					: data.profilePicture,
			corpId: data.corpId,
			branchId: data.branchId,
			corpName: data.corpName,
			roleInOrganization: data.roleInOrganization,
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
		};

		// unset the auth token and csrf token
		authToken.value = '';
		csrfToken.value = '';

		// redirect to the login page
		navigateTo({ name: 'exterior-home' });
	};

	return {
		email,
		password,
		loginAttemptLoading,
		updateCorporateAccountLoading,
		updateProfilePictureLoading,
		addNewAccountLoading,
		getPrincipal,
		getAuthToken,
		getCsrfToken,
		attemptLogin,
		attemptLogout,
		isPrincipalAdmin,
		updateMyAccountDetails,
		addNewAccount,
		updateProfilePicture,
	};
};

export default useAuth;
