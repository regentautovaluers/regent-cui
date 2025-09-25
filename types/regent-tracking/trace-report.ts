export interface Response {
	status: string;
	stats: Stats;
	pagination: Pagination;
	devices: Report[];
}

export interface Stats {
	total: string;
	online: number;
	offline: number;
	expired: number;
}

export interface Pagination {
	page: number;
	limit: number;
	total: string;
	pages: number;
	has_prev: boolean;
	has_next: boolean;
	prev_page_url: any;
	next_page_url: string;
}

export interface Report {
	id: string;
	imei: string;
	name: string;
	sim_number: string;
	expiration_date: string;
	corporate_name: string;
	time: string;
	coordinates: string;
	last_updated: string;
	status: string;
	group_id: string;
	latest_comment: any;
	clientName: string;
	clientNo: string;
	installationDate: string;
	regno: string;
	validity_days: string;
}
