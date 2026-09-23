export default defineEventHandler(async (event) => {
  const { REGENT_TRACKING_BASE_URL } = useRuntimeConfig();
  const body: { email: string; password: string } = await readBody(event);
  const params = new URLSearchParams(body);
  const config = useRuntimeConfig();
  const cookieConfig = generateCookieConfig(config);

  const endpoint = `${REGENT_TRACKING_BASE_URL}/api/login?${params.toString()}`;
  try {
    const trackingLoginResponse =
      await makeProxyRequest<RegentTrackingLoginResponse>(endpoint, event, {
        method: "POST",
      });
    // remove the unnecesary fields
    delete trackingLoginResponse.permissions;

    setCookie(
      event,
      "tracking_auth_token",
      trackingLoginResponse.user_api_hash,
      cookieConfig,
    );
    return sendSuccessResponse(null);
  } catch (err) {
    console.log(err);
    return sendErrorResponse(err);
  }
});
