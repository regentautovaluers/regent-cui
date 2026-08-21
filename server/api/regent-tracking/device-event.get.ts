export default defineEventHandler(async (event) => {
  const { REGENT_TRACKING_BASE_URL } = useRuntimeConfig();
  const query = getQuery(event);

  let requestUrl = `${REGENT_TRACKING_BASE_URL}/api/get_events?lang=en&user_api_hash=${query.api_hash}&device_id=${query.device_id}&date_from=${query.date_from}&date_to=${query.date_to}`;

  try {
    const discoveredEvents = await makeProxyRequest<{
      status: string;
      items: { data: DeviceEvent[] };
    }>(requestUrl, event);
    // Simple transformation
    return sendSuccessResponse(discoveredEvents.items.data as DeviceEvent[]);
  } catch (err) {
    return sendErrorResponse(err);
  }
});
