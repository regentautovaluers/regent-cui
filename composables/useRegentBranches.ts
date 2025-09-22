export const useRegentBranches = () => {
	const runtimeConfig = useRuntimeConfig();
	const nuxtApp = useNuxtApp();

	const {
		data: regentBranches,
		status: fetchStatus,
		error: fetchError,
		refresh: refreshRegentBranches,
	} = useFetch('/api/v1/regent-branch/get-all', {
		key: 'corp-branches',
		baseURL: runtimeConfig.public.VALUATION_BASE_URL,
		method: 'GET',
		headers: {
			Accept: '',
		},
		server: false,
		lazy: true,
		transform(data: any) {
			return data.data.map((data: any) => {
				return {
					branchId: data.branchId,
					branchName: data.branchName,
				};
			});
		},
		getCachedData(key) {
			return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
		},
	}) as any;

	return {
		regentBranches,
		fetchStatus,
		fetchError,
		refreshRegentBranches,
	};
};
