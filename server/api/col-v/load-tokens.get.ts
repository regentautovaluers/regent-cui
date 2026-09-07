export default defineEventHandler(async (event) => {
  const { COLV_BASE_URL } = useRuntimeConfig();
  const cookies = parseCookies(event);
  const data: LoginResponse = await inflatePrincipal(cookies);

  const requestURL = `${COLV_BASE_URL}/api/v1/client-info/${data.corpId}`;

  try {
    let response = await makeProxyRequest<
      GenericCollateralVerificationResponse<CollateralVerificationTokens>
    >(requestURL, event);

    return sendSuccessResponse(response);
  } catch (err) {
    console.log(err);
    return sendErrorResponse(err);
  }
});
