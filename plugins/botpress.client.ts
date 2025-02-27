import { getClient } from '@botpress/webchat';

export default defineNuxtPlugin(async () => {
	const client = getClient({ clientId: 'ced26376-bd02-4eea-9372-0b83ab1428f4' });
	await client.connect();

	// TODO: remove these as they're only temporary
	type State = {
		conversationId?: string;
		lastestEvent?: Record<string, any>;
		messagesOutgoing: any[];
		messagesIncoming: any[];
	};

	const state: State = {
		lastestEvent: undefined,
		conversationId: undefined,
		messagesOutgoing: [],
		messagesIncoming: [],
	};

	client.on('conversation', (conversation) => {
		state.conversationId = conversation;
	});

	client.on('customEvent', (event) => {
		state.lastestEvent = event;
	});

	client.on('messageSent', (message) => {
		state.messagesOutgoing.push(message);
	});

	client.on('message', (message) => {
		state.messagesIncoming.push(message);
	});

	setInterval(() => {
		console.log('state: ', JSON.stringify(state));
	}, 2000);

	return {
		provide: {
			botpressClient: client,
		},
	};
});
