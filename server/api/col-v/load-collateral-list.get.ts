export default defineEventHandler(async (event) => {
  const { COLV_BASE_URL, COLV_KEY_PASSKEY } = useRuntimeConfig();
  const cookies = parseCookies(event);
  const query: {
    page: number;
    size: number;
  } = getQuery(event);
  const data: LoginResponse = await inflatePrincipal(cookies);

  const requestURL = `${COLV_BASE_URL}/api/v1/fraud/getbyclient?corporateClientId=${data.corpId}&page=${query.page}&size=${query.size}`;

  try {
    let response = await makeProxyRequest<
      GenericCollateralVerificationResponse<CollateralVerificationEntry[]>
    >(requestURL, event);

    return sendSuccessResponse(response);
  } catch (err) {
    console.log(err);
    return sendErrorResponse(err);
  }
});
