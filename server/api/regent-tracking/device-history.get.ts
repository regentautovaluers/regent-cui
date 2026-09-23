export default defineEventHandler(async (event) => {
  const { REGENT_TRACKING_BASE_URL } = useRuntimeConfig();
  const query: {
    deviceId: string;
    fromDate: string;
    toDate: string;
  } = getQuery(event);
  const cookies = parseCookies(event);

  let requestUrl = `${REGENT_TRACKING_BASE_URL}/api/get_history?lang=en&user_api_hash=${cookies.tracking_auth_token}&device_id=${query.deviceId}&from_date=${query.fromDate}&from_time=00:00:00&to_date=${query.toDate}&to_time=23:59:59&snap_to_road=true`;
  try {
    const deviceHistory = await makeProxyRequest<DeviceHistory>(
      requestUrl,
      event,
    );
    return sendSuccessResponse(deviceHistory);
  } catch (err) {
    return sendErrorResponse(err);
  }
});
