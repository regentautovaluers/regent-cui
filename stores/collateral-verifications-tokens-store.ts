import { type CollateralVerificationsTokens } from '~/types';

export const { state, getter, mutation, action, ...store } = createStore(
	'collateral-verifications-tokens-store',
	{
		tokensMetadata: null as CollateralVerificationsTokens | null,
	},
);

export const getCollateralVerificationTokenInfo = getter(
	'getCollateralVerificationTokenInfo',
	(state) => state.tokensMetadata,
);

export const setCollateralVerificationTokenInfo = mutation(
	'setCollateralVerificationTokenInfo',
	(state, info: CollateralVerificationsTokens) => {
		state.tokensMetadata = info;
	},
);

export const cleanCollateralVerificationTokenInfo = mutation(
	'cleanCollateralVerificationTokenInfo',
	(state) => {
		state.tokensMetadata = null;
	},
);
