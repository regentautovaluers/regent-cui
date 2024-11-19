import { type IndividuaProcessedMembershipType } from '~/types';

export const useAVAMemberships = () => {
	const { getPrincipal } = useAuth();
	const runtimeConfig = useRuntimeConfig();
	const currentPage: Ref<number> = ref(0);
	const size = 10;
	const searchTerm: Ref<string> = ref('');
	const corporateMemberships: Ref<any[]> = ref([]);
	const totalNumber: Ref<number> = ref(0);
	const totalPages: Ref<number> = ref(0);
	const nuxtApp = useNuxtApp();
	const { name: routeName } = useRoute();

	// member vehicles
	const fetchMemberVehiclesLoading: Ref<boolean> = ref(false);
	const memberVehicles: Ref<any[]> = ref([]);
	const updateMemberDetailsLoading: Ref<boolean> = ref(false);
	const addMemberVehicleLoading: Ref<boolean> = ref(false);

	const { status: fetchMembershipsStatus, refresh: refreshMembers } = useFetch(
		() => {
			let requestURL = `/api/v1/memberships?corporateId=${getPrincipal.value.corpId}&page=${currentPage.value}&size=${size}`;

			if (searchTerm.value !== '') {
				requestURL = requestURL + `&searchTerm=${searchTerm.value}`;
			}

			if (routeName == 'ava-ra-members') {
				requestURL = requestURL + `&membershipType=1`;
			} else if (routeName == 'ava-ee-members') {
				requestURL = requestURL + `&membershipType=2`;
			}

			return requestURL;
		},
		{
			key: 'AVA-memberships' + currentPage.value,
			baseURL: runtimeConfig.public.AVA_BASE_URL,
			method: 'GET',
			server: false,
			lazy: true,
			onResponse({ response }) {
				const responseData = response._data;
				corporateMemberships.value = responseData.memberships;

				if (searchTerm.value.length === 0) totalNumber.value = responseData.totalCount;
				totalPages.value = responseData.totalPages;
			},
			getCachedData: (key) => {
				// Check if the data is already cached in the Nuxt payload
				if (nuxtApp.isHydrating && nuxtApp.payload.data[key]) {
					return nuxtApp.payload.data[key];
				}

				// Check if the data is already cached in the static data
				if (nuxtApp.static.data[key]) {
					return nuxtApp.static.data[key];
				}
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
				showCloseButton: false,
				hideProgressBar: true,
				transition: 'slide',
			});
		} finally {
			fetchMemberVehiclesLoading.value = false;
		}
	};

	const addMemberVehicles = async (
		membershipId: number,
		vehicles: IndividuaProcessedMembershipType[],
	) => {
		addMemberVehicleLoading.value = true;

		try {
			await $fetch('/api/v1/membershipVehicles', {
				baseURL: runtimeConfig.public.AVA_BASE_URL,
				method: 'POST',
				body: JSON.stringify({
					membershipId: membershipId,
					vehicles: vehicles,
				}),

				async onResponse({ response }) {
					if (response.status !== 201) {
						throw new Error('Something went wrong');
					}

					useToast('Vehicle Added Sucessfully!', {
						type: 'success',
						showIcon: true,
						showCloseButton: false,
						hideProgressBar: true,
						transition: 'slide',
					});
				},
			});
		} catch (err) {
			console.log('Error encountered. Reason: ', err);
			useToast('Failed. Try Again!', {
				type: 'danger',
				showIcon: true,
				showCloseButton: false,
				hideProgressBar: true,
				transition: 'slide',
			});
		} finally {
			addMemberVehicleLoading.value = false;
		}
	};

	const updateMemberDetails = async (
		memberId: number,
		clientName: string,
		clientPhone: string,
		clientEmail: string,
	) => {
		updateMemberDetailsLoading.value = true;
		try {
			await $fetch(`api/v1/memberships/${memberId}`, {
				baseURL: runtimeConfig.public.AVA_BASE_URL,
				method: 'PATCH',
				body: JSON.stringify({
					full_name: clientName,
					phone_number: clientPhone,
					userEmail: clientEmail,
				}),

				async onResponse({ response }) {
					if (response.status !== 200) {
						throw new Error('Member details not updated.');
					}
					useToast('Update Successful!', {
						type: 'success',
						showIcon: true,
						showCloseButton: false,
						hideProgressBar: true,
						transition: 'slide',
					});
				},
			});
		} catch (error) {
			console.log('Error encountered. Reason: ', error);
			useToast('Failed. Try Again!', {
				type: 'danger',
				showIcon: true,
				showCloseButton: false,
				hideProgressBar: true,
				transition: 'slide',
			});
		} finally {
			updateMemberDetailsLoading.value = false;
		}
	};

	const handleSearchTriggered = (searchSlug: string) => {
		currentPage.value = 0;
		corporateMemberships.value = [];
		searchTerm.value = searchSlug;
	};

	return {
		currentPage,
		corporateMemberships,
		totalNumber,
		totalPages,
		searchTerm,
		fetchMembershipsStatus,
		fetchMemberVehiclesLoading,
		updateMemberDetailsLoading,
		addMemberVehicleLoading,
		memberVehicles,
		getMemberVehicles,
		updateMemberDetails,
		addMemberVehicles,
		refreshMembers,
		handleSearchTriggered,
	};
};
