export default defineEventHandler(async (event) => {
  const { AVA_BASE_URL } = useRuntimeConfig();
  const requestURL = `${AVA_BASE_URL}/api/v1/control-unit/vehicle-types`;

  try {
    let supportedTypes = await makeProxyRequest<AvaVehicleTypes[]>(
      requestURL,
      event,
    );

    if (supportedTypes == null || supportedTypes.length == 0) {
      return sendSuccessResponse([]);
    }

    const slimmedResponse: SlimmedAvaVehicleTypes[] = supportedTypes.map(
      (e) => ({
        id: e.id,
        description: e.description,
        towingRateWithinThresholdPrice: e.towingRate.withinThreshHoldPrice,
        towingRateOverThresholdPriceMembers:
          e.towingRate.overThreshHoldPriceMembers,
        towingRateOverThresholdPriceNonMembers:
          e.towingRate.overThreshHoldPriceNonMembers,
        towingRateThresholdDistance: e.towingRate.threshHoldDistance,
      }),
    );

    return sendSuccessResponse(slimmedResponse);
  } catch (err) {
    return sendErrorResponse(err);
  }
});
