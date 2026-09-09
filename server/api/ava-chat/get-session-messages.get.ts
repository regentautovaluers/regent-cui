import type { SessionHistory } from '~/types/ava-ai-chat-types';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query: { session_id: string } = getQuery(event);

	const endpoint = `${config.AI_CHAT_BASE_URL}/api/v1/unified-chat/session/${query.session_id}`;

	try {
		let response = await makeProxyRequest<SessionHistory>(
			endpoint,
			{
				method: 'GET',
			},
			event,
		);

		return sendSuccessResponse(event, response);
	} catch (err) {
		console.log(err);
		return sendErrorResponse(event, err);
	}
});
