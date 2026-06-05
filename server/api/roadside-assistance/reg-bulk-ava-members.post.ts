import type { BulkMemberRegistrationRequest } from '~/types/ava-roadside-assistance/member-registration';

export default defineEventHandler(async (event) => {
	const { AVA_BASE_URL } = useRuntimeConfig();
	const endpoint = `${AVA_BASE_URL}/api/v1/memberships/bulk`;

	try {
		const body: BulkMemberRegistrationRequest[] = await readBody(event);
		await makeProxyRequest<unknown>(
			endpoint,
			{
				method: 'POST',
				body,
			},
			event,
		);

		// return a success response
		return sendSuccessResponse(event, null);
	} catch (err) {
		return sendErrorResponse(event, err);
	}
});
