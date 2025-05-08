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

	// search fraudster
	const searchQuery: Ref<string> = ref('');
	const searchFraudsterLoading: Ref<boolean> = ref(false);
	const searchIdentifyAfricaDatabase: Ref<boolean> = ref(false);
	const ravDBResults: Ref<any[] | null> = ref(null);
	const iaDBResults: Ref<any> = ref(null);

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
							ravDBResults.value = responseData.data;
						} else {
							ravDBResults.value = responseData.data.fraudResults;
							iaDBResults.value = responseData.data.vehicleDetails.data;
						}
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
			searchFraudsterLoading.value = false;
		}
	};

	return {
		onboardFrauster,
		onboardFraudsterLoading,
		relevantLink,
		searchQuery,
		searchFraudsterLoading,
		searchIdentifyAfricaDatabase,
		ravDBResults,
        iaDBResults,
		createFraudsterEntry,
		handleAppendingRelevantLink,
		searchFraudster,
	};
};

export default useFraudDetection;
