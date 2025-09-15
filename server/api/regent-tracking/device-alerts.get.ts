import { makeProxyRequest } from '~/server/utils/proxy-utils';
import { type DeviceAlerts } from '~/types/regent-tracking/device-alerts';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query = getQuery(event);

	// Set source context for response wrapper
	event.context.source = 'regent-tracking-service';
	let requestUrl = `${config.public.REGENT_TRACK_BASE_URL}/api/get_alerts?lang=en&user_api_hash=${query.api_hash}&device_id=${query.device_id}`;

	console.log(requestUrl);

	const discoveredAlerts =
		await makeProxyRequest<{ status: string; items: { alerts: DeviceAlerts[] } }[]>(requestUrl);

	// Simple transformation
	return discoveredAlerts.items.alerts as DeviceAlerts[];
});
