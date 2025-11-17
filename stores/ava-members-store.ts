const { state, getter, mutation, action, ...store } = createStore('ava-members-store', {
	avaMembers: [] as any[],
});

export const getAvaMembers = getter('getAvaMembers', (state) => state.avaMembers);

export const setAvaMembers = mutation('setAvaMembers', (state, avaMembers: any) => {
	state.avaMembers = [...state.avaMembers, ...avaMembers];
});

export const cleanAvaMembers = mutation('cleanAvaMembers', (state) => {
	state.avaMembers = [];
});
