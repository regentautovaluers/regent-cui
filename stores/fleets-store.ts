export const { state, getter, mutation, action, ...store } = createStore('corporateBranches', {
	fleets: [] as any[],
});

export const getFleets = getter('getFleets', (state) => state.fleets);

export const setFleets = mutation('setFleets', (state, corporateBranches: any) => {
	state.fleets = corporateBranches;
});

export const cleanFleets = mutation('cleanFleets', (state) => {
	state.fleets = [];
});
