import type {
	AvaVehicleTypes,
	SlimmedAvaVehicleTypes,
} from '~/types/ava-roadside-assistance/vehicle-types';

export default defineEventHandler(async (event) => {
	const { AVA_BASE_URL } = useRuntimeConfig();

	try {
		const supportedTypes = await makeProxyRequest<AvaVehicleTypes[]>(
			`${AVA_BASE_URL}/api/v1/control-unit/vehicle-types`,
		);
		if (supportedTypes == null || supportedTypes.length == 0) {
			return sendSuccessResponse(event, []);
		}

		const slimmedResponse: SlimmedAvaVehicleTypes[] = supportedTypes.map((e) => ({
			id: e.id,
			description: e.description,
			towingRateWithinThresholdPrice: e.towingRate.withinThreshHoldPrice,
			towingRateOverThresholdPriceMembers: e.towingRate.overThreshHoldPriceMembers,
			towingRateOverThresholdPriceNonMembers: e.towingRate.overThreshHoldPriceNonMembers,
			towingRateThresholdDistance: e.towingRate.threshHoldDistance,
		}));
		return sendSuccessResponse(event, slimmedResponse);
	} catch (err) {
		return sendErrorResponse(event, err);
	}
});
