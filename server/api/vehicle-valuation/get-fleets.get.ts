export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const { VALUATION_BASE_URL } = useRuntimeConfig();
  const data: LoginResponse = await inflatePrincipal(cookies);

  let requestURL = `${VALUATION_BASE_URL}/api/v1/valuation/fleets/get-all?corpId=${data.corpId}`;

  try {
    let response = await makeProxyRequest<GenericResponse<FleetEntry[]>>(
      requestURL,
      event,
    );

    return sendSuccessResponse(response);
  } catch (err) {
    return sendErrorResponse(err);
  }
});
