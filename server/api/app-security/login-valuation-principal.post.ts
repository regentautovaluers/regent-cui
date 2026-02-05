import type { GenericResponse } from '~/types/corporate-valuations/generic-response-type';
import type { LoginResponse } from '~/types/app-security/app-principal-types';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const body: { email: string; password: string } = await readBody(event);

	const requestURL = `${config.VALUATION_BASE_URL}/api/v1/auth/corporate-account/login`;
	try {
		let response = await makeProxyRequest<GenericResponse<LoginResponse>>(requestURL, {
			method: 'POST',
			body: {
				email: body.email,
				password: body.password,
			},
		});

		return sendSuccessResponse(event, response.data);
	} catch (ex) {
		return sendErrorResponse(event, ex);
	}
});
