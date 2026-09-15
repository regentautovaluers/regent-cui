export default defineEventHandler(async (event) => {
  const { AVA_BASE_URL } = useRuntimeConfig();
  const body: unknown = await readBody(event);
  const endpoint = `${AVA_BASE_URL}/api/v1/mobile/${determineEndpointSuffix(
    (body as RequestRoadsideAssitanceBase).appServiceType,
  )}`;

  try {
    await makeProxyRequest(endpoint, event, {
      method: "POST",
      body,
    });

    // return a success response
    return sendSuccessResponse(event);
  } catch (err) {
    return sendErrorResponse(event);
  }
});
