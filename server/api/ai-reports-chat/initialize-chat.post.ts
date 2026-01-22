import type { InitializeChatReponseStruct } from '~/types/ai-reports-chat-types';
import type { ChatHistory } from '~/types/ai-reports-chat-types';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();

	const endpoint = `${config.AI_CHAT_BASE_URL}/api/v1/chat/initiate`;
	try {
		const body: {
			report_url: string;
			booking_id: string;
			report_type: string;
			user_id: string;
		} = await readBody(event);
		const response = await makeProxyRequest<InitializeChatReponseStruct>(endpoint, {
			body,
			method: 'POST',
			headers: {
				'x-api-key': config.AI_CHAT_API_KEY,
			},
		});

		// attempt to get any history if possible
		const getHistoryEndpoint = `/api/ai-reports-chat/get-chat-history?session_id=${response.session_id}`;
		const availableHistories = await makeProxyRequest<ChatHistory>(getHistoryEndpoint, {
			headers: {
				'x-api-key': config.AI_CHAT_API_KEY,
			},
		});

		if (availableHistories.history.length > 0) {
			response.history = availableHistories.history;
		} else {
			response.history = [];
		}
		return sendSuccessResponse(event, response);
	} catch (err) {
		console.log(err);
		return sendErrorResponse(event, err);
	}
});
