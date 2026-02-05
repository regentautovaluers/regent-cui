import type {
	AvaMembershipFleets,
	CreateMembershipFleets,
} from '~/types/ava-roadside-assistance/ava-fleets';

export const useFleets = () => {
	const { getPrincipal } = useAuth();
	const { post } = useStandardizedApi();
	const fleetName: Ref<string> = ref('');
	const contactFullName: Ref<string> = ref('');
	const contactPhoneNumber: Ref<string> = ref('');
	const contactEmail: Ref<string> = ref('');
	const createFleetLoading = ref(false);
	const nuxtApp = useNuxtApp();

	watch(contactPhoneNumber, (newNumber) => {
		if (newNumber.startsWith('0') || newNumber.startsWith('+254')) {
			contactPhoneNumber.value = newNumber.replace(/^(\+254|0)/, '254');
		}
	});

	const {
		data: corporateFleetData,
		pending: retrievingFleetList,
		refresh: refeshFleets,
	} = useApiData<AvaMembershipFleets[], AvaMembershipFleets[]>(
		'ava-membership-fleets',
		computed(
			() => `/api/roadside-assistance/fleets/${getPrincipal()?.corpOrganization.corpId}`,
		),
		{
			method: 'GET',
			server: false,
			getCachedData(key) {
				return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
			},
			transform: (response) => {
				return response.data;
			},
			onResponseError: (_e) => {
				useToast('Failed to load fleets! Try Again', {
					type: 'error',
					title: 'Unable to load fleets!',
				});
			},
		},
	);

	async function createFleet() {
		createFleetLoading.value = true;
		try {
			const response = await post('/api/roadside-assistance/fleets/create-ava-fleet', {
				corporate: getPrincipal()?.corpOrganization.corpId,
				fleetname: fleetName.value,
				contact_full_name: contactFullName.value,
				contact_phone_number: contactPhoneNumber.value,
				contact_email: contactEmail.value,
				recordedBy: getPrincipal()?.userId,
			} as CreateMembershipFleets);

			if (response.success) {
				useToast(`${fleetName.value} registered successfully!`, {
					type: 'success',
					title: 'Fleet registration successfull!',
				});
			}
		} catch (error) {
			useToast('Fleet registration failed!', {
				type: 'error',
				title: 'Failed! Try again!',
			});
		} finally {
			createFleetLoading.value = false;
		}
	}

	return {
		fleetName,
		contactFullName,
		contactPhoneNumber,
		contactEmail,
		corporateFleetData,
		retrievingFleetList,
		createFleetLoading,
		createFleet,
		refeshFleets,
	};
};
