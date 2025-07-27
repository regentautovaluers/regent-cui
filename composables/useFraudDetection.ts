import readXlsxFile from 'read-excel-file';
import { type ExcelProcesssingErrorMessage, type CollateralAssetEntry } from '~/types';

export function useFraudDetection() {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();

	// onboard defaulter
	const onboardDefaulter: CollateralAssetEntry = reactive({
		registrationNumber: null,
		chassisNumber: null,
		engineNumber: null,
		color: null,
		make: null,
		model: null,
		yearOfManufacture: 0,
		corporateClientId: getPrincipal.value.corpId,
		corporateClientName: getPrincipal.value.corpName,
		corpClientRepName: getPrincipal.value.username,
		corpClientEmail: getPrincipal.value.email,
		corpClientPhoneNumber: getPrincipal.value.phonenumber,
		description: null,
		relevantLinks: [] as string[],
		dateOfIncident: null,
		amountDefaulted: null,
	});
	const relevantLink: Ref<string | null> = ref(null);
	const onboardDefaulterLoading: Ref<boolean> = ref(false);
	const deleteDefaulterEntryLoading: Ref<boolean> = ref(false);
	const editDefaulterLoading: Ref<boolean> = ref(false);

	// querying fraudsters list
	// for fetching corp valuations
	const page: Ref<number> = ref(0);
	const pageSize: number = 10;
	const fraudsterEntries: ComputedRef<any[]> = computed(() => fetchedData.value?.entries);
	const totalPages: ComputedRef<number> = computed(() => fetchedData.value?.totalPages);
	const searchRegNo: Ref<string> = ref('');

	// deleting fraud entry
	const activeEntryIndex: Ref<number> = ref(-1);

	const handleAppendingRelevantLink = () => {
		if (relevantLink.value) onboardDefaulter.relevantLinks?.push(relevantLink.value);
		relevantLink.value = null;
	};

	const handleRemovingRelevantLink = (index: number) => {
		onboardDefaulter.relevantLinks?.splice(index, 1);
	};

	const createFraudsterEntry = async () => {
		onboardDefaulterLoading.value = true;
		try {
			await $fetch('/api/v1/fraud/create', {
				baseURL: runtimeConfig.public.FRAUD_DETECTION_BASE_URL,
				method: 'POST',
				body: JSON.stringify(onboardDefaulter),
				onResponse({ response }) {
					if (response.ok) {
						useToast('Onboarding Successful!', {
							type: 'success',
							showIcon: true,
							showCloseButton: false,
							hideProgressBar: true,
							transition: 'slide',
						});
					}
				},
			});
		} catch (err) {
			console.log('Failed to onboard fraudster', err);
			useToast('Failed. Try Again!', {
				type: 'danger',
				showIcon: true,
				showCloseButton: false,
				hideProgressBar: true,
				transition: 'slide',
			});
		} finally {
			onboardDefaulterLoading.value = false;
		}
	};

	const editDefaulterEntry = async (editDefaulter: any, id: string) => {
		editDefaulterLoading.value = true;
		try {
			await $fetch(`/api/v1/fraud/${id}`, {
				baseURL: runtimeConfig.public.FRAUD_DETECTION_BASE_URL,
				method: 'PATCH',
				body: JSON.stringify(editDefaulter),
				onResponse({ response }) {
					if (response.ok) {
						useToast('Edit Successful!', {
							type: 'success',
							showIcon: true,
							showCloseButton: false,
							hideProgressBar: true,
							transition: 'slide',
						});
					}
				},
			});
		} catch (err) {
			console.log('Failed to edit entry', err);
			useToast('Failed. Try Again!', {
				type: 'danger',
				showIcon: true,
				showCloseButton: false,
				hideProgressBar: true,
				transition: 'slide',
			});
		} finally {
			editDefaulterLoading.value = false;
		}
	};

	const deleteFraudRecord = async () => {
		deleteDefaulterEntryLoading.value = true;
		try {
			await $fetch(`/api/v1/fraud/${fraudsterEntries.value[activeEntryIndex.value].id}`, {
				baseURL: runtimeConfig.public.FRAUD_DETECTION_BASE_URL,
				method: 'DELETE',
				body: JSON.stringify({
					corporateClientId: getPrincipal.value.corpId,
				}),
				onResponse({ response }) {
					if (response.ok) {
						useToast('Success. Reload page!', {
							type: 'success',
							showIcon: true,
							showCloseButton: false,
							hideProgressBar: true,
							transition: 'slide',
						});
					}
				},
			});
		} catch (err) {
			console.log('Failed to delete fraud record', err);
			useToast('Failed. Try Again!', {
				type: 'danger',
				showIcon: true,
				showCloseButton: false,
				hideProgressBar: true,
				transition: 'slide',
			});
		} finally {
			deleteDefaulterEntryLoading.value = false;
		}
	};

	const {
		status: fetchFraudsterListStatus,
		execute: executeFetchFraudsterList,
		error: fetchFraudsterListError,
		data: fetchedData,
	} = useFetch(
		() => {
			let requestURL = `/api/v1/fraud/getbyclient?corporateClientId=${getPrincipal.value.corpId}&page=${page.value}&size=${pageSize}`;

			return requestURL;
		},
		{
			key: 'fraudster-list',
			baseURL: runtimeConfig.public.FRAUD_DETECTION_BASE_URL,
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
			server: false,
			lazy: true,
			transform(response: any) {
				if (
					response?.data &&
					Array.isArray(response.data) &&
					(response.data as []).length > 0
				) {
					return {
						entries: response.data,
						totalPages: response.pagination.totalPages,
					};
				}
			},
			watch: [page],
		},
	) as any;

	// extract logbook info
	const uploadInProgress: Ref<boolean> = ref(false);
	const extractionInProgress: Ref<boolean> = ref(false);
	const fileLink: Ref<string> = ref('');
	const extractedLogbookInfo = ref({
		registrattion: '',
		chasiss: '',
		make_of_vehicle: '',
		model: '',
		type_of_vehicle: '',
		body_type: '',
		fuel_type: '',
		manufacture_year: '',
		rating: '',
		engine_no: '',
		number_of_passengers: '',
		colour: '',
		date_of_registration: '',
		gross_weight: '',
	});

	const handleLogbookUpload = async (file: File) => {
		if (file) {
			const ext = file.name.split('.').pop();
			const randomId = crypto.randomUUID().toUpperCase().replaceAll('-', '').substring(0, 8);
			const renamedFile = `${randomId}.${ext}`;
			const renamedFileBlob = new File([file], renamedFile, { type: file.type });
			try {
				uploadInProgress.value = false;
				fileLink.value = await uploadFileGetLink(renamedFile, renamedFileBlob);
			} catch (e) {
				useToast('Failed. Try Again!', {
					type: 'danger',
					showIcon: true,
					showCloseButton: false,
					hideProgressBar: true,
					transition: 'slide',
				});
			} finally {
				uploadInProgress.value = false;
			}
		}
	};

	const uploadFileGetLink = async (fileName: string, file: File): Promise<string> => {
		let fileLink: string = '';

		// create the form data
		const formData = new FormData();
		formData.append('filePath', `/${getPrincipal.value.corpId}/${fileName}`);
		formData.append('file', file);
		formData.append('basePath', 'collateral-verification-media');
		formData.append(
			'watermarkText',
			`uploaded by ${getPrincipal.value.corpName}#${new Date().toISOString().split('T')[0]}#powered by Regent Auto Valuers`,
		);

		await $fetch('/media/upload', {
			baseURL: runtimeConfig.public.REGENT_MEDIA_STORAGE_BASE_URL,
			method: 'POST',
			body: formData,
			onResponse({ response }) {
				if (response.ok) {
					fileLink = response._data;
				}
			},
		});

		return fileLink;
	};

	const extractLogbookInfo = async () => {
		extractionInProgress.value = true;
		await $fetch('/webhook/extract-logbook-information', {
			baseURL: runtimeConfig.public.REGENT_AUTOMATIONS_BASE_URL,
			method: 'POST',
			body: JSON.stringify({
				image_url: fileLink.value,
			}),
			onResponse({ response }) {
				if (response.ok) {
					extractedLogbookInfo.value = response._data;
					useToast('Success!', {
						type: 'success',
						showIcon: true,
						showCloseButton: false,
						hideProgressBar: true,
						transition: 'slide',
					});
				} else {
					useToast('Failed. Try Again!', {
						type: 'danger',
						showIcon: true,
						showCloseButton: false,
						hideProgressBar: true,
						transition: 'slide',
					});
				}
			},
		});

		extractionInProgress.value = false;
	};

	return {
		onboardDefaulter,
		onboardDefaulterLoading,
		relevantLink,
		activeEntryIndex,
		deleteDefaulterEntryLoading,
		fetchFraudsterListStatus,
		executeFetchFraudsterList,
		fetchFraudsterListError,
		fraudsterEntries,
		totalPages,
		editDefaulterLoading,
		page,
		uploadInProgress,
		extractionInProgress,
		fileLink,
		extractedLogbookInfo,
		createFraudsterEntry,
		handleAppendingRelevantLink,
		handleRemovingRelevantLink,
		editDefaulterEntry,
		deleteFraudRecord,
		handleLogbookUpload,
		extractLogbookInfo,
	};
}

export function useBulkOnboardDefaulters() {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const processedBulkData: Ref<CollateralAssetEntry[]> = ref([]);
	const totalSize = ref(0);
	const currentProgress = ref('0%');
	const errorMessage: Ref<ExcelProcesssingErrorMessage | null> = ref(null);
	const bulkOnboardingLoading = ref(false);

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
			processedBulkData.value = [];
		}
	};

	const validateXlsxDataIntegrity = (data: Object[]): void => {
		// each item here is the individual row in the excel converted to an array
		data.forEach((item: any, index: number) => {
			if (index === 0) return;

			// check for vehicle reg
			if (item[0] === null)
				throw new Error(`Vehicle registration on row ${index + 1} is missing`);

			// check for chassis number
			if (item[0] === null) throw new Error(`Chassis number on row ${index + 1} is missing`);

			// check for color
			if (item[0] === null) throw new Error(`Color on row ${index + 1} is missing`);

			// check for engine number
			if (item[0] === null) throw new Error(`Engine number on row ${index + 1} is missing`);

			// check for make
			if (item[0] === null) throw new Error(`Vehicle make on row ${index + 1} is missing`);

			// check for model
			if (item[0] === null) throw new Error(`Vehicle model on row ${index + 1} is missing`);
		});
	};

	const prepXlsxData = (data: Object[]): void => {
		try {
			data.forEach((item: any, index: number) => {
				if (index === 0) return;
				processedBulkData.value.push({
					registrationNumber: item[0],
					chassisNumber: item[1],
					color: item[2],
					engineNumber: item[3],
					make: item[4],
					model: item[5],
					yearOfManufacture: item[6],
					description: item[7],
					dateOfIncident: item[8],
					amountDefaulted: item[9],
				});
			});

			const errorMss: ExcelProcesssingErrorMessage = {
				message: 'File validation passed successfully',
				type: 'success',
			};
			errorMessage.value = errorMss;
		} catch (error) {
			processedBulkData.value = [];
			currentProgress.value = '0%';
			errorMessage.value = null;
			const errorMss: ExcelProcesssingErrorMessage = {
				message: 'Data parsing failed. Check your data!',
				type: 'error',
			};
			errorMessage.value = errorMss;

			useToast('Parsing failed!', {
				type: 'warning',
				showIcon: true,
				showCloseButton: false,
				hideProgressBar: true,
				transition: 'slide',
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

	const uploadBulkData = async () => {
		bulkOnboardingLoading.value = true;
		try {
			await $fetch(
				`${runtimeConfig.public.FRAUD_DETECTION_BASE_URL}/api/v1/fraud/bulk-create`,
				{
					method: 'POST',
					body: JSON.stringify({
						clientDetails: {
							corporateClientId: getPrincipal.value.corpId,
							corporateClientName: getPrincipal.value.corpName,
							corpClientRepName: getPrincipal.value.username,
							corpClientEmail: getPrincipal.value.email,
							corpClientPhoneNumber: getPrincipal.value.phonenumber,
						},
						vehicleDetails: processedBulkData.value,
					}),

					onResponse({ response }) {
						if (response.status === 201) {
							useToast('Onboarded Successfully!', {
								type: 'success',
								showIcon: true,
								showCloseButton: false,
								hideProgressBar: true,
								transition: 'slide',
							});
						}
					},
				},
			);
		} catch (error) {
			console.log('An error occured: ', error);
			useToast('Failed. Try Again!', {
				type: 'danger',
				showIcon: true,
				showCloseButton: false,
				hideProgressBar: true,
				transition: 'slide',
			});
		} finally {
			bulkOnboardingLoading.value = false;
		}
	};

	return {
		bulkOnboardingLoading,
		processedBulkData,
		uploadBulkData,
		parseUploadedExcelFile,
		errorMessage,
		currentProgress,
	};
}
