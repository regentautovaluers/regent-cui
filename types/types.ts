export type ApplicationChildRoute = {
	id: number;
	displayName: string;
	routeName: string;
	icon?: string;
};

export type ApplicationRoute = {
	id: number;
	displayName: string;
	routeName: string;
	children: ApplicationChildRoute[] | null;
};

export type bulkProcessedType = {
	full_name: string;
	phone_number: string;
	userEmail: string;
	corporateId: string;
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

export type informativeCoordsMarker = {
	id: number; // id 0 is for client current location and id 1 is for client destination(specifically for towing)
	info: string;
	coords: locationCoordsMarker;
};

export type LoggedInPrincipal = {
	userId: string;
	username: string;
	email: string;
	phonenumber: string;
	roles: string[];
	profilePicture: string;
	corpId: string;
	corpName: string;
	roleInOrganization: string;
};
