import { type RegentTrackingLoginResponse } from '~/types/regent-tracking/client-auth';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query = getQuery(event);

	const endpoint = `${config.REGENT_TRACK_BASE_URL}/api/login?email=${query.email}&password=${query.password}`;
	try {
		const discoveredAlerts = await makeProxyRequest<RegentTrackingLoginResponse>(endpoint);
		// remove the unnecesary fields
		delete discoveredAlerts.permissions;

		return sendSuccessResponse(event, discoveredAlerts);
	} catch (err) {
		return sendErrorResponse(event, err);
	}
});
