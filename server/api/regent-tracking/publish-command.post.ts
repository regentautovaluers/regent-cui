export default defineEventHandler(async (event) => {
  const { REGENT_TRACKING_BASE_URL } = useRuntimeConfig();
  const query = getQuery(event);

  try {
    const response = await makeProxyRequest<SendCommandResponse>(
      `${REGENT_TRACKING_BASE_URL}/api/send_gprs_command?lang=en&user_api_hash=${query.api_hash}&type=${query.type}&message=${query.message}&device_id=${query.device_id}`,

      event,
    );
    return response;
  } catch (err) {
    return sendErrorResponse(err);
  }
});
