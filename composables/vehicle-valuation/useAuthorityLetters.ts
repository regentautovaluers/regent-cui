import type { GenericResponse } from '~/types/corporate-valuations/generic-response-type';
import type { AuthorityLetter } from '~/types/corporate-valuations/authority-letters';
import type { StandardSuccessResponse } from '~/types/proxy-types';

const useAuthorityLetters = () => {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal, isPrincipalAdmin } = useAuth();
	const consentProvided: Ref<boolean> = ref(false);
	const registrationNumber: Ref<string> = ref('');
	const clientName: Ref<string> = ref('');
	const clientPhone: Ref<string> = ref('');
	const preferredBranch: Ref<string> = ref('');
	const comments: Ref<string> = ref('');
	const policyNumber: Ref<string> = ref('');
	const agencyOrCorpName: Ref<string | null> = ref('');
	const agencyOrCorpId: Ref<string | null> = ref('');
	const createAuthorizationLetterLoading: Ref<boolean> = ref(false);
	const updateAuthorizationLetterLoading: Ref<boolean> = ref(false);
	const uploadedDocuments: Ref<any[]> = ref([]);

	const { isPrincipalBroker } = useAuth();

	// for fetching corp authority letters
	const page: Ref<number> = ref(0);
	const pageSize: number = 10;
	const totalPages: ComputedRef<number> = computed(
		() => fetchedAuthorityLetters.value?.requestExtras?.totalPages || 0,
	);
	const authorityLetters: ComputedRef<AuthorityLetter[]> = computed(
		() => fetchedAuthorityLetters.value?.data || [],
	);
	const searchRegNo: Ref<string> = ref('');
	const startDate: Ref<string | null> = ref(null);
	const endDate: Ref<string | null> = ref(null);
	const onlyOngoing: Ref<boolean | null> = ref(null);

	// for exporting authority letters
	const exportAuthorityLettersLoading: Ref<boolean> = ref(false);

	watch(clientPhone, (newNumber) => {
		if (newNumber.startsWith('0') || newNumber.startsWith('+254')) {
			clientPhone.value = newNumber.replace(/^(\+254|0)/, '254');
		}
	});

	const {
		status: fetchAuthorityLetterStatus,
		error: fetchAuthorityLetterError,
		execute: executeGetAuthorityLetters,
		data: fetchedAuthorityLetters,
	} = useApiData<GenericResponse<AuthorityLetter[]>, GenericResponse<AuthorityLetter[]>>(
		null,
		computed(() => {
			let requestURL = `/api/vehicle-valuation/get-authority-letters?corpId=${getPrincipal()?.corpOrganization.corpId}&page=${page.value}&size=${pageSize}`;

			if (searchRegNo.value !== '') {
				requestURL = requestURL + `&searchTerm=${searchRegNo.value}`;
			}

			if (startDate.value !== null) {
				requestURL = requestURL + `&startDate=${startDate.value}`;
			}

			if (endDate.value !== null) {
				requestURL = requestURL + `&endDate=${endDate.value}`;
			}

			if (onlyOngoing.value !== null) {
				requestURL = requestURL + `&ongoing=${onlyOngoing.value}`;
			}

			// for finance valuation
			if (
				['BANK', 'SACCO', 'MICRO_FINANCE'].includes(
					getPrincipal()?.corpOrganization.corpClass as string,
				)
			) {
				if (!isPrincipalAdmin && getPrincipal()?.corpOrganization.corpId) {
					requestURL =
						requestURL + `&corpBranchId=${getPrincipal()?.corpOrganization.corpId}`;
				}
			}

			return requestURL;
		}),
		{
			method: 'GET',
			server: false,
			lazy: true,
			transform: (d: StandardSuccessResponse<GenericResponse<AuthorityLetter[]>>) => {
				return d.data;
			},
			onResponseError: (_e) => {
				useToast('Failed to load reports! Try Again', {
					type: 'error',
					title: 'Unable to load reports!',
				});
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
			formData.append('authorizedBy', getPrincipal()?.userId as string);

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

						// clear the fields
						registrationNumber.value = '';
						clientName.value = '';
						clientPhone.value = '';
						preferredBranch.value = '';
						policyNumber.value = '';
						comments.value = '';
						uploadedDocuments.value = [];
						consentProvided.value = false;
						agencyOrCorpName.value = '';
						agencyOrCorpId.value = '';
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

	const updateAuthorizationLetter = async (
		regNo: string,
		clientName: string,
		clientPhone: string,
		letterId: string,
	) => {
		updateAuthorizationLetterLoading.value = true;
		try {
			// create the form data
			const formData = new FormData();
			formData.append('regNo', regNo);
			formData.append('clientName', clientName);
			formData.append('clientPhone', clientPhone);
			formData.append('letterId', letterId);

			await $fetch('/api/v1/authority-letter/corp/update-authority-letter', {
				baseURL: runtimeConfig.public.VALUATION_BASE_URL,
				method: 'PATCH',
				body: formData,
				onResponse({ response }) {
					if (response.ok) {
						useToast('Letter updated successfully!', {
							type: 'success',
						});
					}
				},
			});
		} catch (err) {
			console.log('Failed to update authorization letter', err);
			useToast('Failed. Try Again!', {
				type: 'error',
			});
		} finally {
			updateAuthorizationLetterLoading.value = false;
		}
	};

	const exportAuthorityLetter = async (startDate: string, endDate: string) => {
		try {
			exportAuthorityLettersLoading.value = true;
			await $fetch(`/api/v1/authority-letter/corp/export-report`, {
				baseURL: runtimeConfig.public.VALUATION_BASE_URL,
				method: 'GET',
				query: {
					corpId: getPrincipal()?.corpOrganization.corpId,
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
							`authority-letters-${getPrincipal()?.corpOrganization.corpName.replaceAll(' ', '').toLocaleLowerCase()}-${startDate}-${endDate}.xls`,
						);
						document.body.appendChild(link);
						link.click();
						link.remove();
					}
				},
			});
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

	function clearFilters(): void {
		searchRegNo.value = '';
		startDate.value = null;
		endDate.value = null;
		onlyOngoing.value = null;

		// ecxecute the request
		executeGetAuthorityLetters();
	}

	return {
		page,
		totalPages,
		searchRegNo,
		startDate,
		endDate,
		onlyOngoing,
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
		fetchAuthorityLetterStatus,
		fetchAuthorityLetterError,
		authorityLetters,
		consentProvided,
		updateAuthorizationLetterLoading,
		createAuthorizationLetter,
		handleFileUpload,
		exportAuthorityLetter,
		handleSearchTriggered,
		executeGetAuthorityLetters,
		clearFilters,
		updateAuthorizationLetter,
	};
};

export default useAuthorityLetters;
