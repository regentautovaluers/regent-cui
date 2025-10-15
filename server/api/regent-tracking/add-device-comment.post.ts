export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();

	let endpoint = `${config.REGENT_TRACK_CERTS_BASE_URL}/tracking/update_corporate_comment.php?api_key=${config.TRACKING_CERTS_API_KEY}`;

	try {
		// extract JSON body
		const { id, corporate_comment, corporate_user } = await readBody(event);

		// put fields in the JSON onto api url (query params)
		endpoint =
			endpoint +
			`&tracker_id=${id}&corporate_comment=${corporate_comment}&corporateUser=${corporate_user}`;

		await makeProxyRequest<any>(endpoint, {
			method: 'POST',
		});

		return sendSuccessResponse(event, null);
	} catch (err) {
		return sendErrorResponse(event, err);
	}
});
