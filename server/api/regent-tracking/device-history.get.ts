export default defineEventHandler(async (event) => {
  const { REGENT_TRACKING_BASE_URL } = useRuntimeConfig();
  const query = getQuery(event);

  let requestUrl = `${REGENT_TRACKING_BASE_URL}/api/get_history?lang=en&user_api_hash=${query.api_hash}&device_id=${query.device_id}&from_date=${query.from_date}&from_time=${query.from_time}&to_date=${query.to_date}&to_time=${query.to_time}&snap_to_road=true`;
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
