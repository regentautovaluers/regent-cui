import { type LoggedInPrincipal } from '~/types';

export const { state, getter, mutation, action, ...store } = createStore('authenticatedPrincipal', {
	authenticatedPrincipal: {} as LoggedInPrincipal,
});

export const getAuthenticatedPrincipal = getter(
	'getAuthenticatedPrincipal',
	(state) => state.authenticatedPrincipal,
);

export const setAuthenticatedPrincipal = mutation(
	'setAuthenticatedPrincipal',
	(state, authenticatedPrincipal: LoggedInPrincipal) => {
		state.authenticatedPrincipal = authenticatedPrincipal;
	},
);
