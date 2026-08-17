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
		await makeProxyRequest<GenericResponse<null>>(
			requestURL,
			event,
			{
				method: 'PUT',
				body,
			},
		);
		return sendSuccessResponse(null);
	} catch (ex) {
		return sendErrorResponse(ex);
	}
});
