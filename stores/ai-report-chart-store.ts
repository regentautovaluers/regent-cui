import type { InitializeChatReponseStruct } from '~/types/ai-reports-chat-types';

const { state, getter, mutation, action, ...store } = createStore('ai-report-chat-store', {
	sessionContext: null as InitializeChatReponseStruct | null,
});

export const getSessionContext = getter('getSessionContext', (state) => state.sessionContext);

export const setSessionContext = mutation(
	'setSessionContext',
	(state, sessionContext: InitializeChatReponseStruct) => {
		state.sessionContext = sessionContext;
	},
);

export const cleanSessionContext = mutation('cleanSessionContext', (state) => {
	state.sessionContext = null;
});
