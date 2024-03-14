export type ApplicationChildRoute = {
	id: number;
	displayName: string;
	routeName: string;
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
	registration: string;
	recordedBy: string;
	category: string;
	fleetId: number;
};
