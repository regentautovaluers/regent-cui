export const { state, getter, mutation, action, ...store } = createStore('corporateBranches', {
	membershipTypes: [] as any[],
});

export const getMembershipTypes = getter('getMembershipTypes', (state) => state.membershipTypes);

export const setMembershipTypes = mutation(
	'setMembershipTypes',
	(state, corporateBranches: any) => {
		state.membershipTypes = corporateBranches;
	},
);

export const cleanCorporateBranches = mutation('cleanMembershipTypes', (state) => {
	state.membershipTypes = [];
});
