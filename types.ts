import { type TransitionType, type Position } from 'mosha-vue-toastify';

export interface NavigationRoute {
	id: number;
	screenName: string;
	routeName: string;
	renderRoute: boolean;
}

export interface CoreRoute extends NavigationRoute {
	childRoutes?: NavigationRoute[];
}

export type LoggedInPrincipal = {
	userId: string;
	username: string;
	email: string;
	phonenumber: string;
	roles: string[];
	profilePicture: string;
	corpId: string;
	branchId: string;
	corpName: string;
	roleInOrganization: string;
	isBroker: boolean;
};

export interface LocationCoords {
	lat: number;
	lng: number;
}

export interface MapCoordsMarker extends LocationCoords {
	id: number;
	label: string;
}

export type BulkProcessedMembershipType = {
	corpName: string;
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

export type ExcelProcesssingErrorMessage = {
	message: string | unknown;
	type: string;
};

export type IndividuaProcessedMembershipType = {
	corpName: string;
	membershipTypeId: number;
	registration: string;
	make: string;
	model: string;
	color: string;
	payment_status: string;
	membership_status: string;
	start_date: string;
	end_date: string;
};

export type ToastConfigOptions = {
	timeout?: number;
	type: string;
	showCloseButton: boolean;
	transition?: TransitionType;
	hideProgressBar?: boolean;
	showIcon?: boolean;
	position?: Position;
};

export type RoadsideAssistanceAnalytics = {
	jumpstarting: number;
	fueldelivery: number;
	towing: number;
	tyrechange: number;
};

export type SelectedCorpOrBroker = {
	name: string;
	id: string;
};

export enum ValuationStages {
	AWAITING_ASSESSMENT,
	VALUER_DRAFT,
	PENDING,
	AWAITING_MANAGER_APPROVAL,
	AWAITING_QC_APPROVAL,
	COMPLETED,
	INVOICING,
}
