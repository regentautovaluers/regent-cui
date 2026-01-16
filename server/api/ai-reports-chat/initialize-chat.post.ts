import type { InitializeChatReponseStruct } from '~/types/ai-reports-chat-types';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();

	let endpoint = `$${config.AI_CHAT_BASE_URL}/api/v1/chat/initiate`;
	try {
		const body: { report_url: string; booking_id: string; report_type: string } =
			await readBody(event);
		const response = await makeProxyRequest<InitializeChatReponseStruct>(endpoint, {
			body,
			method: 'POST',
		});

		// minor cleanup
		delete response.message;
		delete response.estimated_processing_time;
		delete response.existing_chat_messages;

		return sendSuccessResponse(event, response);
	} catch (err) {
		console.log(err);
		return sendErrorResponse(event, err);
	}
});
