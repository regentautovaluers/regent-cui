import { type Response, type CorporateClient } from '~/types/utils/corporate-clients';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query = getQuery(event);

	let endpoint = `${config.public.VALUATION_BASE_URL}/api/v1/corporate-organization/get-all?isBroker=${query.is_broker}`;

	try {
		const response = await makeProxyRequest<Response>(endpoint, {
			headers: {
				Authorization: `Bearer ${query.api_key}`,
			},
		});
		return sendSuccessResponse(event, response.data as CorporateClient[]);
	} catch (err) {
		return sendErrorResponse(event, err);
	}
});
