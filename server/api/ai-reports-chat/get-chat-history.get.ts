import type { ChatHistory } from '~/types/ai-reports-chat-types';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query = getQuery(event);

	const endpoint = `${config.AI_CHAT_BASE_URL}/api/v1/chat/${query.session_id}/history`;
	try {
		// attach session id
		const chatHistory = await makeProxyRequest<ChatHistory>(endpoint, undefined, event);

		return sendSuccessResponse(event, chatHistory);
	} catch (err) {
		return sendErrorResponse(event, err);
	}
});
