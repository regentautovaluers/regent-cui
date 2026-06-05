export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();

	let endpoint = `${config.REGENT_TRACK_CERTS_BASE_URL}/tracking/update_corporate_comment.php?api_key=${config.TRACKING_CERTS_API_KEY}`;

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

		await makeProxyRequest<any>(
			endpoint,
			{
				method: 'POST',
			},
			event,
		);
		return sendSuccessResponse(event, null);
	} catch (err) {
		console.log(err);
		return sendErrorResponse(event, err);
	}
});
