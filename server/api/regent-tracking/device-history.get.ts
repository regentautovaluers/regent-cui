import { type DeviceHistory } from '~/types/regent-tracking/device-history';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query = getQuery(event);

	let requestUrl = `${config.REGENT_TRACK_BASE_URL}/api/get_history?lang=en&user_api_hash=${query.api_hash}&device_id=${query.device_id}&from_date=${query.from_date}&from_time=${query.from_time}&to_date=${query.to_date}&to_time=${query.to_time}&snap_to_road=true`;

	try {
		const deviceHistory = await makeProxyRequest<DeviceHistory>(requestUrl);
		return sendSuccessResponse(event, deviceHistory);
	} catch (err) {
		return sendErrorResponse(event, err);
	}
});
