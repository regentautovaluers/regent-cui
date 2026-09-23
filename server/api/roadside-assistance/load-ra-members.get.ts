export default defineEventHandler(async (event) => {
  const { AVA_BASE_URL } = useRuntimeConfig();
  const cookies = parseCookies(event);
  const data: LoginResponse = await inflatePrincipal(cookies);
  const query: {
    page: number;
    size: number;
  } = getQuery(event);
  const requestURL = `${AVA_BASE_URL}/api/v1/memberships?corporateId=${data.corpId}&page=${query.page}&size=${query.size}`;
  try {
    let response = await makeProxyRequest<CorporateAVAMembers>(
      requestURL,
      event,
    );

    return sendSuccessResponse(response);
  } catch (err) {
    console.log(err);
    return sendErrorResponse(err);
  }
});
