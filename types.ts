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

// for handling the human-bot conversation
export type MessageSource = 'Bot' | 'Human';

export type ActionNode = {
	type: 'ButtonNode';
	label: string;
	value: string;
};

export type TextNode = {
	type: 'TextNode';
	text: string;
	source: string;
};

export type ActionGroupNode = {
	type: 'ActionGroupNode';
	buttonNodes: ActionNode[];
};

// types defining how botpress sends back data
export type BotpressNodeArrangementType = 'bubble' | 'row' | 'column';

export type BotpressTextBlock = {
	type: 'string';
	text: string;
};

export type BotpressActionGroupEntry = {
	type: 'button';
	variant: 'action';
	text: string;
	buttonValue: string;
	groupId: string;
};

export type BotpressBlockType = {
	type: BotpressNodeArrangementType;
	blocks?: BotpressActionGroupEntry[]; // for example when there is a list to choose from
	block?: BotpressTextBlock; // for example when you're simply supposed to render text on the screen
};

export type BotpressPayload = {
	type: BotpressNodeArrangementType;
	horizontalAlignment: 'left' | 'right';
	blocks?: BotpressBlockType[];
	block?: BotpressTextBlock;
};

export type BotpressResponse = {
	id: string;
	conversationId: string;
	authorId: string;
	sentOn: string;
	payload: BotpressPayload;
};

export type TrackedDevice = {
	id: number | string;
	vehicleReg: string;
	lastPing: string | string;
	location: {
		lat: number;
		lng: number;
	};
	stopDuration: number | string;
	driver: {
		name: string;
		phone: string;
		email: string;
	};
	sensors: any[];

	speed: string | number;
	speedUnits: string;
};
