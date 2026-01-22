import type { ChatMessage } from '~/types/ai-reports-chat-types';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();

	let requestUrl = `${config.AI_CHAT_BASE_URL}/api/v1/chat/ask`;
	try {
		const body: { session_id: string; question: string } = await readBody(event);
		const chatResponse = await makeProxyRequest<ChatMessage>(requestUrl, {
			body: {
				include_sources: false,
				include_history: false,
				session_id: body.session_id,
				question: body.question,
			},
			method: 'POST',
			headers: {
				'x-api-key': config.AI_CHAT_API_KEY,
			},
		});
		return sendSuccessResponse(event, chatResponse);
	} catch (err) {
		return sendErrorResponse(event, err);
	}
});
