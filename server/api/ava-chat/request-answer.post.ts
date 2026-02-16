import type { ChatResponse } from '~/types/ava-ai-chat-types';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const endpoint = `${config.AI_CHAT_BASE_URL}/api/v1/corporate/chat`;

	try {
		const body: {
			user_id: string;
			corp_id: string;
			message: string;
		} = await readBody(event);

		let response = await makeProxyRequest<ChatResponse>(endpoint, {
			body: { ...body, is_admin: false },
			method: 'POST',
			headers: {
				'x-api-key': config.AI_CHAT_API_KEY,
			},
		});

		// delete unused data
		delete response.metadata;
		delete response.sources;

		// set the origin - temporary
		response.origin = 'assistant';

		return sendSuccessResponse(event, response);
	} catch (err) {
		console.log(err);
		return sendErrorResponse(event, err);
	}
});
