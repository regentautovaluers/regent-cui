export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query = getQuery(event);

	let endpoint = `${config.public.VALUATION_BASE_URL}/api/v1/corporate-organization/get-all?isBroker=${query.is_broker}`;

	try {
		const response = await makeProxyRequest<GenericResponse<CorporateClient[]>>(
			endpoint
		);
		return sendSuccessResponse(response.data);
	} catch (err) {
		return sendErrorResponse(err);
	}
});
