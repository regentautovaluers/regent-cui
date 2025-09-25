import { Response } from '~/types/regent-tracking/trace-report';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query = getQuery(event);

	const endpoint = `${config.TRACKING_CERTS_BASE_URL}/tracking/traceabilityB.php?api_key=${config.TRACKING_CERTS_API_KEY}&limit=${query.limit}&page=${query.page}`;

	try {
		const entries = await makeProxyRequest<Response>(endpoint);

		return sendSuccessResponse(event, entries);
	} catch (err) {
		return sendErrorResponse(event, err);
	}
});
