const useAuthorityLetters = () => {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const registrationNumber: Ref<string> = ref('');
	const clientName: Ref<string> = ref('');
	const clientPhone: Ref<string> = ref('');
	const preferredBranch: Ref<string> = ref('');
	const comments: Ref<string> = ref('');
	const policyNumber: Ref<string> = ref('');
	const agencyOrCorpName: Ref<string | null> = ref('');
	const agencyOrCorpId: Ref<string | null> = ref('');
	const createAuthorizationLetterLoading: Ref<boolean> = ref(false);
	const uploadedDocuments: Ref<any[]> = ref([]);
	const {
		computedCorporateClients,
		fetchingCorporateClients,
		errorFetchingCorporateClients,
		getCorporateClients,
		searchPhrase,
		shouldTriggerFetch,
	} = useCorporateClients();
	const { isPrincipalBroker } = useAuth();

	// for changing state of uploaded documents
	const logbookUploaded: Ref<boolean> = ref(false);
	const kraPinUploaded: Ref<boolean> = ref(false);
	const natIdUploaded: Ref<boolean> = ref(false);
	const certUploaded: Ref<boolean> = ref(false);
	const letterUploaded: Ref<boolean> = ref(false);

	// for fetching corp authority letters
	const page: Ref<number> = ref(0);
	const pageSize: number = 10;
	const authorityLetters: ComputedRef<any[]> = computed(
		() => fetchedData.value?.authorityLetters,
	);
	const totalPages: ComputedRef<number> = computed(() => fetchedData.value?.totalPages);
	const searchRegNo: Ref<string> = ref('');

	// for exporting authority letters
	const exportAuthorityLettersLoading: Ref<boolean> = ref(false);

	watch(clientPhone, (newNumber) => {
		if (newNumber.startsWith('0') || newNumber.startsWith('+254')) {
			clientPhone.value = newNumber.replace(/^(\+254|0)/, '254');
		}
	});

	// hack to sync search phrase here with search phrase in useCorporateClients
	watch(agencyOrCorpName, (newValue) => {
		if (newValue == '' || newValue == null) {
			agencyOrCorpId.value = null;
			return;
		}
		searchPhrase.value = newValue;
	});

	const {
		status: fetchAuthorityLetterStatus,
		error: fetchAuthorityLetterError,
		execute: executeGetAuthorityLetters,
		data: fetchedData,
	} = useFetch(
		() => {
			let requestURL = `/api/v1/authority-letter/corp/get-authority-letter?corpId=${getPrincipal.value?.corpId}&page=${page.value}&size=${pageSize}`;

			if (searchRegNo.value !== '') {
				requestURL = requestURL + `&searchSlug=${searchRegNo.value}`;
			}

			return requestURL;
		},
		{
			key: 'authority-letters',
			baseURL: runtimeConfig.public.VALUATION_BASE_URL,
			method: 'GET',
			headers: {
				Accept: '',
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
						authorityLetters: response?.data.map((data: any) => ({
							letterId: data.letterId,
							registrationNumber: data.registrationNumber,
							clientName: data.clientName,
							feedback:
								data.feedbackTrail.length == 0
									? null
									: data.feedbackTrail[data.feedbackTrail.length - 1].feedback,
							clientPhone: data.clientPhone,
							policyNumber: data.policyNumber,
							agencyName: data.agencyName,
							authorizedBy: {
								username: data.authorizedBy.username,
							},
							createdOn: data.createdOn,
							assessmentStage: data.assessmentStage,
							reportURL: data.reportURL,
						})),
						totalPages: response.requestExtras?.totalPages || 0,
					};
				}
			},
			watch: [page],
		},
	);

	const handleFileUpload = (file: File, prependString: string) => {
		if (file) {
			const ext = file.name.split('.').pop();
			const renamedFile = `${prependString}-${file.name.replace(`.${ext}`, '')}.${ext}`;
			const renamedFileBlob = new File([file], renamedFile, { type: file.type });

			uploadedDocuments.value.push({
				name: renamedFile,
				blob: renamedFileBlob,
			});
		}
	};

	const createAuthorizationLetter = async () => {
		// if the logged in user is a broker and they have not
		// filled the agencyOrCorpName show a warning toast and exit
		// the function
		if (isPrincipalBroker.value && agencyOrCorpId.value) {
			useToast('Missing. Select one by clicking from options!', {
				type: 'warn',
				title: 'Missing Data!',
			});

			return;
		}

		createAuthorizationLetterLoading.value = true;
		try {
			// create the form data
			const formData = new FormData();
			formData.append('regNo', registrationNumber.value);
			formData.append('clientName', clientName.value);
			formData.append('clientPhone', clientPhone.value);
			formData.append('authorizedBy', getPrincipal.value?.userId);

			if (preferredBranch.value.length > 0) {
				formData.append('regentBranch', preferredBranch.value);
			}

			if (policyNumber.value.length > 0) {
				formData.append('policyNumber', policyNumber.value);
			}

			if (comments.value.length > 0) {
				formData.append('comments', comments.value);
			}

			// handle appending the files
			if (uploadedDocuments.value.length > 0) {
				for (const file of uploadedDocuments.value) {
					formData.append('files', file.blob);
				}
			}

			if (agencyOrCorpId.value) {
				formData.append('agencyName', agencyOrCorpId.value);
			}

			await $fetch('/api/v1/authority-letter/corp/create-authority-letter', {
				baseURL: runtimeConfig.public.VALUATION_BASE_URL,
				method: 'POST',
				body: formData,
				onResponse({ response }) {
					if (response.ok) {
						useToast('Letter created successfully!', {
							type: 'success',
						});
					}
				},
			});
		} catch (err) {
			console.log('Failed to create authorization letter', err);
			useToast('Failed. Try Again!', {
				type: 'error',
			});
		} finally {
			createAuthorizationLetterLoading.value = false;
		}
	};

	const exportAuthorityLetter = async (startDate: string, endDate: string) => {
		try {
			exportAuthorityLettersLoading.value = true;
			await $fetch(
				`${runtimeConfig.public.VALUATION_BASE_URL}/api/v1/authority-letter/corp/export-report`,
				{
					method: 'GET',
					query: {
						corpId: getPrincipal.value?.corpId,
						startDate: startDate,
						endDate: endDate,
					},
					onResponse({ response }) {
						if (response.status === 404) {
							useToast('Found No Letters!', {
								type: 'warn',
							});
						}

						if (response.ok) {
							useToast('Success! Downloading Shortly!', {
								type: 'success',
							});

							const url = window.URL.createObjectURL(new Blob([response._data]));
							const link = document.createElement('a');
							link.href = url;
							link.setAttribute(
								'download',
								`authority-letters-${getPrincipal.value?.corpName.replaceAll(' ', '').toLocaleLowerCase()}-${startDate}-${endDate}.xls`,
							);
							document.body.appendChild(link);
							link.click();
							link.remove();
						}
					},
				},
			);
		} catch (err) {
			console.log('Failed to export Excel document', err);
			useToast('Failed. Try Again!', {
				type: 'error',
			});
		} finally {
			exportAuthorityLettersLoading.value = false;
		}
	};

	const handleSearchTriggered = (searchSlug: string) => {
		page.value = 0;
		searchRegNo.value = searchSlug;
	};

	return {
		page,
		totalPages,
		searchRegNo,
		registrationNumber,
		clientName,
		clientPhone,
		preferredBranch,
		comments,
		policyNumber,
		agencyOrCorpName,
		agencyOrCorpId,
		createAuthorizationLetterLoading,
		exportAuthorityLettersLoading,
		logbookUploaded,
		kraPinUploaded,
		natIdUploaded,
		certUploaded,
		letterUploaded,
		fetchAuthorityLetterStatus,
		fetchAuthorityLetterError,
		authorityLetters,
		computedCorporateClients,
		fetchingCorporateClients,
		errorFetchingCorporateClients,
		getCorporateClients,
		searchPhrase,
		createAuthorizationLetter,
		handleFileUpload,
		exportAuthorityLetter,
		handleSearchTriggered,
		executeGetAuthorityLetters,
		shouldTriggerFetch,
	};
};

export default useAuthorityLetters;
