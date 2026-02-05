export interface NavigationRoute {
	id: number;
	screenName: string;
	routeName: string;
	renderRoute: boolean;
	description?: string;
	shortDescription?: string;
	icon?: string;
}

export interface CoreRoute extends NavigationRoute {
	childRoutes?: NavigationRoute[];
}

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

export type CollateralSearchTypeOption = {
	name: string;
	id: string;
	prompt?: string;
	opensInModal: boolean;
};

export type CollateralAssetEntry = {
	registrationNumber: string | null;
	chassisNumber: string | null;
	engineNumber: string | null;
	color: string | null;
	make: string | null;
	model: string | null;
	yearOfManufacture: number | null;
	corporateClientId?: string | null;
	corporateClientName?: string | null;
	corpClientRepName?: string | null;
	corpClientEmail?: string | null;
	corpClientPhoneNumber?: string | null;
	description: string | null;
	relevantLinks?: string[] | null;
	dateOfIncident: string | null;
	amountDefaulted: number | null;
};

export type CollateralVerificationsTokens = {
	id: string;
	name: string | null;
	balance: number;
	billingType: 'postpaid' | 'prepaid';
	invoiceDueDays: string | number | null;
	fraudBundleSearches: number | null;
	verifyNationalIdSearches: number | null;
	verifyAlienIdSearches: number | null;
	verifyVehicleSearches: number | null;
	verifyDrivingLicenseSearches: number | null;
	verifyKraPinSearches: number | null;
	verifyBusinessSearches: number | null;
	verifyCollateralSearches: number | null;
	verifyBankAccountSearches: number | null;
};

export type CollateralVerificationsCheckType =
	| 'national-id'
	| 'alien-id'
	| 'vehicle-reg'
	| 'driving-license'
	| 'kra-pin'
	| 'business'
	| 'loan-collateral'
	| 'bank-account';

export type GeneralNotificationType = {
	id: string;
	data: {
		source: string;
		mpesaReceipt?: string;
	};
	department: string;
	message: string;
	priority: string;
	read: false;
	timestamp: BigInt;
	type: string;
};
