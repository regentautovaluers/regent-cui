export default defineEventHandler(async (event) => {
  const { AVA_BASE_URL } = useRuntimeConfig();
  const cookies = parseCookies(event);
  const data: LoginResponse = await inflatePrincipal(cookies);
  const query: {
    page: number;
    size: number;
    serviceType: string;
    serviceStatus: string;
    registration: string | null;
    startDate: string;
    endDate: string;
  } = getQuery(event);
  let requestURL = `${AVA_BASE_URL}/api/v1/corp/reports/services/corporate/${data.corpId}?page=${query.page}&size=${query.size}sortBy=date_created&sortOrder=DESC`;

  if (query.registration) {
    requestURL += `&regNo=${query.registration}`;
  }

  if (query.startDate) {
    requestURL += `&dateFrom=${query.startDate}`;
  }

  if (query.endDate) {
    requestURL += `&dateTo=${query.endDate}`;
  }

  if (query.serviceStatus) {
    requestURL += `&serviceStatus=${query.serviceStatus}`;
  }

  if (query.serviceType) {
    requestURL += `&serviceType=${query.serviceType}`;
  }

  try {
    let response = await makeProxyRequest<GetIncidentsWrapper>(
      requestURL,
      event,
    );

    return sendSuccessResponse(response);
  } catch (err) {
    console.log(err);
    return sendErrorResponse(err);
  }
});
