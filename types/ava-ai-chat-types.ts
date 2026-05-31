import type { MessageOrigin } from './ai-reports-chat-types';

export interface ChatResponse {
	origin: MessageOrigin;
	message: string
	user_id?: string
	response_status: ResponseStatus;
	data_type?: 'general'
	has_data?: boolean
	sources_used?: any[]
	valuations?: null
	analytics?: null
	total_found?: null
	corp_scoped?: boolean
	suggestions?: string[]
	chart_config?: any
	session_id?: string
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
	created_at: string;
	updated_at: string;
	message_count: number;
	corp_id: string;
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
	session_id: string
  user_id: string
  corp_id: string
  title: string
  created_at: string
  updated_at: string
  message_count: number
  history: History[]
  pagination: Pagination
}

export interface History {
	role: string;
	content: string;
	timestamp: string
}

export interface Pagination {
	page: number;
	size: number;
	total_messages: number;
	total_pages: number;
	has_next: boolean;
	has_previous: boolean;
}
