import type { MessageOrigin } from './ai-reports-chat-types';

export interface ChatResponse {
	session_id?: string;
	response: string | null;
	sources?: Source[];
	metadata?: Metadata;
	response_status: ResponseStatus;
	origin: MessageOrigin;
}

export type ResponseStatus = 'successful' | 'error';

export interface Source {
	id: string;
	score: number;
	regNo: string;
	valuationId: string;
	vehicleMake: string;
	corpName: string;
	inspectionDate: string;
	chunk_type: string;
}

export interface Metadata {
	model: string;
	user_id: string;
	corp_id: string;
	is_admin: boolean;
}
