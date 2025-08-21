import { type IndividuaProcessedMembershipType } from '~/types';

export const useAVAMemberships = () => {
	const { getPrincipal } = useAuth();
	const runtimeConfig = useRuntimeConfig();
	const currentPage: Ref<number> = ref(0);
	const size = 10;
	const searchTerm: Ref<string> = ref('');
	const corporateMemberships: ComputedRef<any[]> = computed(() => fetchedData.value?.memberships);
	const totalNumber: ComputedRef<number> = computed(
		() => corporateMemberships.value?.length ?? 0,
	);
	const totalPages: ComputedRef<number> = computed(() => fetchedData.value?.totalPages);

	// member vehicles
	const fetchMemberVehiclesLoading: Ref<boolean> = ref(false);
	const memberVehicles: Ref<any[]> = ref([]);
	const updateMemberDetailsLoading: Ref<boolean> = ref(false);
	const addMemberVehicleLoading: Ref<boolean> = ref(false);
	const membershipType: Ref<'roadside-assistance' | 'emergency-evacuation' | null> = ref(null);

	const {
		status: fetchMembershipsStatus,
		execute: executeFetchMemberships,
		data: fetchedData,
	} = useFetch(
		() => {
			let requestURL = `/api/v1/memberships?corporateId=${getPrincipal.value.corpId}&page=${currentPage.value}&size=${size}`;

			if (searchTerm.value !== '') {
				requestURL = requestURL + `&searchTerm=${searchTerm.value}`;
			}

			if (membershipType.value) {
				if (membershipType.value == 'roadside-assistance') {
					requestURL = requestURL + `&membershipType=1`;
				}

				if (membershipType.value == 'emergency-evacuation') {
					requestURL = requestURL + `&membershipType=2`;
				}
			}

			return requestURL;
		},
		{
			key: 'ava-memberships',
			baseURL: runtimeConfig.public.AVA_BASE_URL,
			method: 'GET',
			server: false,
			lazy: true,
			transform(response: any) {
				if (
					response?.memberships &&
					Array.isArray(response.memberships) &&
					(response.memberships as []).length > 0
				) {
					return {
						memberships: response.memberships,
						totalPages: response.totalPages,
					};
				} else {
					return {
						memberships: [],
						totalPages: 0,
					};
				}
			},
			watch: [currentPage],
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

	return {
		currentPage,
		corporateMemberships,
		totalNumber,
		totalPages,
		searchTerm,
		membershipType,
		fetchMembershipsStatus,
		fetchMemberVehiclesLoading,
		updateMemberDetailsLoading,
		addMemberVehicleLoading,
		memberVehicles,
		getMemberVehicles,
		updateMemberDetails,
		addMemberVehicles,
		executeFetchMemberships,
	};
};
