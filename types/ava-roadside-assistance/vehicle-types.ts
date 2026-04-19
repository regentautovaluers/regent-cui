export interface AvaVehicleTypes {
	id: number;
	description: string;
	recordedBy: string;
	createdAt: string;
	updatedAt: string;
	towingRate: TowingRate;
}

export interface TowingRate {
	id: number;
	freeDistance: number;
	threshHoldDistance: number;
	withinThreshHoldPrice: number;
	overThreshHoldPriceMembers: number;
	overThreshHoldPriceNonMembers: number;
	recordedBy: string;
	createdAt: string;
	updatedAt: string;
}

export type SlimmedAvaVehicleTypes = {
	id: AvaVehicleTypes['id'];
	description: AvaVehicleTypes['description'];
	towingRateWithinThresholdPrice: TowingRate['withinThreshHoldPrice'];
	towingRateOverThresholdPriceNonMembers: TowingRate['overThreshHoldPriceNonMembers'];
	towingRateOverThresholdPriceMembers: TowingRate['overThreshHoldPriceMembers'];
	towingRateThresholdDistance: TowingRate['threshHoldDistance'];
};
