import type { CreateMembershipFleets } from '~/types/ava-roadside-assistance/ava-fleets';

export default defineEventHandler(async (event) => {
	const { AVA_BASE_URL } = useRuntimeConfig();

	const body: CreateMembershipFleets = await readBody(event);
	const endpoint = `${AVA_BASE_URL}/api/v1/fleets`;

	try {
		await makeProxyRequest(endpoint, {
			method: 'POST',
			body,
		});

		// return a success response
		return sendSuccessResponse(event, null);
	} catch (err) {
		return sendErrorResponse(event, err);
	}
});
