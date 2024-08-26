import {
	getCorporateBranches,
	cleanCorporateBranches,
	setCorporateBranches,
} from '~/stores/corporate-branches-store';

export const useCorporateBranch = () => {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const controller = new AbortController();
	const signal = controller.signal;
	const addCorporateBranchLoading: Ref<boolean> = ref(false);
	const editCorporateBranchLoading: Ref<boolean> = ref(false);
	const corporateBranches: ComputedRef<readonly any[]> = computed(
		() => getCorporateBranches.value,
	);

	const {
		status: fetchStatus,
		error: fetchError,
		refresh: refreshBranches,
	} = useFetch('/api/v1/auth/corp-branch/get-all', {
		key: 'corp-branches',
		baseURL: runtimeConfig.public.VALUATION_BASE_URL,
		method: 'GET',
		headers: {
			Accept: 'application/json',
		},
		query: {
			corpId: getPrincipal.value.corpId,
		},
		signal,
		onRequest() {
			if (getCorporateBranches.value.length > 0) {
				// abort the fetch request if data exists
				controller.abort('Branch data exists! Aborting request');
			}
		},
		onResponse({ response }) {
			if (response.status === 200) {
				setCorporateBranches(response._data.data);
			}
		},
	});

	const reloadCorporateBranches = async () => {
		cleanCorporateBranches();
		refreshBranches();
	};

	const addCorporateBranch = async (branchName: string, branchLocation: string) => {
		addCorporateBranchLoading.value = true;
		try {
			await $fetch('/api/v1/auth/corp-branch/add', {
				baseURL: runtimeConfig.public.VALUATION_BASE_URL,
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					branchName: branchName,
					branchLocation: branchLocation,
					recordedBy: getPrincipal.value.userId,
					corpId: getPrincipal.value.corpId,
				}),
				onResponse({ response }) {
					if (response.status === 200) {
						useToast('Branch Added Successfully!', {
							type: 'success',
							showIcon: true,
							showCloseButton: true,
							hideProgressBar: true,
							transition: 'slide',
						});
					} else {
						throw new Error('Adding corporate branch failed. Try again!');
					}
				},
			});
		} catch (error) {
			console.log('An error occured: ', error);
			useToast('Failed. Try Again!', {
				type: 'danger',
				showIcon: true,
				showCloseButton: true,
				hideProgressBar: true,
				transition: 'slide',
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
			await $fetch('/api/v1/auth/corp-branch/update', {
				baseURL: runtimeConfig.public.VALUATION_BASE_URL,
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					branchName: branchName,
					branchLocation: branchLocation,
					updatedBy: getPrincipal.value.userId,
					branchId: branchId,
				}),
				onResponse({ response }) {
					if (response.status === 200) {
						useToast('Updating Successful!', {
							type: 'success',
							showIcon: true,
							showCloseButton: true,
							hideProgressBar: true,
							transition: 'slide',
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
				type: 'danger',
				showIcon: true,
				showCloseButton: true,
				hideProgressBar: true,
				transition: 'slide',
			});
		} finally {
			editCorporateBranchLoading.value = false;
		}
	};

	return {
		corporateBranches,
		fetchStatus,
		fetchError,
		addCorporateBranchLoading,
		editCorporateBranchLoading,
		addCorporateBranch,
		editCorporateBranch,
		refreshBranches,
		cleanCorporateBranches,
		reloadCorporateBranches,
	};
};
