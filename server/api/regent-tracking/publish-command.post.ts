import { type SendCommandResponse } from '~/types/regent-tracking/device-commands';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query = getQuery(event);

	try {
		const response = await makeProxyRequest<SendCommandResponse>(
			`${config.REGENT_TRACK_BASE_URL}/api/send_gprs_command?lang=en&user_api_hash=${query.api_hash}&type=${query.type}&message=${query.message}&device_id=${query.device_id}`,
			undefined,
			event,
		);
		return response;
	} catch (err) {
		return sendErrorResponse(event, err);
	}
});
