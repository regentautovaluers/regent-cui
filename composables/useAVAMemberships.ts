import { type IndividuaProcessedMembershipType } from '~/types';
import { getAvaMembers, setAvaMembers, cleanAvaMembers } from '~/stores/ava-members-store';

export const useAVAMemberships = () => {
	// signal for managing memberships request
	const controller = new AbortController();
	const signal = controller.signal;

	const { getPrincipal } = useAuth();
	const runtimeConfig = useRuntimeConfig();
	const currentPage: Ref<number> = ref(0);
	const size: Ref<number> = ref(10);
	const totalNumber: Ref<number> = ref(0);
	const totalPages: Ref<number> = ref(0);

	// member vehicles
	const fetchMemberVehiclesLoading: Ref<boolean> = ref(false);
	const memberVehicles: Ref<any[]> = ref([]);
	const updateMemberDetailsLoading: Ref<boolean> = ref(false);
	const addMemberVehicleLoading: Ref<boolean> = ref(false);

	const membersListSlice: ComputedRef<any[]> = computed(() => {
		const startIndex = currentPage.value * size.value;
		const endIndex = (currentPage.value + 1) * size.value;
		return getAvaMembers.value.slice(startIndex, endIndex).length
			? getAvaMembers.value.slice(startIndex, endIndex)
			: [];
	});

	const { status: fetchMembershipsStatus, refresh: refreshMembers } = useFetch(
		'/api/v1/memberships',
		{
			key: 'AVA-memberships',
			baseURL: runtimeConfig.public.AVA_BASE_URL,
			method: 'GET',
			query: {
				corporateId: getPrincipal.value.corpId,
				page: currentPage,
				size: size.value,
			},
			server: false,
			lazy: true,
			signal,
			onRequest() {
				if (membersListSlice.value.length) {
					// abort the fetch request if data exists
					controller.abort('Memberships data exists! Aborting request');
				}
			},

			onResponse({ response }) {
				if (response.status !== 200) {
					useToast('Failed to Fetch Members!', {
						type: 'danger',
						showIcon: true,
						showCloseButton: true,
						hideProgressBar: true,
						transition: 'slide',
					});
					return;
				}
				setAvaMembers(response._data.memberships);
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
						showCloseButton: true,
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
				showCloseButton: true,
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
						showCloseButton: true,
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
				showCloseButton: true,
				hideProgressBar: true,
				transition: 'slide',
			});
		} finally {
			updateMemberDetailsLoading.value = false;
		}
	};

	return {
		currentPage,
		membersListSlice,
		totalNumber,
		totalPages,
		fetchMembershipsStatus,
		fetchMemberVehiclesLoading,
		updateMemberDetailsLoading,
		addMemberVehicleLoading,
		memberVehicles,
		getMemberVehicles,
		updateMemberDetails,
		addMemberVehicles,
		refreshMembers,
	};
};
