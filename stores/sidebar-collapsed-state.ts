const { state, getter, mutation, action, ...store } = createStore('sidebarCollapsedState', {
	sidebarCollapsedState: false as boolean,
});

export const getSidebarCollapsedState = getter(
	'getSidebarCollapsedState',
	(state) => state.sidebarCollapsedState,
);

export const toggleSidebarCollapsedState = mutation('toggleSidebarCollapsedState', (state) => {
	state.sidebarCollapsedState = !state.sidebarCollapsedState;
});

export const setSidebarCollapsedState = mutation(
	'setSidebarCollapsedState',
	(state, newState: boolean) => {
		state.sidebarCollapsedState = newState;
	},
);
