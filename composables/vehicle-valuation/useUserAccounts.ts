const useUserAccounts = () => {
	// for when loading users
	const totalPages: ComputedRef<number> = computed(() => fetchedData.value?.totalPages);
	const usersList: ComputedRef<any[] | null> = computed(() => fetchedData.value?.users ?? []);
	const page: Ref<number> = ref(0);
	const pageSize: number = 10;
	const { getPrincipal } = useAuth();
	const runtimeConfig = useRuntimeConfig();

	// adding / updating user accounts
	const addNewAccountLoading: Ref<boolean> = ref(false);
	const updateCorporateAccountLoading: Ref<boolean> = ref(false);
	const searchSlug: Ref<string | null> = ref(null);
	const { put, post } = useStandardizedApi();

	const {
		status: fetchStatus,
		error: fetchError,
		data: fetchedData,
		execute: executeFetchUsers,
	} = useFetch(
		computed(() => {
			let requestURL = `/api/v1/auth/corporate-account/get-accounts?corporateId=${getPrincipal()?.corpOrganization.corpId}&page=${page.value}&size=${pageSize}`;
			if (searchSlug.value != null) {
				requestURL = requestURL + `&searchSlug=${searchSlug.value}`;
			}
			return requestURL;
		}),
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

	async function addNewAccount(
		username: string,
		email: string,
		phoneNumber: string,
		password: string,
		corporateBranchId: string,
		roleInOrganization: string,
		roles: string[],
		cleanRefs: () => void,
	) {
		addNewAccountLoading.value = true;
		try {
			let response = await post<any>('/api/app-security/create-account', {
				username: username,
				email: email,
				phoneNumber: phoneNumber,
				password: password,
				corporateId: getPrincipal()?.corpOrganization.corpId,
				corpBranchId: corporateBranchId,
				roleInOrganization: roleInOrganization,
				userRoles: roles,
			});
			if (response.success) {
				useToast('Account Created Successfully!', {
					type: 'success',
				});
				cleanRefs();
			}
		} catch (error) {
			console.log('An error occured: ', error);
			useToast('Failed. Try Again!', {
				type: 'error',
			});
		} finally {
			addNewAccountLoading.value = false;
		}
	}

	async function updateMyAccountDetails(
		userId: string,
		firstName: string,
		lastName: string,
		email: string,
		phoneNumber: string,
		newPassword: string | null,
		roleInOrganization: string,
		isAccountEnabled: boolean,
		corporateBranchId: string,
		roles?: string[],
	) {
		updateCorporateAccountLoading.value = true;
		try {
			let response = await put<any>('/api/app-security/update-valuation-principal', {
				userId: userId,
				username: `${firstName} ${lastName}`,
				email: email,
				password: newPassword,
				phoneNumber: phoneNumber,
				roleInOrganization: roleInOrganization,
				corpBranchId: corporateBranchId,
				isAccountEnabled: isAccountEnabled,
				userRoles: !roles ? null : roles,
			});

			if (response.success) {
				useToast('Updated successfully. Kindly Reload!', {
					type: 'success',
					title: 'Success',
				});
			}
		} catch (error) {
			console.log('An error occured: ', error);
			useToast('Failed. Try Again!', {
				type: 'error',
			});
		} finally {
			updateCorporateAccountLoading.value = false;
		}
	}

	return {
		page,
		pageSize,
		totalPages,
		usersList,
		fetchStatus,
		updateMyAccountDetails,
		updateCorporateAccountLoading,
		addNewAccountLoading,
		searchSlug,
		addNewAccount,
		executeFetchUsers,
	};
};

export default useUserAccounts;
