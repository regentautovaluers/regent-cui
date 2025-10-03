export interface Response {
	apiVersion: string;
	organizationName: string;
	message: string;
	status: number;
	data: CorporateClient[];
	requestExtras: RequestExtras;
}

export interface CorporateClient {
	corpId: string;
	corpName: string;
	broker: boolean;
	corpEmail?: string;
	corpPhone?: string;
	corpClass: string;
}

export interface RequestExtras {
	currentPage: number;
	totalPages: number;
	totalItems: number;
}
