export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query = getQuery(event);

	let endpoint = `${config.REGENT_TRACK_BASE_URL}/tracking/update_corporate_comment.php?api_key=${config.TRACKING_CERTS_API_KEY}`;

	try {
		// extract JSON body
		const body: {
			id: number | string;
			corporate_comment: string;
		} = await readBody(event);

		// put fields in the JSON onto api url (query params)
		endpoint = endpoint + `&id=${body.id}&corporate_comment=${body.corporate_comment}`;

		await makeProxyRequest<any>(endpoint, {
			method: 'POST',
		});

		return sendSuccessResponse(event, null);
	} catch (err) {
		return sendErrorResponse(event, err);
	}
});
