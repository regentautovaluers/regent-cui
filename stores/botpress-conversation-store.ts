export const { state, getter, mutation, action, ...store } = createStore('', {
	conversationId: '' as string,
	conversation: [],
});

export const getConversationId = getter('getConversationId', (state) => state.conversationId);

export const setConversationId = mutation('setConversationId', (state, conversationId: string) => {
	state.conversationId = conversationId;
});
