export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query: {
    status: AccidentReportStatus;
    q: string;
    page: number;
    size: number;
  } = getQuery(event);

  let requestURL = `${config.ACCIDENT_ASSESSMENT_BASE_URL}/api/assessments?page=${query.page}&size=${query.size}`;

  try {
    const response = await makeProxyRequest(requestURL, event);
    return sendSuccessResponse(response);
  } catch (ex) {
    console.log(ex);
    return sendErrorResponse(event);
  }
});
