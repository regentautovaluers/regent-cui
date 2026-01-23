import readXlsxFile from 'read-excel-file';
import { type BulkProcessedMembershipType, type ExcelProcesssingErrorMessage } from '~/types';

export default function () {
	const route = useRoute();
	const { getPrincipal } = useAuth();
	const { post } = useStandardizedApi();
	const processedFleetData: Ref<BulkProcessedMembershipType[]> = ref([]);
	const selectedFleetId: Ref<number> = ref(0);
	const errorMessage: Ref<ExcelProcesssingErrorMessage | null> = ref(null);
	const registerBulkMembershipsLoading = ref(false);
	const { corporateFleetData } = useFleets();

	const computedFleetDetails = computed(() =>
		corporateFleetData.value?.find((fleet: any) => fleet.id === selectedFleetId.value),
	);

	async function parseUploadedExcelFile(e: any) {
		const selectedFile = e.target.files[0];
		const reader = new FileReader();

		if (selectedFile) {
			reader.readAsDataURL(selectedFile);
		}

		try {
			const data = await readXlsxFile(selectedFile);
			processAndValidateXlsxData(data);
		} catch (err) {
			const errorMss: ExcelProcesssingErrorMessage = {
				message: err,
				type: 'error',
			};
			errorMessage.value = errorMss;
			processedFleetData.value = [];
		}
	}

	function processAndValidateXlsxData(data: any[]) {
		try {
			// Reset state before starting
			processedFleetData.value = [];

			data.forEach((item: any, index: number) => {
				// Skip the header row
				if (index === 0) return;

				/** 1. Validation Logic **/
				// Using == null to catch both null and undefined
				if (item[0] == null) throw new Error(`Name on row ${index + 1} is missing`);
				if (item[1] == null) throw new Error(`Phone number on row ${index + 1} is missing`);
				if (item[3] == null) throw new Error(`Vehicle on row ${index + 1} is missing`);
				if (item[4] == null) throw new Error(`Start date on row ${index + 1} is missing`);
				if (item[5] == null) throw new Error(`End date on row ${index + 1} is missing`);

				/** 2. Data Transformation Logic **/
				processedFleetData.value.push({
					corpName: getPrincipal.value?.corpName!,
					full_name: stringToSentenceCase(item[0]),
					phone_number: `254${item[1]}`,
					userEmail: item[2],
					corporateId: getPrincipal.value?.corpId!,
					membershipTypeId: Number(route.query.membershipType_id),
					available_free_distance: route.query.freeDistance,
					registration: item[3],
					start_date: formatExcelTemplateDate(item[4]),
					end_date: formatExcelTemplateDate(item[5]),
					make: 'N/A',
					model: 'N/A',
					color: 'N/A',
					payment_status: 'paid',
					membership_status: 'active',
					recordedBy: getPrincipal.value?.userId!,
					category: 'corporate',
					fleetId: selectedFleetId.value,
				});
			});

			// If loop completes without throwing an error
			errorMessage.value = {
				message: 'File validation passed successfully',
				type: 'success',
			};
		} catch (error: any) {
			// Handle validation or runtime errors
			processedFleetData.value = [];

			const errorMss: ExcelProcesssingErrorMessage = {
				message: error.message || 'Data parsing failed. Check your data!',
				type: 'error',
			};
			errorMessage.value = errorMss;

			useToast(error.message || 'Parsing failed!', {
				type: 'warn',
			});
		}
	}

	async function registerMembersInBulk() {
		registerBulkMembershipsLoading.value = true;
		try {
			const response = await post(
				'/api/roadside-assistance/reg-bulk-ava-members',
				processedFleetData.value,
			);

			if (response.success) {
				useToast(`${processedFleetData.value.length} members registered successfully!`, {
					type: 'success',
					title: 'Registration successfull!',
				});
			}
		} catch (error) {
			useToast('Member registration failed!', {
				type: 'error',
				title: 'Failed! Try again!',
			});
		} finally {
			registerBulkMembershipsLoading.value = false;
		}
	}

	return {
		selectedFleetId,
		computedFleetDetails,
		errorMessage,
		registerBulkMembershipsLoading,
		processedFleetData,
		parseUploadedExcelFile,
		registerMembersInBulk,
	};
}
