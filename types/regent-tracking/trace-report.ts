export interface TraceabilityReport {
	status: string;
	pagination: Pagination;
	results: Report[];
}

export interface Pagination {
	page: number;
	limit: number;
	total: string;
	pages: number;
	has_prev: boolean;
	has_next: boolean;
	prev_page_url?: string;
	next_page_url?: string;
}

export interface Report {
	tracker_id: number;
	comments: Comments[];
}

export interface Comments {
	id: number;
	device_id: number;
	comment: string;
	username: string;
	created_at: Date;
	watchlist: 'Y' | 'N';
}
