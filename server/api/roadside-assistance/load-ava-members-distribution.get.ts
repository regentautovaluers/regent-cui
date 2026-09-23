export default defineEventHandler(async (event) => {
  const { AVA_BASE_URL } = useRuntimeConfig();
  const cookies = parseCookies(event);
  const data: LoginResponse = await inflatePrincipal(cookies);
  const requestURL = `${AVA_BASE_URL}/api/v1/corp/reports/donut-graph-data?corporateId=${data.corpId}`;

  try {
    let response = await makeProxyRequest<GetAVAMemberVehicleDistribution>(
      requestURL,
      event,
    );

    if (response && response.data) {
      return sendSuccessResponse(response.data);
    }

    return sendSuccessResponse(null);
  } catch (err) {
    return sendErrorResponse(err);
  }
});
