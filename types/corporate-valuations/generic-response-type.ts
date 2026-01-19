export interface GenericResponse<T = null> {
	apiVersion: string;
	organizationName: string;
	message: string;
	status: number;
	data: T;
	requestExtras: RequestExtras | null;
}

export interface RequestExtras {
	currentPage: number;
	totalPages: number;
	totalItems: number;
}
