import { makeProxyRequest } from '~/server/utils/proxy-utils';
import { type DeviceEvent } from '~/types/regent-tracking/device-event';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query = getQuery(event);

	let requestUrl = `${config.REGENT_TRACK_BASE_URL}/api/get_events?lang=en&user_api_hash=${query.api_hash}&device_id=${query.device_id}&date_from=${query.date_from}&date_to=${query.date_to}`;

	try {
		const discoveredEvents = await makeProxyRequest<{
			status: string;
			items: { data: DeviceEvent[] };
		}>(requestUrl);
		// Simple transformation
		return sendSuccessResponse(event, discoveredEvents.items.data as DeviceEvent[]);
	} catch (err) {
		return sendErrorResponse(event, err);
	}
});
