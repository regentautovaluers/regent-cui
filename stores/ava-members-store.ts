export const { state, getter, mutation, action, ...store } = createStore('corporateBranches', {
	avaMembers: [] as any[],
});

export const getAvaMembers = getter('getAvaMembers', (state) => state.avaMembers);

export const setAvaMembers = mutation('setAvaMembers', (state, avaMembers: any) => {
	state.avaMembers = [...state.avaMembers, ...avaMembers];
});

export const cleanAvaMembers = mutation('cleanAvaMembers', (state) => {
	state.avaMembers = [];
});
