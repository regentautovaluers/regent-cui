export const useAVAMembers = () => {};

export const useAVAMemberships = () => {
	const { getPrincipal } = useAuth();
	const runtimeConfig = useRuntimeConfig();
	const currentPage: Ref<number> = ref(0);
	const size: Ref<number> = ref(10);
	const membersList: Ref<any[]> = ref([]);
	const totalNumber: Ref<number> = ref(0);
	const totalPages: Ref<number> = ref(0);

	// member vehicles list
	const fetchMemberVehiclesLoading: Ref<boolean> = ref(false);
	const memberVehicles: Ref<any[]> = ref([]);

	const { status: fetchMembershipsStatus, execute: refreshMembers } = useFetch(
		'/api/v1/memberships',
		{
			key: 'AVA-memberships',
			baseURL: runtimeConfig.public.AVA_BASE_URL,
			method: 'GET',
			query: {
				corporateId: getPrincipal.value.corpId,
				page: currentPage,
				size: size,
			},
			server: false,
			lazy: false,

			onResponse({ response }) {
				if (response.status !== 200) {
					throw new Error("Failed to retrieve corporate's members");
				}
				membersList.value = response._data.memberships;
				totalNumber.value = response._data.totalCount;
				totalPages.value = response._data.totalPages;
			},
		},
	);

	const getMemberVehicles = async (dbId: number) => {
		try {
			fetchMemberVehiclesLoading.value = true;
			await $fetch(`/api/v1/membershipVehicles/membership/${dbId}`, {
				baseURL: runtimeConfig.public.AVA_BASE_URL,
				method: 'GET',
				onResponse({ response }) {
					if (response.status !== 200) {
						throw new Error("Failed to retrieve corporate's members");
					}
					memberVehicles.value = response._data;
				},
			});
		} catch (err) {
			console.log('Failed to fetch member vehicles. Err: ', err);
			useToast('Failed to Fetch Vehicles!', {
				type: 'danger',
				showIcon: true,
				showCloseButton: true,
				hideProgressBar: false,
				transition: 'slide',
			});
		} finally {
			fetchMemberVehiclesLoading.value = false;
		}
	};

	return {
		currentPage,
		membersList,
		totalNumber,
		totalPages,
		fetchMembershipsStatus,
		fetchMemberVehiclesLoading,
		memberVehicles,
		getMemberVehicles,
		refreshMembers,
	};
};
