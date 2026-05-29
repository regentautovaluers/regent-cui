import type { GenericResponse } from '~/types/corporate-valuations/generic-response-type';

export default defineEventHandler(async (event) => {
	const { VALUATION_BASE_URL } = useRuntimeConfig();
	const cookies = parseCookies(event);
	const body: {
		userId: string;
		username: string;
		email: string;
		password: string;
		phoneNumber: string;
		roleInOrganization: string;
		corpBranchId: string;
		isAccountEnabled: boolean;
		userRoles: string[] | null;
	} = await readBody(event);
	const requestURL = `${VALUATION_BASE_URL}/api/v1/auth/corporate-account/update-account-details`;

	try {
		await makeProxyRequest<GenericResponse<null>>(requestURL, {
			method: 'PUT',
			body,
			headers: {
				Authorization: `Bearer ${cookies.valuation_auth_token}`,
			},
		});
		return sendSuccessResponse(event, null);
	} catch (ex) {
		console.log(ex);
		return sendErrorResponse(event, ex);
	}
});
