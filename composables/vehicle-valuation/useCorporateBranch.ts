export const useCorporateBranch = () => {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const nuxtApp = useNuxtApp();
	const addCorporateBranchLoading: Ref<boolean> = ref(false);
	const editCorporateBranchLoading: Ref<boolean> = ref(false);

	const {
		data: corporateBranches,
		status: fetchStatus,
		error: fetchError,
		refresh: refreshBranches,
	} = useFetch(`/api/v1/corporate-branch/get-all?corpId=${getPrincipal.value?.corpId}`, {
		key: 'corp-branches',
		baseURL: runtimeConfig.public.VALUATION_BASE_URL,
		method: 'GET',
		headers: {
			Accept: '',
		},
		server: false,
		lazy: true,
		transform(data: any) {
			return data.data;
		},
		getCachedData(key) {
			return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
		},
	}) as any;

	const reloadCorporateBranches = async () => {
		refreshBranches();
	};

	const addCorporateBranch = async (branchName: string, branchLocation: string) => {
		addCorporateBranchLoading.value = true;
		try {
			await $fetch('/api/v1/corporate-branch/add', {
				baseURL: runtimeConfig.public.VALUATION_BASE_URL,
				method: 'POST',
				headers: {
					Accept: '',
					'Content-Type': '',
				},
				body: JSON.stringify({
					branchName: branchName,
					branchLocation: branchLocation,
					corpId: getPrincipal.value?.corpId,
				}),
				onResponse({ response }) {
					if (response.ok) {
						useToast('Branch Added Successfully!', {
							type: 'success',
						});
					} else {
						throw new Error('Adding corporate branch failed. Try again!');
					}
				},
			});
		} catch (error) {
			console.log('An error occured: ', error);
			useToast('Failed. Try Again!', {
				type: 'error',
			});
		} finally {
			addCorporateBranchLoading.value = false;
		}
	};

	const editCorporateBranch = async (
		branchName: string,
		branchLocation: string,
		branchId: string,
	) => {
		editCorporateBranchLoading.value = true;
		try {
			await $fetch('/api/v1/corporate-branch/update', {
				baseURL: runtimeConfig.public.VALUATION_BASE_URL,
				method: 'POST',
				headers: {
					Accept: '',
					'Content-Type': '',
				},
				body: JSON.stringify({
					branchName: branchName,
					branchLocation: branchLocation,
					branchId: branchId,
				}),
				onResponse({ response }) {
					if (response.ok) {
						useToast('Updating Successful!', {
							type: 'success',
						});
						reloadCorporateBranches();
					} else {
						throw new Error('Adding corporate branch failed. Try again!');
					}
				},
			});
		} catch (error) {
			console.log('An error occured: ', error);
			useToast('Failed! Try Again', {
				type: 'error',
			});
		} finally {
			editCorporateBranchLoading.value = false;
		}
	};

	return {
		fetchStatus,
		fetchError,
		addCorporateBranchLoading,
		editCorporateBranchLoading,
		corporateBranches,
		addCorporateBranch,
		editCorporateBranch,
		refreshBranches,
		reloadCorporateBranches,
	};
};
