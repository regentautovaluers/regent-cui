export type ChatStatus = 'RESUMED' | 'PROCESSING' | 'READY';

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
