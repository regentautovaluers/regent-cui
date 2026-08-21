export default defineEventHandler(async (event) => {
  const { REGENT_TRACKING_BASE_URL } = useRuntimeConfig();
  const body: { email: string; password: string } = await readBody(event);
  const params = new URLSearchParams(body);

  const endpoint = `${REGENT_TRACKING_BASE_URL}/api/login?${params.toString()}`;
  try {
    const trackingLoginResponse =
      await makeProxyRequest<RegentTrackingLoginResponse>(endpoint, event, {
        method: "POST",
      });
    // remove the unnecesary fields
    delete trackingLoginResponse.permissions;

    return sendSuccessResponse(trackingLoginResponse);
  } catch (err) {
    console.log(err);
    return sendErrorResponse(err);
  }
});
