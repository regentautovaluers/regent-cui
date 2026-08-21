export default defineEventHandler(async (event) => {
  const { TRACKING_CERTIFICATES_BASE_URL, TRACKING_CERTIFICATES_API_KEY } =
    useRuntimeConfig();

  let endpoint = `${TRACKING_CERTIFICATES_BASE_URL}/tracking/update_corporate_comment.php?api_key=${TRACKING_CERTIFICATES_API_KEY}`;

  try {
    // extract JSON body
    const body: {
      id: number | string;
      comment: string;
      corp_client: string;
    } = await readBody(event);

    // put fields in the JSON onto api url (query params)
    endpoint =
      endpoint +
      `&tracker_id=${body.id}&corporate_comment=${body.comment}&corporateUser=${body.corp_client}`;

    await makeProxyRequest<any>(endpoint, event, {
      method: "POST",
    });
    return sendSuccessResponse(null);
  } catch (err) {
    console.log(err);
    return sendErrorResponse(err);
  }
});
