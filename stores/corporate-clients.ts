import { type CorporateClient } from '~/types/corporate-valuations/corporate-clients';
const { state, getter, mutation, action, ...store } = createStore('corporate-clients', {
	corporateClients: [] as CorporateClient[],
});

export const getCorporateClients = getter('getCorporateClients', (state) => state.corporateClients);

export const setCorporateClients = mutation(
	'setCorporateClients',
	(state, corporateClients: CorporateClient[]) => {
		state.corporateClients = corporateClients;
	},
);

export const cleanCorporateClients = mutation('cleanCorporateClients', (state) => {
	state.corporateClients = [];
});
