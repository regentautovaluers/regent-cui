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

// --- for existing sessions
export interface ExistingSessions {
	user_id: string;
	sessions: Session[];
	pagination: Pagination;
}

export interface Session {
	session_id: string;
	title: string;
	message_count: number;
	created_at: string;
	last_activity: string;
	last_message_preview: string;
}

export interface Pagination {
	page: number;
	size: number;
	total_sessions: number;
	total_pages: number;
	has_next: boolean;
	has_previous: boolean;
}

export type ExistingSessionSlim = Pick<Session, 'session_id' | 'created_at' | 'title'>;

// --- for session chat message history
export interface SessionHistory {
	session_id: string;
	user_id?: string;
	history: History[];
	pagination?: Pagination;
}

export interface History {
	role: string;
	content: string;
	timestamp: string;
	metadata: Metadata;
}

export interface Metadata {
	sources_count?: number;
	has_analytics?: boolean;
	is_analytical?: boolean;
}

export interface Pagination {
	page: number;
	size: number;
	total_messages: number;
	total_pages: number;
	has_next: boolean;
	has_previous: boolean;
}
