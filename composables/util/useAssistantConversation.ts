import {
	setConversationId,
	getConversationId,
	cleanConversationId,
	getConversation,
	setConversation,
	cleanConversation,
} from '~/stores/botpress-conversation-store';
import type {
	TextNode,
	BotpressResponse,
	BotpressNodeArrangementType,
	BotpressPayload,
	BotpressBlockType,
	BotpressActionGroupEntry,
	BotpressTextBlock,
	ActionGroupNode,
	ActionNode,
} from '~/types';

const useAssistantConversation = () => {
	const { $botpressClient: client } = useNuxtApp();

	const sendBotpressMessage = async (text: string) => {
		await client.sendMessage({ type: 'text', text });
	};

	const appendTextTypeNode = (text: string, source: 'Bot' | 'Human') => {
		setConversation({
			type: 'TextNode',
			text,
			source,
		} as TextNode);
	};

	const appendActionGroupNode = (actionGroupNode: ActionGroupNode) => {
		setConversation(actionGroupNode);
	};

	const parseBotpressResponse = (botpressResponse: BotpressResponse) => {
		setConversationId(botpressResponse.conversationId);
		const botpressPayload: BotpressPayload = botpressResponse.payload;
		const mainNodeArangementType: BotpressNodeArrangementType = botpressPayload.type;

		if (mainNodeArangementType === 'bubble') {
			const textBlock: BotpressTextBlock = botpressPayload.block as BotpressTextBlock;
			appendTextTypeNode(textBlock.text, 'Bot');
		}

		// if it's a row or a column, we know that more than one things have to be rendered on screen e.g a row of buttons
		if (mainNodeArangementType === 'row' || mainNodeArangementType === 'column') {
			const blocks: BotpressBlockType[] = botpressPayload.blocks as BotpressBlockType[];
			blocks.forEach((block) => {
				const blockType: BotpressNodeArrangementType = block.type;
				if (blockType === 'bubble') {
					const textBlock: BotpressTextBlock = block.block as BotpressTextBlock;

					console.log('Response text block node: ', textBlock);
					appendTextTypeNode(textBlock.text, 'Bot');
				}

				if (blockType === 'row' || blockType === 'column') {
					const blockBlocks: BotpressActionGroupEntry[] =
						block.blocks as BotpressActionGroupEntry[];
					const actionGroupNode: ActionGroupNode = {
						type: 'ActionGroupNode',
						buttonNodes: blockBlocks.map((block) => {
							return {
								type: 'ButtonNode',
								label: block.text,
								value: block.buttonValue,
							} as ActionNode;
						}),
					};

					console.log('Response Action group node: ', actionGroupNode);

					appendActionGroupNode(actionGroupNode);
				}
			});
		}
	};

	return {
		setConversationId,
		getConversationId,
		cleanConversationId,
		getConversation,
		setConversation,
		cleanConversation,
		appendTextTypeNode,
		sendBotpressMessage,
		parseBotpressResponse,
	};
};

export default useAssistantConversation;
