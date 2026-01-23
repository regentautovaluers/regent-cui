import { type CorporateClient } from '~/types/corporate-valuations/corporate-clients';
import { type StandardSuccessResponse, type StandardErrorResponse } from '~/types/proxy-types';
import {
	getCorporateClients,
	setCorporateClients,
	cleanCorporateClients,
} from '~/stores/corporate-clients';

export default function useCorporateClient() {
	const { getAuthToken, isPrincipalBroker } = useAuth();
	const searchPhrase: Ref<string | null> = ref(null);

	const {
		pending: fetchingCorporateClients,
		error: errorFetchingCorporateClients,
		execute: refetchCorporateClients,
	} = useApiData<CorporateClient[], CorporateClient[]>(
		'corporate-clients',
		computed(() => `/api/vehicle-valuation/corporate-clients`),
		{
			method: 'GET',
			server: false,
			immediate: false,
			query: {
				api_key: getAuthToken.value,
				is_broker: isPrincipalBroker.value,
			},
			transform: (response) => {
				// Check if the API call was successful
				if (response.success) {
					// The response.data is correctly typed as TrackedVehicles[] here.
					return (response as StandardSuccessResponse<CorporateClient[]>).data;
				}

				// If it failed, throw the error
				throw new Error(
					(response as StandardErrorResponse).metadata.message || 'Unknown error',
				);
			},
			onResponse({ response }) {
				setCorporateClients(response._data.data as CorporateClient[]);
			},
		},
	);

	const computedCorporateClients: ComputedRef<CorporateClient[]> = computed(() => {
		if (getCorporateClients.value.length == 0) {
			return [] as CorporateClient[];
		}

		// if a search term is provided
		if (searchPhrase.value) {
			return getCorporateClients.value.filter((e) => {
				return e.corpName.toLowerCase().includes(searchPhrase.value as string);
			});
		}

		// general list
		return getCorporateClients.value as CorporateClient[];
	});

	async function shouldTriggerFetch(): Promise<void> {
		if (getCorporateClients.value.length == 0) {
			await refetchCorporateClients();
		}
	}

	return {
		computedCorporateClients,
		fetchingCorporateClients,
		errorFetchingCorporateClients,
		getCorporateClients,
		searchPhrase,
		shouldTriggerFetch,
	};
}
