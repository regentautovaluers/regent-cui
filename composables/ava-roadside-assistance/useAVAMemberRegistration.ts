import readXlsxFile from 'read-excel-file';
import {
	type BulkProcessedMembershipType,
	type ExcelProcesssingErrorMessage,
	type IndividuaProcessedMembershipType,
} from '~/types';

export const useFleets = () => {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const fleetName: Ref<string> = ref('');
	const contactFullName: Ref<string> = ref('');
	const contactPhoneNumber: Ref<string> = ref('');
	const contactEmail: Ref<string> = ref('');
	const createFleetLoading = ref(false);
	const nuxtApp = useNuxtApp();

	const {
		data: corporateFleetData,
		pending: retrievingFleetList,
		refresh: refeshFleets,
	} = useFetch(`/api/v1/fleets/corporate/${getPrincipal.value?.corpId}`, {
		key: 'fleets',
		baseURL: runtimeConfig.public.AVA_BASE_URL,
		method: 'GET',
		onResponse({ response }) {
			if (response.ok) {
				return response._data;
			}
		},
		getCachedData(key) {
			return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
		},
	}) as any;

	watch(contactPhoneNumber, (newNumber) => {
		if (newNumber.startsWith('0') || newNumber.startsWith('+254')) {
			contactPhoneNumber.value = newNumber.replace(/^(\+254|0)/, '254');
		}
	});

	const createFleet = async () => {
		createFleetLoading.value = true;
		try {
			await $fetch(`${runtimeConfig.public.AVA_BASE_URL}/api/v1/fleets`, {
				method: 'POST',
				body: JSON.stringify({
					corporate: getPrincipal.value?.corpId,
					fleetname: fleetName.value,
					contact_full_name: contactFullName.value,
					contact_phone_number: contactPhoneNumber.value,
					contact_email: contactEmail.value,
					recordedBy: getPrincipal.value?.userId,
				}),

				onResponse({ response }) {
					if (response.status === 201) {
						useToast('Fleet Created Successfully!', {
							type: 'success',
						});
						refeshFleets();
					}
				},
			});
		} catch (error) {
			console.log('An error occured: ', error);
			useToast('Failed. Try Again!', {
				type: 'error',
			});
		} finally {
			createFleetLoading.value = false;
		}
	};

	const reloadFleets = async () => {
		refeshFleets();
	};

	return {
		fleetName,
		contactFullName,
		contactPhoneNumber,
		contactEmail,
		corporateFleetData,
		retrievingFleetList,
		createFleetLoading,
		createFleet,
		reloadFleets,
	};
};

export const useBulkMemberRegistration = () => {
	const runtimeConfig = useRuntimeConfig();
	const route = useRoute();
	const { getPrincipal } = useAuth();
	const processedFleetData: Ref<BulkProcessedMembershipType[]> = ref([]);
	const selectedFleetId: Ref<number> = ref(0);
	const contactFullName: Ref<string> = ref('');
	const contactPhoneNumber: Ref<string> = ref('');
	const contactEmail: Ref<string> = ref('');
	const totalSize = ref(0);
	const currentProgress = ref('0%');
	const errorMessage: Ref<ExcelProcesssingErrorMessage | null> = ref(null);
	const registerBulkMembershipsLoading = ref(false);
	const { corporateFleetData } = useFleets();

	watch(selectedFleetId, (newFleetId) => {
		const fleetDetails: any = corporateFleetData.value.find(
			(fleet: any) => fleet.id === newFleetId,
		);

		contactFullName.value = fleetDetails.contact_full_name;
		contactPhoneNumber.value = fleetDetails.contact_phone_number;
		contactEmail.value = fleetDetails.contact_email;
	});

	const parseUploadedExcelFile = async (e: any): Promise<void> => {
		const selectedFile = e.target.files[0];
		const reader = new FileReader();

		if (selectedFile) {
			addListeners(reader);
			reader.readAsDataURL(selectedFile);
		}

		try {
			const data = await readXlsxFile(selectedFile);
			validateXlsxDataIntegrity(data);
			prepXlsxData(data);
		} catch (err) {
			console.log('An error has occured: ', err);
			const errorMss: ExcelProcesssingErrorMessage = {
				message: err,
				type: 'error',
			};
			errorMessage.value = errorMss;
			processedFleetData.value = [];
		}
	};

	const validateXlsxDataIntegrity = (data: Object[]): void => {
		// each item here is the individual row in the excel converted to an array
		data.forEach((item: any, index: number) => {
			if (index === 0) return;

			// check for client name
			if (item[0] === null) throw new Error(`Name of client on row ${index + 1} is missing`);

			// check for client phone number
			if (item[1] === null)
				throw new Error(`Phone number of client on row ${index + 1} is missing`);

			// check for vehicle registration
			if (item[3] === null)
				throw new Error(`Vehicle of client on row ${index + 1} is missing`);

			// check for start date
			if (item[4] === null)
				throw new Error(`Start date of client on row ${index + 1} is missing`);

			// check for end date
			if (item[5] === null)
				throw new Error(`End date of client on row ${index + 1} is missing`);
		});
	};

	const prepXlsxData = (data: Object[]): void => {
		try {
			data.forEach((item: any, index: number) => {
				if (index === 0) return;
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

			const errorMss: ExcelProcesssingErrorMessage = {
				message: 'File validation passed successfully',
				type: 'success',
			};
			errorMessage.value = errorMss;
		} catch (error) {
			processedFleetData.value = [];
			currentProgress.value = '0%';
			errorMessage.value = null;
			const errorMss: ExcelProcesssingErrorMessage = {
				message: 'Data parsing failed. Check your data!',
				type: 'error',
			};
			errorMessage.value = errorMss;

			useToast('Parsing failed!', {
				type: 'warn',
			});
		}
	};

	const addListeners = (reader: any) => {
		reader.addEventListener('loadstart', handleEvent);
		reader.addEventListener('load', handleEvent);
		reader.addEventListener('loadend', handleEvent);
		reader.addEventListener('progress', handleEvent);
		reader.addEventListener('error', handleEvent);
		reader.addEventListener('abort', handleEvent);
	};

	const handleEvent = (event: any) => {
		if (event.type === 'progress') {
			currentProgress.value = `${(event.loaded / totalSize.value).toFixed(2) * 100}%`;
		}
		if (event.type === 'loadstart') {
			totalSize.value = event.total;
		}
	};

	const registerMembersInBulk = async (): Promise<void> => {
		registerBulkMembershipsLoading.value = true;
		try {
			await $fetch('/api/v1/memberships/bulk', {
				baseURL: runtimeConfig.public.AVA_BASE_URL,
				method: 'POST',
				body: JSON.stringify(processedFleetData.value),
				async onResponse({ response }) {
					if (response.status !== 200) {
						throw new Error('Failed to create bulk memberships');
					}

					useToast('Memberships Created Successfully!', {
						type: 'success',
					});
				},
			});
		} catch (error) {
			console.log('An error occured: ', error);
			useToast('Failed. Try Again!', {
				type: 'error',
			});
		} finally {
			registerBulkMembershipsLoading.value = false;
		}
	};

	return {
		selectedFleetId,
		contactFullName,
		contactPhoneNumber,
		contactEmail,
		totalSize,
		currentProgress,
		errorMessage,
		registerBulkMembershipsLoading,
		parseUploadedExcelFile,
		registerMembersInBulk,
	};
};


