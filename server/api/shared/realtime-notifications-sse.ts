import { hub, AI_CHAT_SERVER_EVENTS } from '~/server/utils/sse-event-hub';
import type { ChatResponse } from '~/types/ava-ai-chat-types';

export default defineEventHandler(async (event) => {
	setResponseHeader(event, 'Content-Type', 'text/event-stream');
	setResponseHeader(event, 'Cache-Control', 'no-cache');
	setResponseHeader(event, 'Connection', 'keep-alive');

	const eventStream = createEventStream(event);
	const streamAiResponseMessage = async (answer: ChatResponse) => {
		await eventStream.push(JSON.stringify(answer));
	};

	// subscribe to events
	hub.on(AI_CHAT_SERVER_EVENTS.ANSWER_RECEIVED, streamAiResponseMessage);
	hub.on(AI_CHAT_SERVER_EVENTS.ANSWER_FAILED, streamAiResponseMessage);

	return eventStream.send();
});
