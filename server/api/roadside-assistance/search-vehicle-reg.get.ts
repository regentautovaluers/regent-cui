export default defineEventHandler(async (event) => {
  const { AVA_BASE_URL } = useRuntimeConfig();
  const query: { regNo: string } = getQuery(event);
  const cookies = parseCookies(event);
  const data: LoginResponse = await inflatePrincipal(cookies);
  let requestURL = `${AVA_BASE_URL}/api/v1/bookings?registration=${query.regNo}&corporateId=${data.corpId}`;

  try {
    let response = await makeProxyRequest<SearchAVAMemberVehicle>(
      requestURL,
      event,
    );

    return sendSuccessResponse(response);
  } catch (err) {
    return sendErrorResponse(err);
  }
});
