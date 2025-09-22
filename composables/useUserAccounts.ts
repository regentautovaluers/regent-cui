const useUserAccounts = () => {
	// for when loading users
	const totalPages: ComputedRef<number> = computed(() => fetchedData.value?.totalPages);
	const usersList: ComputedRef<any[]> = computed(() => fetchedData.value?.users);
	const page: Ref<number> = ref(0);
	const pageSize: number = 10;
	const { getPrincipal } = useAuth();
	const runtimeConfig = useRuntimeConfig();

	// adding / updating user accounts
	const addNewAccountLoading: Ref<boolean> = ref(false);
	const updateCorporateAccountLoading: Ref<boolean> = ref(false);

	const {
		status: fetchStatus,
		error: fetchError,
		data: fetchedData,
	} = useFetch(
		`/api/v1/auth/corporate-account/get-accounts?corporateId=${getPrincipal.value.corpId}&page=${page.value}&size=${pageSize}`,
		{
			key: 'corporate-users',
			baseURL: runtimeConfig.public.VALUATION_BASE_URL,
			method: 'GET',
			headers: {
				Accept: '',
			},
			server: false,
			lazy: true,
			transform(response: any) {
				if (
					response?.data &&
					Array.isArray(response.data) &&
					(response.data as []).length > 0
				) {
					return {
						users: response.data,
						totalPages: response.requestExtras?.totalPages || 0,
					};
				} else {
					return {
						users: [],
						totalPages: 0,
					};
				}
			},
			watch: [page],
		},
	);

	const addNewAccount = async (
		username: string,
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
			await $fetch('/api/v1/auth/corporate-account/signup', {
				baseURL: runtimeConfig.public.VALUATION_BASE_URL,
				method: 'POST',
				headers: {
					Accept: '',
					'Content-Type': '',
				},
				body: JSON.stringify({
					username: username,
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
					if (response.ok) {
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
			await $fetch('/api/v1/auth/corporate-account/update-account-details', {
				baseURL: runtimeConfig.public.VALUATION_BASE_URL,
				method: 'PUT',
				headers: {
					Accept: '',
					'Content-Type': '',
				},
				body: JSON.stringify({
					userId: userId,
					username: `${firstName} ${lastName}`,
					email: email,
					phoneNumber: phoneNumber,
					roleInOrganization: roleInOrganization,
					corpBranchId: corporateBranchId,
					isAccountEnabled: isAccountEnabled,
					userRoles: !roles ? null : roles,
				}),
				onResponse({ response }) {
					if (response.ok) {
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

	return {
		page,
		pageSize,
		totalPages,
		usersList,
		fetchStatus,
		updateMyAccountDetails,
		updateCorporateAccountLoading,
		addNewAccountLoading,
		addNewAccount,
	};
};

export default useUserAccounts;
