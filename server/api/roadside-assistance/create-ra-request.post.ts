export default defineEventHandler(async (event) => {
  const { AVA_BASE_URL } = useRuntimeConfig();
  const body: unknown = await readBody(event);
  const cookies = parseCookies(event);
  const data: LoginResponse = await inflatePrincipal(cookies);
  const endpoint = `${AVA_BASE_URL}/api/v1/mobile/${determineEndpointSuffix(
    (body as RequestRoadsideAssitanceBase).appServiceType,
  )}`;

  // attach the corporateId
  (body as RequestRoadsideAssitanceBase).corporate_client = data.corpId;
  console.log(JSON.stringify(body, null, 2));

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
