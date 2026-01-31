import { deriveDriverBehaviour } from '~/server/utils/dbehavior-analysis-computation';

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
						const result = await deriveDriverBehaviour(
							id,
							cookies.tracking_auth_token,
							body.fromDate,
							body.toDate,
						);
						await eventStream.push(JSON.stringify(result));
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
