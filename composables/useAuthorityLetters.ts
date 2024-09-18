const useAuthorityLetters = () => {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const registrationNumber: Ref<string> = ref('');
	const clientName: Ref<string> = ref('');
	const clientPhone: Ref<string> = ref('');
	const preferredBranch: Ref<string> = ref('');
	const comments: Ref<string> = ref('');
	const policyNumber: Ref<string> = ref('');
	const agencyName: Ref<string> = ref('');
	const createAuthorizationLetterLoading: Ref<boolean> = ref(false);
	const uploadedDocuments: Ref<any[]> = ref([]);

	// for changing state of uploaded documents
	const logbookUploaded: Ref<boolean> = ref(false);
	const kraPinUploaded: Ref<boolean> = ref(false);
	const natIdUploaded: Ref<boolean> = ref(false);
	const certUploaded: Ref<boolean> = ref(false);
	const letterUploaded: Ref<boolean> = ref(false);

	watch(clientPhone, (newNumber) => {
		if (newNumber.startsWith('0') || newNumber.startsWith('+254')) {
			clientPhone.value = newNumber.replace(/^(\+254|0)/, '254');
		}
	});

	const handleFileUpload = (doc: string, file: File, prependString: string) => {
		if (file) {
			const ext = file.name.split('.').pop();
			const renamedFile = `${prependString}-${file.name.replace(`.${ext}`, '')}.${ext}`;
			const renamedFileBlob = new File([file], renamedFile, { type: file.type });

			console.info('rename file: ', renamedFile);

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
			formData.append('regentBranch', preferredBranch.value);
			formData.append('comments', comments.value);
			formData.append('policyNumber', policyNumber.value);
			formData.append('agencyName', agencyName.value);
			formData.append('corpOrganization', getPrincipal.value.corpId);
			formData.append('authorizedBy', getPrincipal.value.userId);

			// handle appending the files
			if (uploadedDocuments.value.length > 0) {
				for (const file of uploadedDocuments.value) {
					formData.append('files', file.blob);
				}
			}

			await $fetch(
				`${runtimeConfig.public.VALUATION_BASE_URL}/api/v1/authority-letter/create-authority-letter`,
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
			createAuthorizationLetterLoading.value = true;
		}
	};

	return {
		registrationNumber,
		clientName,
		clientPhone,
		preferredBranch,
		comments,
		policyNumber,
		agencyName,
		createAuthorizationLetterLoading,
		logbookUploaded,
        kraPinUploaded,
        natIdUploaded,
        certUploaded,
        letterUploaded,
		createAuthorizationLetter,
		handleFileUpload,
	};
};

export default useAuthorityLetters;
