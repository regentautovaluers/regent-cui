import type { CollateralSearchTypeOption } from '~/types';

const useCollateralVerficiation = () => {
	const collateralCheckLoading = ref(false);
	const runtimeConfig = useRuntimeConfig();
	const responseData: Ref<any> = ref(null);

	// search fraudster
	const searchCollateralTypeOptions: readonly CollateralSearchTypeOption[] = [
		{
			id: 'defaulter-db',
			name: 'Defaulters',
			prompt: 'Enter vehicle reg, chassis or engine number.',
			opensInModal: false,
		},
		{
			id: 'national-id',
			name: 'National ID',
			prompt: 'Enter national ID number.',
			opensInModal: true,
		},
		{
			id: 'alien-id',
			name: 'Alien ID',
			prompt: 'Enter alien ID number.',
			opensInModal: true,
		},
		{
			id: 'vehicle-reg',
			name: 'Vehicle Plate',
			prompt: 'Enter vehicle reg number.',
			opensInModal: false,
		},
		{
			id: 'driving-license',
			name: 'Driving License',
			prompt: 'Enter national ID number.',
			opensInModal: true,
		},
		{
			id: 'kra-pin',
			name: 'KRA PIN',
			prompt: 'Enter KRA pin',
			opensInModal: true,
		},
		{
			id: 'business',
			name: 'Business',
			prompt: 'Enter business registration number.',
			opensInModal: true,
		},
		{
			id: 'collateral',
			name: 'Loan Collateral',
			prompt: 'Enter vehicle chassis number.',
			opensInModal: false,
		},
		{
			id: 'bank-account',
			name: 'Bank Account',
			prompt: 'Enter bank account number.',
			opensInModal: true,
		},
	];

	const willNotOpenModal: Ref<CollateralSearchTypeOption[]> = ref([
		searchCollateralTypeOptions[0],
		searchCollateralTypeOptions[3],
		searchCollateralTypeOptions[7],
	]);

	const searchCollateralType: Ref<CollateralSearchTypeOption> = ref(
		searchCollateralTypeOptions[0],
	);

	const {
		status: fetchBankListStatus,
		execute: executeFetchBankList,
		data: bankList,
	} = useFetch('/api/v1/verification/bank-list', {
		key: 'bank-list',
		baseURL: runtimeConfig.public.FRAUD_DETECTION_BASE_URL,
		method: 'GET',
		headers: {
			Accept: 'application/json',
		},
		server: false,
		lazy: true,
		transform(data: any) {
			return data.data;
		},
	}) as any;

	const verifyCollateral = async (requestBody: {}, checkType: string) => {
		collateralCheckLoading.value = true;
		try {
			await $fetch(`/api/v1/verification/${checkType}`, {
				baseURL: runtimeConfig.public.FRAUD_DETECTION_BASE_URL,
				method: 'POST',
				body: JSON.stringify(requestBody),

				onResponse({ response }) {
					if (response.ok) {
						useToast('Success!', {
							type: 'success',
							showIcon: true,
							showCloseButton: false,
							hideProgressBar: true,
							transition: 'slide',
						});

						if (checkType == 'verify-driving-license') {
							responseData.value = response._data.data.data;
						} else {
							responseData.value = response._data.data;
						}
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
			collateralCheckLoading.value = false;
		}
	};

	return {
		responseData,
		collateralCheckLoading,
		fetchBankListStatus,
		executeFetchBankList,
		bankList,
		searchCollateralType,
		searchCollateralTypeOptions,
		willNotOpenModal,
		verifyCollateral,
	};
};

export default useCollateralVerficiation;
