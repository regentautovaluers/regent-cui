import type { AvaMembershipFleets } from '~/types/ava-roadside-assistance/ava-fleets';

export default defineEventHandler(async (event) => {
	const { AVA_BASE_URL } = useRuntimeConfig();
	const corp_id = getRouterParam(event, 'corp_id');
	const endpoint = `${AVA_BASE_URL}/api/v1/fleets/corporate/${corp_id}`;
	try {
		const response = await makeProxyRequest<AvaMembershipFleets[]>(endpoint);

		// delete unused keys
		response.forEach((e) => {
			delete e.createdAt;
			delete e.memberCount;
			delete e.corporate;
			delete e.contact_full_name;
			delete e.contact_email;
			delete e.contact_phone_number;
		});

		return sendSuccessResponse(event, response);
	} catch (err) {
		return sendErrorResponse(event, err);
	}
});
