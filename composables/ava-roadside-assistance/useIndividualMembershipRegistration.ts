import type {
	IndividualMemberRegistrationRequest,
	IndividualMemberVehicle,
} from '~/types/ava-roadside-assistance/member-registration';

export default function () {
	const route = useRoute();
	const { post } = useStandardizedApi();
	const { getPrincipal } = useAuth();
	const clientFullName = ref('');
	const clientPhoneNumber = ref('');
	const clientEmail = ref('');
	const formErrorMessage: Ref<null | string> = ref(null);
	const registerIndividualMemberLoading = ref(false);
	const memberVehicles: Ref<IndividualMemberVehicle[]> = ref([
		{
			corpName: getPrincipal()?.corpOrganization.corpName!,
			membershipTypeId: Number(route.query.membershipType_id),
			registration: '',
			make: '',
			model: '',
			color: '',
			payment_status: '',
			membership_status: '',
			start_date: '',
			end_date: '',
		},
	]);

	watch(clientPhoneNumber, (newNumber) => {
		if (newNumber.startsWith('0') || newNumber.startsWith('+254')) {
			clientPhoneNumber.value = newNumber.replace(/^(\+254|0)/, '254');
		}
	});

	function addNewVehicle() {
		memberVehicles.value.push({
			corpName: getPrincipal()?.corpOrganization.corpName!,
			membershipTypeId: Number(route.query.membershipType_id),
			registration: '',
			make: '',
			model: '',
			color: '',
			payment_status: '',
			membership_status: '',
			start_date: '',
			end_date: '',
		});
	}

	function removeVehicle(index: number) {
		memberVehicles.value.splice(index, 1);
	}

	async function registerIndividualMember() {
		registerIndividualMemberLoading.value = true;

		try {
			const response = await post('/api/roadside-assistance/reg-individual-ava-member', {
				full_name: clientFullName.value,
				phone_number: clientPhoneNumber.value,
				userEmail: clientEmail.value,
				corporateId: getPrincipal()?.corpOrganization.corpId,
				category: 'individual',
				recordedBy: getPrincipal()?.userId,
				vehicles: memberVehicles.value,
			} as IndividualMemberRegistrationRequest);

			if (response.success) {
				useToast(`${clientFullName.value} registered successfully!`, {
					type: 'success',
					title: 'Registration successfull!',
				});
			}
		} catch (er) {
			useToast('Member registration failed!', {
				type: 'error',
				title: 'Failed! Try again!',
			});
		} finally {
			registerIndividualMemberLoading.value = false;
		}
	}

	return {
		clientFullName,
		clientPhoneNumber,
		clientEmail,
		formErrorMessage,
		registerIndividualMemberLoading,
		memberVehicles,
		registerIndividualMember,
		addNewVehicle,
		removeVehicle,
	};
}
