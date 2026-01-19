import type { InitializeChatReponseStruct } from '~/types/ai-reports-chat-types';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();

	const endpoint = `${config.AI_CHAT_BASE_URL}/api/v1/chat/initiate`;
	try {
		const body: { report_url: string; booking_id: string; report_type: string } =
			await readBody(event);
		console.log(body);
		const response = await makeProxyRequest<InitializeChatReponseStruct>(endpoint, {
			body,
			method: 'POST',
		});

		return sendSuccessResponse(event, response);
	} catch (err) {
		console.log(err);
		return sendErrorResponse(event, err);
	}
});
