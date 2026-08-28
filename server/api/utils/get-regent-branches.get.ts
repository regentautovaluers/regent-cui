export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);

  const { VALUATION_BASE_URL } = useRuntimeConfig();
  let endpoint = `${VALUATION_BASE_URL}/api/v1/regent-branch/get-all`;

  try {
    let response = await makeProxyRequest<GenericResponse<RegentBranch[]>>(
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
