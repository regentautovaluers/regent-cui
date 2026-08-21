export default defineEventHandler(async (event) => {
  const { TRACKING_CERTIFICATES_BASE_URL, TRACKING_CERTIFICATES_API_KEY } =
    useRuntimeConfig();
  const query = getQuery(event);

  let endpoint = `${TRACKING_CERTIFICATES_BASE_URL}/tracking/traceabilityC.php?api_key=${TRACKING_CERTIFICATES_API_KEY}&tracker_id=${query.tracker_id}&page=1&limit=${query.limit}`;

  try {
    const entries = await makeProxyRequest<TraceabilityReport>(endpoint, event);

    // delete sensitive entries
    delete entries.pagination.prev_page_url;
    delete entries.pagination.next_page_url;

    return sendSuccessResponse(entries);
  } catch (err) {
    return sendErrorResponse(err);
  }
});
