import { makeProxyRequest } from '~/server/utils/proxy-utils';
import { type DeviceAlerts } from '~/types/regent-tracking/device-alerts';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query = getQuery(event);

	let requestUrl = `${config.public.REGENT_TRACK_BASE_URL}/api/get_alerts?lang=en&user_api_hash=${query.api_hash}&device_id=${query.device_id}`;

	try {
		const discoveredAlerts =
			await makeProxyRequest<{ status: string; items: { alerts: DeviceAlerts[] } }[]>(
				requestUrl,
			);
		// Simple transformation
		return sendSuccessResponse(event, discoveredAlerts.items.alerts as DeviceAlerts[]);
	} catch (err) {
		return sendErrorResponse(event, err);
	}
});
