import { type ButtonGroupNode, type TextNode } from '~/types';

export const { state, getter, mutation, action, ...store } = createStore('', {
	conversationId: '' as string,
	conversation: [] as any, // TODO: fix this
});

export const getConversationId = getter('getConversationId', (state) => state.conversationId);

export const setConversationId = mutation('setConversationId', (state, conversationId: string) => {
	state.conversationId = conversationId;
});

export const cleanConversationId = mutation('cleanConversationId', (state) => {
	state.conversationId = '';
});

export const setConversation = mutation(
	'setConversation',
	(state, conversation: ButtonGroupNode[] | TextNode) => {
		state.conversation.push(conversation);
	},
);

export const cleanConversation = mutation('cleanConversation', (state) => {
	state.conversation = [];
});

export const getConversation = getter('getConversation', (state) => state.conversation);
