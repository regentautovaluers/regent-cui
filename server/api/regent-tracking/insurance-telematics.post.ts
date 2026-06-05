import { deriveDriverBehaviour } from '~/server/utils/dbehavior-analysis-computation';
import { type DeviceHistory } from '~/types/regent-tracking/device-history';
import { StandardSuccessResponse } from '~/types/proxy-types';
import { DriverRiskScore } from '~/types/insurance-telematics/driver-behaviour';
import { deriveAccidentAnalysis } from '~/server/utils/accident-analysis-computation';

export default defineEventHandler(async (event) => {
	const body: { vehicleIds: number[]; fromDate: string; toDate: string } = await readBody(event);
	const cookies = parseCookies(event);

	// Set the headers for SSE
	setResponseHeader(event, 'Content-Type', 'text/event-stream');
	setResponseHeader(event, 'Cache-Control', 'no-cache');
	setResponseHeader(event, 'Connection', 'keep-alive');

	const eventStream = createEventStream(event);

	// Run processing in the background
	// We don't 'await' the whole loop, we stream as we go
	const runAnalysis = async () => {
		const batchSize = 5;
		for (let i = 0; i < body.vehicleIds.length; i += batchSize) {
			const batch = body.vehicleIds.slice(i, i + batchSize);
			await Promise.all(
				batch.map(async (id) => {
					try {
						let requestUrl = `/api/regent-tracking/device-history?api_hash=${cookies.tracking_auth_token}&device_id=${id}&from_time=00:00:00&to_time=23:59:59&from_date=${body.fromDate}&to_date=${body.toDate}`;
						const h = (
							await makeProxyRequest<StandardSuccessResponse<DeviceHistory>>(
								requestUrl,
								undefined,
								event,
							)
						).data;
						const driverBehaviourAnalysis: DriverRiskScore =
							await deriveDriverBehaviour(h);
						const accidentAnalysis = await deriveAccidentAnalysis(h);
						await eventStream.push(
							JSON.stringify({
								driverBehaviour: driverBehaviourAnalysis,
								accidentAnalysis: accidentAnalysis,
							}),
						);
					} catch (e) {
						await eventStream.push(JSON.stringify({ id, error: true }));
					}
				}),
			);
		}
		await eventStream.push('__DONE__');
		await eventStream.close();
	};

	runAnalysis();
	return eventStream.send();
});
