import type { GenericResponse } from '~/types/corporate-valuations/generic-response-type';
import type { AuthorityLetter } from '~/types/corporate-valuations/authority-letters';
import type { StandardSuccessResponse } from '~/types/proxy-types';

const useAuthorityLetters = () => {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal, isPrincipalAdmin, getAuthToken } = useAuth();
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
	const { post } = useStandardizedApi();
	const uploadedDocuments: Ref<any[]> = ref([]);

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
		createAuthorizationLetterLoading.value = true;
		try {
			// create the form data
			const formData = new FormData();
			formData.append('regNo', registrationNumber.value);
			formData.append('clientName', clientName.value);
			formData.append('clientPhone', clientPhone.value);
			formData.append('authorizedBy', getPrincipal()?.userId as string);
			// purely for the PDF - these few don't endup in the request to the proxied URL
			formData.append('authorizedByUsername', getPrincipal()?.username as string);
			formData.append('authorizedByPhoneNumber', getPrincipal()?.phoneNumber as string);
			formData.append(
				'isCreatedByBroker',
				getPrincipal()?.corpOrganization.broker as unknown as string,
			);
			formData.append('corporateName', getPrincipal()?.corpOrganization.corpName as string);
			formData.append(
				'agentName',
				getPrincipal()?.corpOrganization.corpName as string,
			);

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

			await post('/api/vehicle-valuation/create-authority-letter', formData);
			useToast('Authority Letter created successfully!', {
				type: 'success',
				title: 'Successful!',
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

	async function updateAuthorizationLetter(
		regNo: string,
		clientName: string,
		clientPhone: string,
		letterId: string,
	) {
		try {
			updateAuthorizationLetterLoading.value = true;
			const response = await post('/api/vehicle-valuation/update-authority-letter', {
				reg_no: regNo,
				client_name: clientName,
				client_phone: clientPhone,
				letter_id: letterId,
			});

			if (response.success) {
				useToast('Authority Letter updated successfully!', {
					type: 'success',
					title: 'Successful!',
				});
			}
		} catch (err) {
			useToast('Failed To Update Authority Letter!', {
				type: 'error',
				title: 'Error!',
			});
		} finally {
			updateAuthorizationLetterLoading.value = false;
		}
	}

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
		fetchAuthorityLetterStatus,
		fetchAuthorityLetterError,
		authorityLetters,
		consentProvided,
		updateAuthorizationLetterLoading,
		createAuthorizationLetter,
		handleFileUpload,
		handleSearchTriggered,
		executeGetAuthorityLetters,
		clearFilters,
		updateAuthorizationLetter,
	};
};

export default useAuthorityLetters;
