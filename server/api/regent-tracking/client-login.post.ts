import { type RegentTrackingLoginResponse } from '~/types/regent-tracking/client-auth';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const body: { email: string; password: string } = await readBody(event);
	const params = new URLSearchParams(body);

	const endpoint = `${config.REGENT_TRACK_BASE_URL}/api/login?${params.toString()}`;
	try {
		const discoveredAlerts = await makeProxyRequest<RegentTrackingLoginResponse>(endpoint);
		// remove the unnecesary fields
		delete discoveredAlerts.permissions;

		return sendSuccessResponse(event, discoveredAlerts);
	} catch (err) {
		console.log(err);
		return sendErrorResponse(event, err);
	}
});
