export default defineEventHandler(async (event) => {
  const { AVA_BASE_URL } = useRuntimeConfig();
  const requestURL = `${AVA_BASE_URL}/api/v1/control-unit/services`;

  try {
    let charges = await makeProxyRequest<
      RoadsideAssistanceFixedServiceCharges[]
    >(requestURL, event);

    return sendSuccessResponse(charges);
  } catch (err) {
    console.log(err);
    return sendErrorResponse(err);
  }
});
