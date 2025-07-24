const useFraudDetection = () => {
	const runtimeConfig = useRuntimeConfig();
	const { getAuthenticatedPrincipal } = useAuth();

	// onboard defaulter
	const onboardDefaulter = reactive({
		registrationNumber: null,
		chassisNumber: null,
		engineNumber: null,
		color: null,
		make: null,
		model: null,
		yearOfManufacture: 0,
		corporateClientId: getAuthenticatedPrincipal.value?.corpId,
		corporateClientName: getAuthenticatedPrincipal.value?.corpName,
		corpClientRepName: getAuthenticatedPrincipal.value?.username,
		corpClientEmail: getAuthenticatedPrincipal.value?.email,
		corpClientPhoneNumber: getAuthenticatedPrincipal.value?.phonenumber,
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
					corporateClientId: getAuthenticatedPrincipal.value?.corpId,
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
			let requestURL = `/api/v1/fraud/getbyclient?corporateClientId=${getAuthenticatedPrincipal.value?.corpId}&page=${page.value}&size=${pageSize}`;

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
		createFraudsterEntry,
		handleAppendingRelevantLink,
		handleRemovingRelevantLink,
		editDefaulterEntry,
		deleteFraudRecord,
	};
};

export default useFraudDetection;
