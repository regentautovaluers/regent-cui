import { TraceabilityReport } from '~/types/regent-tracking/trace-report';
import SecurityUtil from '~/utils/security-util';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query = getQuery(event);

	let endpoint = `${config.REGENT_TRACK_CERTS_BASE_URL}/tracking/traceabilityC.php?api_key=${config.TRACKING_CERTS_API_KEY}`;
	SecurityUtil.base64Decode(query.groupIds as string)
		.split(',')
		.forEach(e => endpoint = endpoint + `&device_id[]=${e}`);

	console.log('endpoint: ', endpoint);

	try {
		const entries = await makeProxyRequest<TraceabilityReport>(endpoint);

		// delete sensitive entries
		delete entries.pagination.prev_page_url;
		delete entries.pagination.next_page_url;

		return sendSuccessResponse(event, entries);
	} catch (err) {
		return sendErrorResponse(event, err);
	}
});
