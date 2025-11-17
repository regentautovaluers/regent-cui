import { type LoggedInPrincipal } from '~/types';

const { state, getter, mutation, action, ...store } = createStore('authenticatedPrincipal', {
	principal: null as LoggedInPrincipal | null,
});

export const getPrincipal = getter('getAuthenticatedPrincipal', (state) => state.principal);

export const setPrincipal = mutation(
	'setAuthenticatedPrincipal',
	(state, authenticatedPrincipal: LoggedInPrincipal) => {
		state.principal = authenticatedPrincipal;
	},
);

export const cleanPrincipal = mutation('cleanAuthenticatedPrincipal', (state) => {
	state.principal = null;
});
