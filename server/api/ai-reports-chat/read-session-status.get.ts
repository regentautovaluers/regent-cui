import type { GetChatSessionStatusStruct } from '~/types/ai-reports-chat-types';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query = getQuery(event);

	const endpoint = `${config.AI_CHAT_BASE_URL}/api/v1/sessions/${query.session_id}`;
	try {
		const response = await makeProxyRequest<GetChatSessionStatusStruct>(
			endpoint,
			undefined,
			event,
		);
		if (response.session_id !== query.session_id) {
			throw new Error('Session IDs No Match !');
		}
		return sendSuccessResponse(event, response);
	} catch (err) {
		console.log(err);
		return sendErrorResponse(event, err);
	}
});
