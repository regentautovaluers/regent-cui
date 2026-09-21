export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const config = useRuntimeConfig();
  const query: {
    isVehicleTampered?: boolean;
    regNo?: string;
    completed?: boolean;
    startDate?: string;
    endDate?: string;
    page: number;
    size: number;
  } = getQuery(event);
  const data: LoginResponse = await inflatePrincipal(cookies);

  let requestURL = `${config.VALUATION_BASE_URL}/api/v1/valuation/booking/get-all?&corpId=${data.corpId}`;

  if (query.page) {
    requestURL = requestURL + `&page=${query.page}`;
  }

  if (query.size) {
    requestURL = requestURL + `&size=${query.size}`;
  }

  if (query.regNo) {
    requestURL = requestURL + `&regNo=${query.regNo}`;
  }

  // rendering completed or pending requests
  if (query.completed) {
    requestURL = requestURL + `&completed=${query.completed}`;
  }

  if (query.startDate) {
    requestURL = requestURL + `&startDate=${query.startDate}`;
  }

  if (query.endDate) {
    requestURL = requestURL + `&endDate=${query.endDate}`;
  }

  if (query.isVehicleTampered) {
    requestURL = requestURL + `&isVehicleTampered=${query.isVehicleTampered}`;
  }

  if (!data.userRoles.includes("ROLE_CORP_ADMIN")) {
    if (data.branchId) {
      requestURL = requestURL + `&corpBranchId=${data.branchId}`;
    }
  }

  try {
    let response = await makeProxyRequest<GenericResponse<ValuationBooking[]>>(
      requestURL,
      event,
    );

    if (response.data) {
      response.data.forEach((vb) => cleanValuations(vb));
    }

    return sendSuccessResponse(response);
  } catch (err) {
    return sendErrorResponse(err);
  }
});
