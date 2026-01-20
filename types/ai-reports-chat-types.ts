export type ChatStatus = 'RESUMED' | 'PROCESSING' | 'READY';
export type MessageOrigin = 'user' | 'assistant';

export interface InitializeChatReponseStruct {
	session_id: string;
	booking_id: string;
	status: ChatStatus;
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
	origin: MessageOrigin;
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
