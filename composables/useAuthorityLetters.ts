import { type SelectedCorpOrBroker } from '~/types';
import {
	setSelectedCorpOrBroker,
	getSelectedCorpOrBroker,
} from '~/stores/authority-letter-on-behalf-of-store';

const useAuthorityLetters = () => {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();

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

	watch(clientPhone, (newNumber) => {
		if (newNumber.startsWith('0') || newNumber.startsWith('+254')) {
			clientPhone.value = newNumber.replace(/^(\+254|0)/, '254');
		}
	});

	const { status: fetchAuthorityLetterStatus, data: authorityLetters } = useFetch(
		'/api/v1/authority-letter/corp/get-authority-letter',
		{
			key: 'authority-letters',
			baseURL: runtimeConfig.public.VALUATION_BASE_URL,
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
			query: {
				corpId: getPrincipal.value.corpId,
				page: page.value,
				size: pageSize,
			},
			server: false,
			lazy: true,
			transform(data: any) {
				return data.data;
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
		createAuthorizationLetterLoading.value = true;

		try {
			// create the form data
			const formData = new FormData();
			formData.append('regNo', registrationNumber.value);
			formData.append('clientName', clientName.value);
			formData.append('clientPhone', clientPhone.value);

			formData.append('corpOrganization', getPrincipal.value.corpId);
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

			await $fetch(
				`${runtimeConfig.public.VALUATION_BASE_URL}/api/v1/authority-letter/corp/create-authority-letter`,
				{
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
				},
			);
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

	return {
		registrationNumber,
		clientName,
		clientPhone,
		preferredBranch,
		comments,
		policyNumber,
		agencyOrCorp,
		createAuthorizationLetterLoading,
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
		getSelectedCorpOrBroker,
	};
};

export default useAuthorityLetters;
