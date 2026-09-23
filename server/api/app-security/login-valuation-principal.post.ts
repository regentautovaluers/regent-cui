export default defineEventHandler(async (event) => {
  const { VALUATION_BASE_URL } = useRuntimeConfig();
  const body: { email: string; password: string } = await readBody(event);
  const config = useRuntimeConfig();
  const cookieConfig = generateCookieConfig(config);

  const requestURL = `${VALUATION_BASE_URL}/api/v1/auth/corporate-account/login`;
  try {
    let response = await makeProxyRequest<GenericResponse<LoginResponse>>(
      requestURL,
      event,
      {
        method: "POST",
        body,
      },
    );

    // get the response data
    let data = response.data;

    // prepare ava credentials
    const avaBasicAuth = generateBase64Token(
      "CORPORATEPORTAL",
      "2xTmjJzs2j53k0zV",
    );
    const avaApiKey = "3cffa8806a28b26f767b9fb77267821e0335f653";
    const valuationJwtToken = data.jwtToken;

    // set multiple cookies
    setCookie(event, "valuation_auth_token", valuationJwtToken!!, cookieConfig);
    setCookie(event, "ava_basic_auth_token", avaBasicAuth, cookieConfig);
    setCookie(event, "ava_api_key", avaApiKey, cookieConfig);

    // delete JWT and refresh token from response data
    delete data.refreshToken;
    delete data.jwtToken;

    // serialize the user object and set it in cookies
    const asCompressedString = arrayBufferToBase64(
      await compress(JSON.stringify(data), "deflate"),
    );
    setCookie(event, "app_principal", asCompressedString, cookieConfig);

    return sendSuccessResponse(data);
  } catch (ex) {
    return sendErrorResponse(ex);
  }
});
