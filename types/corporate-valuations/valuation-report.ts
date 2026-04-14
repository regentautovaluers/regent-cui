export interface ValuationReport {
	inspectionId: string;
	inspectionDate: string;
	location: Location;
	regentValuer: RegentValuer;
	regNo: string;
	vehicleMake: string;
	vehicleType: string;
	vehicleColor: string;
	countryOfOrigin: string;
	dateOfRegistration: any;
	yearOfManufacture: string;
	yearOfEntry: any;
	inspectionNB: string;
	inspectionRemarks: string;
	extras: string[];
	generalCondition: any;
	remedy: string;
	valuationBooking: ValuationBooking;
	frontFinal: FrontFinal;
	engineAndWindscreenFinal: EngineAndWindscreenFinal;
	rightSideFinal: RightSideFinal;
	backSideFinal: BackSideFinal;
	leftSideFinal: LeftSideFinal;
	tyreAndChassisFinal: TyreAndChassisFinal;
	interiorFinal: InteriorFinal;
	mechanicalAndElectricalFinal: MechanicalAndElectricalFinal;
}

export interface Location {
	name: string;
	lon: string;
	lat: string;
}

export interface RegentValuer {
	userId: string;
	username: string;
}

export interface ValuationBooking {
	valuationId: string;
	bookingSource?: string;
	bookingReversed?: boolean;
	bookingDate: string;
	inspectionDate: string;
	draftCreationDate?: string;
	approvalDate: string;
	regNo: string;
	vehicleImage: string;
	vehicleOwnership?: string;
	clientName: string | null;
	clientEmail: string | null;
	clientPhone: string | null;
	clientNatIdNumber?: any;
	kraPin?: string | null;
	vehicleType?: string;
	valuationStage: string;
	serviceCharge?: number;
	paymentStatus: string;
	paymentMethod?: PaymentMethod[];
	valuationLocation?: string;
	pendingDocuments: any[];
	uploadedDocuments?: string[];
	proposedValuationDate?: any;
	valuationType: ValuationType;
	corpOrganization: CorpOrganization;
	corporateBranch: CorporateBranch;
	onBehalfOfOrganization: CorpOrganization;
	regentBranch: RegentBranch;
	onBehalfOfRegentBranch?: any;
	regentValuer?: RegentUser;
	regentBooker?: RegentUser;
	approvedByManager?: RegentUser;
	approvedByQc?: RegentUser;
	approvedBySecretary?: RegentUser;
	pendingDocumentsURL: string;
	isSpecial: boolean;
	specialReportsUnit: SpecialReportsUnit;
	serialNumber: string;
	corporateRefNumber: any;
	boxNumber: string | null;
	reportURL: string | null;
	reportValidationToken?: string;
	vehicleValue: VehicleValue;
	completeTransaction: CompleteTransaction[];
	pending: string;
	inspectionNote: string;
	inspectionRemarks?: string;
	inspectionFnl: any;
}

export type SpecialReportsUnit =
	| 'TUKTUK'
	| 'MOTORBIKE'
	| 'GROUNDED_VEHICLE'
	| 'TRACTOR'
	| 'TRAILER'
	| 'PRE_THEFT'
	| 'PRE_ACCIDENT'
	| 'POST_ACCIDENT'
	| 'FULL_MECHANICAL'
	| 'INSURANCE_DUTY';

export type PaymentMethod = 'cash' | 'cheque' | 'mpesa' | 'invoice';
export type PaymentStatus = 'paid' | 'not-paid';

export interface CorporateBranch {
	branchId: string;
	branchName: string;
}

export interface ValuationType {
	id: number;
	valuationTypeName: string;
}

export interface CorpOrganization {
	corpId: string;
	corpName: string;
	customizeReport: boolean;
	corporateLogo: any;
}

export interface RegentBranch {
	branchId: string;
	branchName: string;
	branchEmail: string;
}

export interface RegentUser {
	userId: string;
	username: string;
}

export interface VehicleValue {
	marketValue: any;
	assessedValue: number;
	forcedSaleValue: number;
	windscreenValue: number;
	windscreenDealersPriceValue: any;
	radioValue: number;
	infotainmentValue: any;
	twoWayRadioValue: any;
	dutyFree: any;
	dutyPaid: any;
	awardNilValue: boolean;
	extrasValue: string[];
}

export interface CompleteTransaction {
	transactionId: number;
	receiptNumber: any;
	amountPaid: number;
	paymentMethod: string;
	paymentDate: string;
}

export interface FrontFinal {
	id: string;
	frontPhotos: string[];
	frontGrillCracked: string;
	frontGrillRepaired: string;
	frontGrillMisaligned: string;
	frontGrillUnfastened: string;
	frontGrillPushDent: string;
	frontBonnetCracked: string;
	frontBonnetRepaired: string;
	frontBonnetMisaligned: string;
	frontBonnetUnfastened: string;
	frontBonnetPushDent: string;
	frontBumperCracked: string;
	frontBumperRepaired: string;
	frontBumperMisaligned: string;
	frontBumperUnfastened: string;
	frontBumperPushDent: string;
	headlightCracked: string;
	headlightRepaired: string;
	headlightUnfastened: string;
	headlightFaded: string;
	sideMirrorCracked: string;
	sideMirrorRepaired: string;
	sideMirrorMissing: string;
	sideMirrorMisaligned: string;
	wiperFunctioning: string;
	wiperUnfastened: string;
	wiperMisaligned: string;
	typeOfLights: string;
	generalRemarks: string;
	generatedComment: any;
}

export interface EngineAndWindscreenFinal {
	id: string;
	enginePhotos: string[];
	engineNumber: string;
	engineNumberTampered: string;
	engineNumberMissingCharacters: string;
	engineHasSignsOfLeakages: string;
	engineHasSignsOfSmoking: string;
	engineMountingsWornOut: string;
	engineRating: string;
	fuelType: string;
	compartmentSignsOfRepairs: string;
	compartmentSignsOfModification: string;
	engineGeneralRemarks: string;
	windscreenPhotos: string[];
	windscreenTypeAndWiperCondition: string;
	windscreenCracked: string;
	policyNumber: any;
	insurerName: any;
	expiryDate: any;
	windscreenGeneralRemarks: string;
	engineGeneratedComment: any;
	windscreenGeneratedComment: any;
}

export interface RightSideFinal {
	id: string;
	rightSidePhotos: string[];
	wingPanelRepaired: string;
	wingPanelCracked: string;
	wingPanelMisaligned: string;
	wingPanelUnfastened: string;
	wingPanelDented: string;
	doorPillarsOperational: string;
	doorPillarsCracked: string;
	doorPillarsMisaligned: string;
	doorPillarsUnfastened: string;
	doorGlassesRepaired: string;
	doorGlassesCracked: string;
	doorGlassesMisaligned: string;
	doorGlassesUnfastened: string;
	doorGlassesMissing: string;
	sideStepsRepaired: string;
	sideStepsMisaligned: string;
	sideStepsUnfastened: string;
	sideStepsMissing: string;
	doorPanelRepaired: string;
	doorPanelCracked: string;
	doorPanelMisaligned: string;
	doorPanelUnfastened: string;
	doorPanelMissing: string;
	runningBoardOperational: string;
	runningBoardMissing: string;
	runningBoardUnfastened: string;
	generalRemarks: string;
	generatedComment: any;
}

export interface BackSideFinal {
	id: string;
	tailgateRepaired: string;
	tailgateCracked: string;
	tailgateMisaligned: string;
	tailgateUnfastened: string;
	tailgateDented: string;
	rearBumperRepaired: string;
	rearBumperCracked: string;
	rearBumperMisaligned: string;
	rearBumperUnfastened: string;
	rearBumperDented: string;
	rearLightRepaired: string;
	rearLightCracked: string;
	rearLightMisaligned: string;
	rearLightUnfastened: string;
	rearPillarsOperatingWell: string;
	rearPillarsUnfastened: string;
	rearPillarsMisaligned: string;
	generalBackRemarks: string;
	backPhotos: string[];
	bootSignsOfRepairs: string;
	bootSignsOfModification: string;
	generalBootRemarks: string;
	bootPhotos: string[];
	generatedComment: any;
}

export interface LeftSideFinal {
	id: string;
	leftSidePhotos: string[];
	wingPanelRepaired: string;
	wingPanelCracked: string;
	wingPanelMisaligned: string;
	wingPanelUnfastened: string;
	wingPanelDented: string;
	doorPillarsOperational: string;
	doorPillarsCracked: string;
	doorPillarsMisaligned: string;
	doorPillarsUnfastened: string;
	doorGlassesRepaired: string;
	doorGlassesCracked: string;
	doorGlassesMisaligned: string;
	doorGlassesUnfastened: string;
	doorGlassesMissing: string;
	sideStepsRepaired: string;
	sideStepsMisaligned: string;
	sideStepsUnfastened: string;
	sideStepsMissing: string;
	doorPanelRepaired: string;
	doorPanelCracked: string;
	doorPanelMisaligned: string;
	doorPanelUnfastened: string;
	doorPanelMissing: string;
	runningBoardOperational: string;
	runningBoardMissing: string;
	runningBoardUnfastened: string;
	generalRemarks: string;
	generatedComment: any;
}

export interface TyreAndChassisFinal {
	id: string;
	chassisNumber: string;
	chassisNumberAreaCorroded: string;
	chassisNumberAreaWelded: string;
	chassisNumberAreaReprinted: string;
	chassisNumberCharsTampered: string;
	chassisFrameCracked: string;
	chassisFrameWelding: string;
	chassisFrameJigging: string;
	chassisFrameElongation: string;
	chassisGeneralRemarks: string;
	chassisPhotos: string[];
	tyreMake: string;
	rimType: string;
	tyreSize: string;
	tyreWearPercentage: string;
	tyreWornOut: string;
	tyreExpiryDate: string;
	tyreGeneralRemarks: string;
	tyrePhotos: string[];
	tyreGeneratedComment: any;
	chassisGeneratedComment: any;
}

export interface InteriorFinal {
	id: string;
	numberOfSeats: string;
	seatsTorn: string;
	seatsUnfastened: string;
	dashboardCracked: string;
	dashboardTorn: string;
	numberOfAirbags: string;
	airbagsDetonated: string;
	airbagsRepaired: string;
	dashboardKnobsMissing: string;
	roofFaded: string;
	roofTorn: string;
	upholsteryPhotos: string[];
	upholsteryGeneralRemarks: string;
	odometerCurrentReading: number;
	odometerExportReading: number;
	odometerReadingUnits: string;
	mileageClearlyVisible: string;
	persistentWarningLightsOn: string;
	odometerPhotos: string[];
	odometerGeneralRemarks: string;
	antiTheftSystem: string;
	interiorGeneratedComment: any;
}

export interface MechanicalAndElectricalFinal {
	id: string;
	parkingBrakeEffective: string;
	brakingSystemOk: string;
	driveShaftsWornOut: string;
	gearboxOk: string;
	steeringSystemOk: string;
	suspensionSystemOk: string;
	coolingSystemOperatingWell: string;
	hasSignsOfFluidLeakage: string;
	engineRunningSmoothly: string;
	generalMechanicalRemarks: string;
	indicatorLightsFunctionProperly: string;
	wiringOrHarnessRepairs: string;
	persistentWarningLightsOnDashboard: string;
	brakeLightsFunctionProperly: string;
	headlightsFunctionProperly: string;
	generalElectricalRemarks: string;
	mechanicalGeneratedComment: any;
	electricalGeneratedComment: any;
}
