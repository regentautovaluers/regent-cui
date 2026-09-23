export default defineEventHandler(async (event) => {
  const {
    REGENT_TRACKING_CERTIFICATES_BASE_URL,
    REGENT_TRACKING_CERTIFICATES_API_KEY,
  } = useRuntimeConfig();
  const cookies = parseCookies(event);
  const data: LoginResponse = await inflatePrincipal(cookies);
  let endpoint = `${REGENT_TRACKING_CERTIFICATES_BASE_URL}/tracking/update_corporate_comment.php?api_key=${REGENT_TRACKING_CERTIFICATES_API_KEY}`;

  try {
    // extract JSON body
    const body: {
      id: number | string;
      comment: string;
    } = await readBody(event);

    // put fields in the JSON onto api url (query params)
    endpoint =
      endpoint +
      `&tracker_id=${body.id}&corporate_comment=${body.comment}&corporateUser=${data.corpName}`;

      console.log(endpoint)
    await makeProxyRequest<null>(endpoint, event, {
      method: "POST",
    });
    return sendSuccessResponse(null);
  } catch (err) {
    console.log(err);
    return sendErrorResponse(err);
  }
});
