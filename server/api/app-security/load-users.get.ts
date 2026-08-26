export default defineEventHandler(async (event) => {
  const { VALUATION_BASE_URL } = useRuntimeConfig();
  const query: {
    corpId: string;
    page: number;
    size: number;
  } = getQuery(event);

  console.log("Query:"  + JSON.stringify(query, null, 2))

  let endpoint = `${VALUATION_BASE_URL}/api/v1/auth/corporate-account/get-accounts?`;

  endpoint = endpoint + `corporateId=${query.corpId}`;

  if (query.page) {
    endpoint = endpoint + `&page=${query.page}`;
  }

  if (query.size) {
    endpoint = endpoint + `&size=${query.size}`;
  }

  try {
    let response = await makeProxyRequest<GenericResponse<ValuationPrincipal[]>>(
      endpoint,
      event,
    );

    return sendSuccessResponse(response);
  } catch (ex) {
    console.log(ex)
    return sendErrorResponse(ex);
  }
});
