export default defineEventHandler(async (event) => {
  const { VALUATION_BASE_URL } = useRuntimeConfig();

  const query: { corpId: string } = getQuery(event);
  let endpoint = `${VALUATION_BASE_URL}/api/v1/corporate-branch/get-all?corpId=${query.corpId}`;

  try {
    let response = await makeProxyRequest<GenericResponse<CorporateBranch[]>>(
      endpoint,
      event,
    );

    if (response.data) {
      response.data.forEach((rb) => cleanRegentBranches(rb));
    }

    return sendSuccessResponse(response);
  } catch (ex) {
    console.log(ex);
    return sendErrorResponse(ex);
  }
});
