const useFraudDetection = () => {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();

	// onboard defaulter
	const onboardDefaulter = reactive({
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

	// querying fraudsters list
	// for fetching corp valuations
	const page: Ref<number> = ref(0);
	const pageSize: number = 10;
	const fraudsterEntries: Ref<any[]> = ref([]);
	const totalPages: Ref<number> = ref(0);
	const searchRegNo: Ref<string> = ref('');

	const handleAppendingRelevantLink = () => {
		if (relevantLink.value) onboardDefaulter.relevantLinks.push(relevantLink.value);
		relevantLink.value = null;
	};

	const handleRemovingRelevantLink = (index: number) => {
		onboardDefaulter.relevantLinks.splice(index, 1);
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

	const deleteFraudRecord = async (id: string) => {
		deleteDefaulterEntryLoading.value = true;
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
			deleteDefaulterEntryLoading.value = false;
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
		onboardDefaulter,
		onboardDefaulterLoading,
		relevantLink,
		deleteDefaulterEntryLoading,
		fetchFraudsterListStatus,
		executeFetchFraudsterList,
		fetchFraudsterListError,
		fraudsterEntries,
		totalPages,
		page,
		createFraudsterEntry,
		handleAppendingRelevantLink,
		handleRemovingRelevantLink,
		deleteFraudRecord,
	};
};

export default useFraudDetection;
