import { type LoggedInPrincipal } from '~/types';

export const { state, getter, mutation, action, ...store } = createStore('authenticatedPrincipal', {
	principal: {} as LoggedInPrincipal,
});

export const getPrincipal = getter('getAuthenticatedPrincipal', (state) => state.principal);

export const setPrincipal = mutation(
	'setAuthenticatedPrincipal',
	(state, authenticatedPrincipal: LoggedInPrincipal) => {
		state.principal = authenticatedPrincipal;
	},
);
