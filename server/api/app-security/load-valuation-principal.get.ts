import type { GenericResponse } from '~/types/corporate-valuations/generic-response-type';
import type { ValuationPrinicpal } from '~/types/app-security/app-principal-types';

export default defineEventHandler(async (event) => {
	const cookies = parseCookies(event);
	const config = useRuntimeConfig();

	const requestURL = `${config.VALUATION_BASE_URL}/api/v1/auth/corporate-account/get-principal-credentials`;
	try {
		let response = await makeProxyRequest<GenericResponse<ValuationPrinicpal>>(requestURL, {
			headers: {
				Authorization: `Bearer ${cookies.valuation_auth_token}`,
			},
		});

		return sendSuccessResponse(event, response.data);
	} catch (ex) {
		return sendErrorResponse(event, ex);
	}
});
