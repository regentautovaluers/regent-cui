const useFraudDetection = () => {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();

	// onboard fraudster
	const onboardFrauster = reactive({
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
	const onboardFraudsterLoading: Ref<boolean> = ref(false);

	const searchQuery: Ref<string> = ref('');
	const searchFraudsterLoading: Ref<boolean> = ref(false);
	const deleteFraudEntryLoading: Ref<boolean> = ref(false);
	const searchIdentifyAfricaDatabase: Ref<boolean> = ref(false);
	const ravFraudDetails: Ref<any[] | null> = ref(null);
	const iaVehicleDetails: Ref<any> = ref(null);
	const iaVehicleCollateralDetails: Ref<any[] | null> = ref(null);
	const iaVehicleOwnerDetails: Ref<any> = ref(null);

	// querying fraudsters list
	// for fetching corp valuations
	const page: Ref<number> = ref(0);
	const pageSize: number = 10;
	const fraudsterEntries: Ref<any[]> = ref([]);
	const totalPages: Ref<number> = ref(0);
	const searchRegNo: Ref<string> = ref('');

	const handleAppendingRelevantLink = () => {
		if (relevantLink.value) onboardFrauster.relevantLinks.push(relevantLink.value);
		relevantLink.value = null;
	};

	const createFraudsterEntry = async () => {
		onboardFraudsterLoading.value = true;
		try {
			await $fetch('/api/v1/fraud/create', {
				baseURL: runtimeConfig.public.FRAUD_DETECTION_BASE_URL,
				method: 'POST',
				body: JSON.stringify(onboardFrauster),
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
			onboardFraudsterLoading.value = false;
		}
	};

	const searchFraudster = async () => {
		let requestURI: string = `/api/v1/fraud/search?searchQuery=${searchQuery.value}&searchType=valuation&searcherEmail=${getPrincipal.value.email}&searcherPhone=${getPrincipal.value.phonenumber}&searcherName=${getPrincipal.value.username}&searcherOrganisation=${getPrincipal.value.corpName}`;

		if (searchIdentifyAfricaDatabase.value) {
			requestURI += '&forwardResults=true';
		}

		searchFraudsterLoading.value = true;
		try {
			await $fetch(requestURI, {
				baseURL: runtimeConfig.public.FRAUD_DETECTION_BASE_URL,
				method: 'GET',
				onResponse({ response }) {
					const responseData = response._data;

					if (response.ok) {
						if (!searchIdentifyAfricaDatabase.value) {
							ravFraudDetails.value = responseData.data;
						} else {
							ravFraudDetails.value = responseData.data.fraudResults;

							// FROM IA:
							// details about the vehicle
							iaVehicleDetails.value = responseData.data.vehicleDetails.vehicle;

							// details about the vehicle's loaning collateral
							iaVehicleCollateralDetails.value = responseData.data.collateralData;

							// details about the vehicle's owner
							iaVehicleOwnerDetails.value = responseData.data.vehicleDetails.owner[0];
						}
					}
				},
			});
		} catch (err) {
			useToast('Failed. Try Again!', {
				type: 'danger',
				showIcon: true,
				showCloseButton: false,
				hideProgressBar: true,
				transition: 'slide',
			});
		} finally {
			searchFraudsterLoading.value = false;
		}
	};

	const deleteFraudRecord = async (id: string) => {
		deleteFraudEntryLoading.value = true;
		try {
			await $fetch(`/api/v1/fraud/${id}`, {
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
			deleteFraudEntryLoading.value = false;
		}
	};

	const {
		status: fetchFraudsterListStatus,
		execute: executeFetchFraudsterList,
		error: fetchFraudsterListError,
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
			onResponse({ response }) {
				if (response.ok) {
					const data = response._data.data;
					fraudsterEntries.value = data;
					const paginationInfo = response._data.pagination;
					totalPages.value = paginationInfo.totalPages;
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
		},
	) as any;

	return {
		onboardFrauster,
		onboardFraudsterLoading,
		relevantLink,
		searchQuery,
		searchFraudsterLoading,
		deleteFraudEntryLoading,
		searchIdentifyAfricaDatabase,
		ravFraudDetails,
		iaVehicleDetails,
		iaVehicleCollateralDetails,
		iaVehicleOwnerDetails,
		fetchFraudsterListStatus,
		executeFetchFraudsterList,
		fetchFraudsterListError,
		fraudsterEntries,
		totalPages,
		page,
		createFraudsterEntry,
		handleAppendingRelevantLink,
		searchFraudster,
		deleteFraudRecord,
	};
};

export default useFraudDetection;
