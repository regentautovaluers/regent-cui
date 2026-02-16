import { EventEmitter } from 'events';

// A single instance shared across the server
export const hub = new EventEmitter();

export const AI_CHAT_SERVER_EVENTS = {
	ANSWER_RECEIVED: 'answer_received',
	ANSWER_FAILED: 'answer_failed',
};
