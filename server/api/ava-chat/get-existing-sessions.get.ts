import type { ExistingSessions, ExistingSessionSlim } from '~/types/ava-ai-chat-types';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query: { user_id: string } = getQuery(event);

	const endpoint = `${config.AI_CHAT_BASE_URL}/api/v1/corporate/sessions/user/${query.user_id}`;

	try {
		const response = await makeProxyRequest<ExistingSessions>(endpoint, {
			method: 'GET',
			headers: {
				'x-api-key': config.AI_CHAT_API_KEY,
			},
		});

		if (response.sessions.length > 0) {
			const slim: ExistingSessionSlim[] = response.sessions.map((e) => {
				return { session_id: e.session_id, created_at: e.created_at, title: e.title };
			});

			return sendSuccessResponse(event, slim);
		}

		return sendSuccessResponse(event, []);
	} catch (err) {
		console.log(err);
		return sendErrorResponse(event, err);
	}
});
