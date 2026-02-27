import { type CorporateClient } from '~/types/corporate-valuations/corporate-clients';
import { useCorporateClientsStore } from '~/stores/corporate-clients-store';
import type { GenericResponse } from '~/types/corporate-valuations/generic-response-type';

export default function useCorporateClient() {
	const { getAuthToken, isPrincipalBroker } = useAuth();
	const searchPhrase: Ref<string | null> = ref(null);
	const { getCorporateClients, setCorporateClients, cleanCorporateClients } =
		useCorporateClientsStore();

	const { pending: fetchingCorporateClients, error: errorFetchingCorporateClients } = useApiData<
		CorporateClient[],
		CorporateClient[]
	>(
		'corporate-clients',
		computed(() => `/api/vehicle-valuation/corporate-clients`),
		{
			method: 'GET',
			server: false,
			query: {
				api_key: getAuthToken.value,
				is_broker: isPrincipalBroker.value,
			},
			getCachedData(_key) {
				const cached = getCorporateClients();
				if (cached.length > 0) return cached as CorporateClient[];
			},
			onResponse({ response }) {
				setCorporateClients(response._data.data as CorporateClient[]);
			},
		},
	);

	const computedCorporateClients: ComputedRef<CorporateClient[]> = computed(() => {
		const t = getCorporateClients();
		if (t.length == 0) {
			return [] as CorporateClient[];
		}

		// if a search term is provided
		if (searchPhrase.value) {
			return t.filter((e) => {
				return e.corpName.toLowerCase().includes(searchPhrase.value as string);
			});
		}

		// general list
		return t;
	});

	return {
		computedCorporateClients,
		fetchingCorporateClients,
		errorFetchingCorporateClients,
		getCorporateClients,
		searchPhrase,
	};
}
