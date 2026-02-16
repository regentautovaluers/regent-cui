import type { SessionHistory } from '~/types/ava-ai-chat-types';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query: { session_id: string } = getQuery(event);

	const endpoint = `${config.AI_CHAT_BASE_URL}/api/v1/corporate/sessions/${query.session_id}/history`;

	try {
		let response = await makeProxyRequest<SessionHistory>(endpoint, {
			method: 'GET',
			headers: {
				'x-api-key': config.AI_CHAT_API_KEY,
			},
		});

		// delete unused data
		delete response.pagination;
		delete response.user_id;

		return sendSuccessResponse(event, response);
	} catch (err) {
		console.log(err);
		return sendErrorResponse(event, err);
	}
});
