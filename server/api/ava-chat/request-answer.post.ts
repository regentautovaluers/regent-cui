import type { ChatResponse } from '~/types/ava-ai-chat-types';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const endpoint = `${config.AI_CHAT_BASE_URL}/api/v1/unified-chat/ask`;

	try {
		const body: {
			user_id: string;
			corp_id: string;
			message: string;
			session_id: string;
		} = await readBody(event);

		let response = await makeProxyRequest<ChatResponse>(
			endpoint,
			{
				body: { ...body, is_admin: false },
				method: 'POST',
				headers: {
					'x-api-key': config.AI_CHAT_API_KEY,
					'x-corp-id': body.corp_id,
				},
			},
			event,
		);

		// delete unused data
		delete response.data_type;
		delete response.has_data;
		delete response.sources_used;
		delete response.valuations;
		delete response.analytics;
		delete response.total_found;
		delete response.corp_scoped;
		delete response.chart_config;

		// set the origin - temporary
		response.origin = 'assistant';

		return sendSuccessResponse(event, response);
	} catch (err) {
		console.log(err);
		return sendErrorResponse(event, err);
	}
});
