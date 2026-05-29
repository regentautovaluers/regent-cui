import { defineStore } from 'pinia';
import { type CorporateClient } from '~/types/corporate-valuations/corporate-clients';

export const useCorporateClientsStore = defineStore('corporate-clients-store', () => {
	const corporateClients: Ref<CorporateClient[]> = ref([]);

	function getCorporateClients() {
		return corporateClients.value;
	}

	function setCorporateClients(n: CorporateClient[]) {
		corporateClients.value = n;
	}

	function cleanCorporateClients() {
		corporateClients.value = [];
	}

	return {
		getCorporateClients,
		setCorporateClients,
		cleanCorporateClients,
	};
});
