export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const config = useRuntimeConfig();

  const data: LoginResponse = await inflatePrincipal(cookies);
  const query: {
    page: number;
    size: number;
    bookingId?: string;
    startDate?: string;
    endDate?: string;
    searchTerm?: string;
  } = getQuery(event);

  let requestURL = `${config.LEGACY_VALUATION_BASE_URL}/api/v1/valuations/search?corpId=${data.corpId}&page=${query.page}&size=${query.size}`;

  if (query.bookingId) {
    requestURL += `&bookingId=${query.bookingId}`;
  }

  if (query.startDate) {
    requestURL += `&startDate=${query.startDate}`;
  }

  if (query.endDate) {
    requestURL += `&endDate=${query.endDate}`;
  }

  if (query.searchTerm) {
    requestURL += `&searchTerm=${query.searchTerm}`;
  }

  try {
    const response = await makeProxyRequest<GenericResponse<LegacyValuation[]>>(
      requestURL,
      event,
    );
    return sendSuccessResponse(response);
  } catch (err) {
    return sendErrorResponse(err);
  }
});
