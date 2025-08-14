import type { CollateralSearchTypeOption, CollateralVerificationsCheckType } from '~/types';

export function useCollateralVerificiation() {
	const collateralCheckLoading = ref(false);
	const responseData: Ref<any> = ref(null);
	const searchDefaulterQuery: Ref<string> = ref('');
	const searchDefaulterLoading: Ref<boolean> = ref(false);
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const ravDefaulterDetails: Ref<any[] | null> = ref(null);
	const iaVehicleDetails: Ref<any> = ref(null);
	const iaVehicleCollateralDetails: Ref<any[] | null> = ref(null);
	const iaVehicleOwnerDetails: Ref<any> = ref(null);
	const checkType: Ref<CollateralVerificationsCheckType | null> = ref(null);

	const collateralSearchOptions: CollateralSearchTypeOption = {
		id: 'defaulter-db',
		name: 'Defaulters DB',
		prompt: 'Enter vehicle reg, chassis or engine number.',
		opensInModal: true,
	};
	const iprsSearchOptions: CollateralSearchTypeOption[] = reactive([
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
			id: 'loan-collateral',
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
	]);

	const searchCollateralType: Ref<CollateralSearchTypeOption> = ref(iprsSearchOptions[0]);

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

						if (
							checkType == 'verify-driving-license' ||
							checkType == 'verify-business'
						) {
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

	const searchDefaulter = async (type?: string, ...searchPhrases: string[]) => {
		searchDefaulterLoading.value = true;

		try {
			await $fetch(
				generateSearchDefaulterURI(searchCollateralType.value.id, ...searchPhrases),
				{
					baseURL: runtimeConfig.public.FRAUD_DETECTION_BASE_URL,
					method: 'GET',
					onResponse({ response }) {
						if (response.ok) {
							const responseData = response._data;

							if (searchCollateralType.value.id === 'defaulter-db') {
								// From Defaulters DB
								ravDefaulterDetails.value = responseData.data;
							} else if (searchCollateralType.value.id === 'loan-collateral') {
								// From IA
								iaVehicleCollateralDetails.value =
									responseData.data.verificationData.data.results;

								// From Defaullter's DB
								ravDefaulterDetails.value = responseData.data.fraudData;
							} else if (searchCollateralType.value.id === 'vehicle-reg') {
								// From IA
								iaVehicleDetails.value =
									responseData.data.verificationData.data.vehicle;

								// From Defaullter's DB
								ravDefaulterDetails.value = responseData.data.fraudData;
							}
						}
					},
				},
			);
		} catch (err) {
			useToast('Failed. Try Again!', {
				type: 'danger',
				showIcon: true,
				showCloseButton: false,
				hideProgressBar: true,
				transition: 'slide',
			});
		} finally {
			searchDefaulterLoading.value = false;
		}
	};

	function generateSearchDefaulterURI(type: string, ...searchPhrases: string[]): string | never {
		const sharedURISubstring: string = `searchType=valuation&searcherEmail=${getPrincipal.value.email}&searcherPhone=${getPrincipal.value.phonenumber}&searcherName=${getPrincipal.value.username}&searcherOrganisation=${getPrincipal.value.corpName}`;

		switch (type) {
			case 'defaulter-db':
				return `/api/v1/fraud/search?${searchPhrases.map(
					(q, i) => `searchQuery${i + 1}=${q}&`,
				)}&${sharedURISubstring}`;
			case 'loan-collateral':
				return `/api/v1/verification/verify-collateral?chassisNumber=${searchDefaulterQuery.value}&${sharedURISubstring}`;
			case 'vehicle-reg':
				return `/api/v1/verification/verify-vehicle?regNo=${searchDefaulterQuery.value}&${sharedURISubstring}`;

			default:
				throw new Error('No search type defined');
		}
	}

	return {
		responseData,
		collateralCheckLoading,
		searchDefaulterLoading,
		fetchBankListStatus,
		executeFetchBankList,
		bankList,
		searchCollateralType,
		iprsSearchOptions,
		searchDefaulterQuery,
		iaVehicleDetails,
		iaVehicleCollateralDetails,
		iaVehicleOwnerDetails,
		ravDefaulterDetails,
		collateralSearchOptions,
		checkType,
		verifyCollateral,
		searchDefaulter,
	};
}
