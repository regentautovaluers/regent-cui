import type { InitializeChatReponseStruct, ChatMessage } from '~/types/ai-reports-chat-types';

const { state, getter, mutation, action, ...store } = createStore('ai-report-chat-store', {
	sessionContext: null as InitializeChatReponseStruct | null,
	chatMessages: [] as { session_id: string; messages: ChatMessage[] }[],
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

export const getMessagesBySession = getter('getMessagesBySession', (state) => {
	return (sessionId: string) => {
		const session = state.chatMessages.find((item) => item.session_id === sessionId);
		return session ? session.messages : [];
	};
});

export const setChatMessage = action(
	'setChatMessage',
	async (message: { session_id: string; newMessage: ChatMessage }, mutate) => {
		mutate((state) => {
			let toEdit = state.chatMessages.findIndex((e) => e.session_id == message.session_id);
			state.chatMessages[toEdit].messages.push(message.newMessage);
		});
	},
);

export const cleanChatMessages = mutation('cleanChatMessage', (state) => {
	state.chatMessages = [];
});

export const cleanChatMessage = mutation('cleanChatMessage', (state, session_id: string) => {
	let toClean = state.chatMessages.findIndex((e) => (e.session_id = session_id));
	state.chatMessages[toClean].messages = [];
});
