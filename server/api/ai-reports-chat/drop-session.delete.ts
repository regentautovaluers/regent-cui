export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query = getQuery(event);

	let requestUrl = `${config.AI_CHAT_BASE_URL}/api/v1/chat/${query.session_id}/cleanup?force=false`;
	try {
		await makeProxyRequest<any>(
			requestUrl,
			{
				method: 'DELETE',
			},
			event,
		);
		return sendSuccessResponse(event, null);
	} catch (err) {
		return sendErrorResponse(event, err);
	}
});
