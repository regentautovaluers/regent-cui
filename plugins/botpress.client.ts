import { getClient } from '@botpress/webchat';
import type { BotpressResponse } from '~/types';

export default defineNuxtPlugin(async () => {
	const client = getClient({ clientId: 'ced26376-bd02-4eea-9372-0b83ab1428f4' });
	const { parseBotpressResponse } = useAssistantConversation();
	await client.connect();

	client.on('message', (message) => {
		// state.messagesIncoming.push(message);
		parseBotpressResponse(message as unknown as BotpressResponse);
	});

	return {
		provide: {
			botpressClient: client,
		},
	};
});
