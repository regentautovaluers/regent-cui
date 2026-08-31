export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const { VALUATION_BASE_URL } = useRuntimeConfig();

  const data: LoginResponse = await inflatePrincipal(cookies);

  let endpoint = `${VALUATION_BASE_URL}/api/v1/corporate-branch/get-all?corpId=${data.corpId}`;
  try {
    let response = await makeProxyRequest<GenericResponse<CorporateBranch[]>>(
      endpoint,
      event,
    );

    return sendSuccessResponse(response.data);
  } catch (ex) {
    console.log(ex);
    return sendErrorResponse(ex);
  }
});
