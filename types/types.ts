export type ApplicationChildRoute = {
	id: number;
	displayName: string;
	routeName: string;
	icon?: string;
};

export type ApplicationRoute = {
	id: number;
	displayName: string;
	icon: string;
	routeName: string;
	children?: ApplicationChildRoute[];
};

export type bulkProcessedType = {
	full_name: string;
	phone_number: string;
	userEmail: string;
	corporateId: number;
	membershipTypeId: number;
	start_date: string;
	end_date: string;
	make: string;
	model: string;
	color: string;
	payment_status: string;
	membership_status: string;
	available_free_distance: any;
	registration: string;
	recordedBy: string;
	category: string;
	fleetId: number;
};

export type excelUploadErrMess = {
	message: string | unknown;
	type: string;
};

export type moreServices = {
	icon: string;
	title: string;
	description: string;
	pageName: string;
};

export type locationCoordsMarker = {
	lat: number;
	lng: number;
};
