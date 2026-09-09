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
	const { executeFetchCollateralVerificationTokenStatus } =
		useCollateralVerificationTokensManagement();

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
	]);

	const searchCollateralType: Ref<CollateralSearchTypeOption> = ref(iprsSearchOptions[0]);

	const verifyCollateral = async (requestBody: {}) => {
		collateralCheckLoading.value = true;
		try {
			await $fetch('/api/v1/iprs/id-card', {
				baseURL: runtimeConfig.public.IPRS_BASE_URL,
				method: 'POST',
				body: JSON.stringify(requestBody),

				async onResponse({ response }) {
					if (response.ok) {
						useToast('Success!', {
							type: 'success',
						});

						responseData.value = response._data.data;

						await executeFetchCollateralVerificationTokenStatus();
					}
				},
			});
		} catch (err) {
			useToast('Failed. Try Again!', {
				type: 'error',
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
					async onResponse({ response }) {
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

							await executeFetchCollateralVerificationTokenStatus();
						}
					},
				},
			);
		} catch (err) {
			useToast('Failed. Try Again!', {
				type: 'error',
			});
		} finally {
			searchDefaulterLoading.value = false;
		}
	};

	function generateSearchDefaulterURI(type: string, ...searchPhrases: string[]): string | never {
		const sharedURISubstring: string = `searchType=valuation&searcherEmail=${getPrincipal()?.email}&searcherPhone=${getPrincipal()?.phoneNumber}&searcherName=${getPrincipal()?.username}&searcherOrganisation=${getPrincipal()?.corpOrganization.corpName}`;

		switch (type) {
			case 'defaulter-db':
				return `/api/v1/fraud/search?${searchPhrases
					.filter((sp) => sp.length > 0)
					.map((q, i) => `searchQuery${i + 1}=${q}&`)}${sharedURISubstring}`;
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
