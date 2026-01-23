export type ChatStatus = 'RESUMED' | 'PROCESSING' | 'READY' | 'AWAITING'; // AWAITING is a custom status only for consumption on UI
export type MessageOrigin = 'user' | 'assistant';

export interface InitializeChatReponseStruct {
	session_id: string;
	booking_id: string;
	status: ChatStatus;
	history: ChatHistoryEntry[] | ChatMessage[] | []; // NB: This is sketchy. Find another way to do this!
}

export interface GetChatSessionStatusStruct {
	session_id: string;
	booking_id: null | string;
	status: ChatStatus;
	report_url: string;
	report_type: string;
}

export interface ChatMessage {
	timestamp: string;
	role: MessageOrigin;
	answer?: string;
	sources?: SourceQuote[];
	question?: string;
}

interface SourceQuote {
	page: string;
	has_table: boolean;
	content_preview: string;
	relevance_score: any;
}

export interface ChatHistory {
	session_id: string;
	total_messages: number;
	history: ChatHistoryEntry[];
}

export interface ChatHistoryEntry {
	role: MessageOrigin;
	content: string;
	timestamp: string;
	metadata: Metadata;
}

export interface Metadata {
	processing_time_ms?: number;
}

export function chatHistoryToChatMessage(e: ChatHistoryEntry): ChatMessage {
	const { role, timestamp, content } = e;
	return {
		role,
		timestamp,
		answer: content,
	};
}
