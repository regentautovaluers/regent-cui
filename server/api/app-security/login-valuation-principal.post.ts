import type { GenericResponse } from '~/types/corporate-valuations/generic-response-type';
import type { LoginResponse } from '~/types/app-security/app-principal-types';
import { generateBase64Token } from '~/shared/security-functions';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const body: { email: string; password: string } = await readBody(event);
	const AUTHS_COOKIE_CONFIG = {
		maxAge: 60 * 60 * 24 * 3, // 3 days
		path: '/',
		httpOnly: false, // Prevents client-side JS access (security) !!(TODO: Clean this massive security flaw)
		secure: true, // Only send over HTTPS
		sameSite: 'lax',
	};

	const requestURL = `${config.VALUATION_BASE_URL}/api/v1/auth/corporate-account/login`;
	try {
		let response = await makeProxyRequest<GenericResponse<LoginResponse>>(requestURL, {
			method: 'POST',
			body: {
				email: body.email,
				password: body.password,
			},
		});

		// get the response data
		let data = response.data;

		// prepare ava credentials
		const avaBasicAuth = generateBase64Token('CORPORATEPORTAL', '2xTmjJzs2j53k0zV');
		const avaApiKey = '3cffa8806a28b26f767b9fb77267821e0335f653';
		const valuationJwtToken = data.jwtToken;

		// set multiple cookies
		setCookie(event, 'valuation_auth_token', valuationJwtToken!!, AUTHS_COOKIE_CONFIG);
		setCookie(event, 'ava_basic_auth_token', avaBasicAuth, AUTHS_COOKIE_CONFIG);
		setCookie(event, 'ava_api_key', avaApiKey, AUTHS_COOKIE_CONFIG);

		// delete JWT and refresh token from response data
		delete data.refreshToken;
		delete data.jwtToken;

		return sendSuccessResponse(event, data);
	} catch (ex) {
		return sendErrorResponse(event, ex);
	}
});
