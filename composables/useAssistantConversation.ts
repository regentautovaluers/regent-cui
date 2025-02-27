import {
	setConversationId,
	getConversationId,
	cleanConversationId,
	getConversation,
	setConversation,
	cleanConversation,
} from '~/stores/botpress-conversation-store';
import type { TextNode } from '~/types';

const useAssistantConversation = () => {
	const appendTextNode = (text: string) => {
		setConversation({
			type: 'TextNode',
			text,
			source: 'Bot',
		} as TextNode);
	};

	return {
		setConversationId,
		getConversationId,
		cleanConversationId,
		getConversation,
		setConversation,
		cleanConversation,
		appendTextNode,
	};
};

export default useAssistantConversation;
