export const { state, getter, mutation, action, ...store } = createStore('corporateBranches', {
	corporateBranches: [] as any[],
});

export const getCorporateBranches = getter(
	'getCorporateBranches',
	(state) => state.corporateBranches,
);

export const setCorporateBranches = mutation(
	'setCorporateBranches',
	(state, corporateBranches: any) => {
		state.corporateBranches = corporateBranches;
	},
);

export const cleanCorporateBranches = mutation('cleanCorporateBranches', (state) => {
	state.corporateBranches = [];
});
