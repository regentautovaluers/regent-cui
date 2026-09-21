export default defineEventHandler(async (event) => {
  const { VALUATION_BASE_URL } = useRuntimeConfig();
  const body: { email: string; password: string } = await readBody(event);
  const config = useRuntimeConfig();
  const AUTHS_COOKIE_CONFIG = {
    maxAge: 60 * 60 * 24 * 3,
    path: "/",
    httpOnly: config.public.RUN_ENV === "dev" ? false : true,
    secure: config.public.RUN_ENV === "dev" ? false : true,
    sameSite: config.public.RUN_ENV === "dev" ? "lax" : "none",
    domain: config.public.RUN_ENV === "dev" ? undefined : config.RUN_URL,
  };

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
    setCookie(
      event,
      "valuation_auth_token",
      valuationJwtToken!!,
      AUTHS_COOKIE_CONFIG,
    );
    setCookie(event, "ava_basic_auth_token", avaBasicAuth, AUTHS_COOKIE_CONFIG);
    setCookie(event, "ava_api_key", avaApiKey, AUTHS_COOKIE_CONFIG);

    // delete JWT and refresh token from response data
    delete data.refreshToken;
    delete data.jwtToken;

    // serialize the user object and set it in cookies
    const asCompressedString = arrayBufferToBase64(
      await compress(JSON.stringify(data), "deflate"),
    );
    setCookie(event, "app_principal", asCompressedString, AUTHS_COOKIE_CONFIG);

    return sendSuccessResponse(data);
  } catch (ex) {
    return sendErrorResponse(ex);
  }
});
