import {
	setSelectedCorpOrBroker,
	getSelectedCorpOrBroker,
} from '~/stores/authority-letter-on-behalf-of-store';

const useAuthorityLetters = () => {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal, isPrincipalBroker } = useAuth();

	const registrationNumber: Ref<string> = ref('');
	const clientName: Ref<string> = ref('');
	const clientPhone: Ref<string> = ref('');
	const preferredBranch: Ref<string> = ref('');
	const comments: Ref<string> = ref('');
	const policyNumber: Ref<string> = ref('');
	const agencyOrCorp = computed(() => getSelectedCorpOrBroker.value);
	const createAuthorizationLetterLoading: Ref<boolean> = ref(false);
	const uploadedDocuments: Ref<any[]> = ref([]);

	// for changing state of uploaded documents
	const logbookUploaded: Ref<boolean> = ref(false);
	const kraPinUploaded: Ref<boolean> = ref(false);
	const natIdUploaded: Ref<boolean> = ref(false);
	const certUploaded: Ref<boolean> = ref(false);
	const letterUploaded: Ref<boolean> = ref(false);

	// for fetching corp authority letters
	const page: Ref<number> = ref(0);
	const pageSize: number = 10;
	const authorityLetters: Ref<any[]> = ref([]);
	const totalPages: Ref<number> = ref(0);
	const searchRegNo: Ref<string> = ref('');

	// for exporting authority letters
	const exportAuthorityLettersLoading: Ref<boolean> = ref(false);

	watch(clientPhone, (newNumber) => {
		if (newNumber.startsWith('0') || newNumber.startsWith('+254')) {
			clientPhone.value = newNumber.replace(/^(\+254|0)/, '254');
		}
	});

	const { status: fetchAuthorityLetterStatus, execute: executeGetAuthorityLetters } = useFetch(
		() => {
			let requestURL = `/api/v1/authority-letter/corp/get-authority-letter?corpId=${getPrincipal.value.corpId}&page=${page.value}&size=${pageSize}`;

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
				Accept: 'application/json',
			},
			server: false,
			lazy: true,
			onResponse({ response }) {
				const data = response._data.data;
				const extras = response._data.requestExtras;
				totalPages.value = extras.totalPages;
				authorityLetters.value = data.map((data: any) => {
					return {
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
					};
				});
			},
		},
	) as any;

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
		// if the logged in user is a broked an they have not
		// filled the agencyOrCorpName show a warning toast and exit
		// the function
		if (isPrincipalBroker() && agencyOrCorp.value.name.length === 0) {
			useToast('Corporate is Required!', {
				type: 'warning',
				showIcon: true,
				showCloseButton: false,
				hideProgressBar: true,
				transition: 'bounce',
			});

			return;
		}

		if (uploadedDocuments.value.length < 1) {
			useToast('Provide Logbook & Authority Letter!', {
				type: 'warning',
				showIcon: true,
				showCloseButton: false,
				hideProgressBar: true,
				transition: 'bounce',
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
			formData.append('authorizedBy', getPrincipal.value.userId);

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

			if (agencyOrCorp.value.name.length > 0) {
				formData.append('agencyName', agencyOrCorp.value.id);
			}

			await $fetch('/api/v1/authority-letter/corp/create-authority-letter', {
				baseURL: runtimeConfig.public.VALUATION_BASE_URL,
				method: 'POST',
				body: formData,
				onResponse({ response }) {
					if (response.status === 200) {
						useToast('Letter created successfully!', {
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
			console.log('Failed to create authorization letter', err);
			useToast('Failed. Try Again!', {
				type: 'danger',
				showIcon: true,
				showCloseButton: false,
				hideProgressBar: true,
				transition: 'slide',
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
						corpId: getPrincipal.value.corpId,
						startDate: startDate,
						endDate: endDate,
					},
					onResponse({ response }) {
						if (response.status === 404) {
							useToast('Found No Letters!', {
								type: 'warning',
								showIcon: true,
								showCloseButton: false,
								hideProgressBar: true,
								transition: 'slide',
							});
						}

						if (response.status === 200) {
							useToast('Success! Downloading Shortly!', {
								type: 'success',
								showIcon: true,
								showCloseButton: false,
								hideProgressBar: true,
								transition: 'slide',
							});

							const url = window.URL.createObjectURL(new Blob([response._data]));
							const link = document.createElement('a');
							link.href = url;
							link.setAttribute(
								'download',
								`authority-letters-${getPrincipal.value.corpName.replaceAll(' ', '').toLocaleLowerCase()}-${startDate}-${endDate}.xls`,
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
				type: 'danger',
				showIcon: true,
				showCloseButton: false,
				hideProgressBar: true,
				transition: 'slide',
			});
		} finally {
			exportAuthorityLettersLoading.value = false;
		}
	};

	const handleSearchTriggered = (searchSlug: string) => {
		page.value = 0;
		authorityLetters.value = [];
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
		agencyOrCorp,
		createAuthorizationLetterLoading,
		exportAuthorityLettersLoading,
		logbookUploaded,
		kraPinUploaded,
		natIdUploaded,
		certUploaded,
		letterUploaded,
		fetchAuthorityLetterStatus,
		authorityLetters,
		createAuthorizationLetter,
		handleFileUpload,
		setSelectedCorpOrBroker,
		exportAuthorityLetter,
		handleSearchTriggered,
		executeGetAuthorityLetters,
		getSelectedCorpOrBroker,
	};
};

export default useAuthorityLetters;
