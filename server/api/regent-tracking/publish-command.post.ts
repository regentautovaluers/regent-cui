import { type ProxyError } from '~/types/proxy-types';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query = getQuery(event);

	// Set source context for response wrapper
	event.context.source = 'regent-tracking-service';

	const response = await makeProxyRequest<{ status: number; message: string }>(
		`${config.public.REGENT_TRACK_BASE_URL}/api/send_gprs_command?lang=en&user_api_hash=${query.api_hash}&type=${query.type}&message=${query.message}&device_id=${query.device_id}`,
	);

	if (response.status == 0) {
		throw createProxyError(400, 'Failed to send command');
	}

	return response;
});
