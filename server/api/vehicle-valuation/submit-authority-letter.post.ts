import type { GenericResponse } from '~/types/corporate-valuations/generic-response-type';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const cookies = parseCookies(event);
	// 1. Parse the incoming multipart data into an array of parts
	const multipartData = await readMultipartFormData(event);

	console.log(multipartData);

	const endpoint = `${config.VALUATION_BASE_URL}/api/v1/authority-letter/corp/create-authority-letter`;
	try {
		await makeProxyRequest<GenericResponse<any>>(endpoint, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${cookies.valuation_auth_token}`,
			},
			body: multipartData,
		});

		return sendSuccessResponse(event, null);
	} catch (err) {
		console.log(err);
		return sendErrorResponse(event, err);
	}
});
