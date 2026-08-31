export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const { VALUATION_BASE_URL } = useRuntimeConfig();
  const query: {
    page: number;
    size: number;
  } = getQuery(event);
  const data: LoginResponse = await inflatePrincipal(cookies);

  let endpoint = `${VALUATION_BASE_URL}/api/v1/auth/corporate-account/get-accounts?corporateId=${data.corpId}`;
  
  if (query.page) {
    endpoint = endpoint + `&page=${query.page}`;
  }

  if (query.size) {
    endpoint = endpoint + `&size=${query.size}`;
  }

  try {
    let response = await makeProxyRequest<GenericResponse<ValuationPrincipal[]>>(
      endpoint,
      event,
    );

    return sendSuccessResponse(response);
  } catch (ex) {
    console.log(ex)
    return sendErrorResponse(ex);
  }
});
