export type ChatStatus = 'RESUMED' | 'PROCESSING' | 'READY';

export interface InitializeChatReponseStruct {
	session_id: string;
	booking_id: string;
	status: ChatStatus;
	message?: string;
	estimated_processing_time?: number;
	existing_chat_messages?: number;
}
