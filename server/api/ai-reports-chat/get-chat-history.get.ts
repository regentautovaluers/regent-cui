import type { ChatHistory } from '~/types/ai-reports-chat-types';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query = getQuery(event);

	const endpoint = `${config.AI_CHAT_BASE_URL}/api/v1/chat/${query.session_id}/history?limit=20`;
	try {
		// attach session id
		const chatHistory = await makeProxyRequest<ChatHistory>(endpoint, {
			headers: {
				'x-api-key': config.AI_CHAT_API_KEY,
			},
		});

		return sendSuccessResponse(event, chatHistory);
	} catch (err) {
		return sendErrorResponse(event, err);
	}
});
