import { TrackedVehicles, TrackedVehicleFetchTick } from '~/types/regent-tracking/tracked-vehicles';

export default defineEventHandler(async (event) => {
	const cookies = parseCookies(event);
	const config = useRuntimeConfig();
	const endpoint = `${config.REGENT_TRACK_BASE_URL}/api/get_devices?lang=en&user_api_hash=${cookies.tracking_auth_token}`;

	// Set the headers for SSE
	setResponseHeader(event, 'Content-Type', 'text/event-stream');
	setResponseHeader(event, 'Cache-Control', 'no-cache');
	setResponseHeader(event, 'Connection', 'keep-alive');

	const eventStream = createEventStream(event);

	const fetchDevices = async () => {
		try {
			const vehicleData = await makeProxyRequest<
				{ id: number; title: string; items: TrackedVehicles[] }[]
			>(endpoint, undefined, event);

			const combinedVehicleData = vehicleData.flatMap(
				(vehicle) => vehicle.items as TrackedVehicles[],
			);

			const response: TrackedVehicleFetchTick = {
				vehicles: combinedVehicleData.map((v) => ({
					id: v.id,
					lat: v.lat,
					lng: v.lng,
					time: v.time,
				})),
				tick_time: new Date().toLocaleTimeString(),
			};

			// Standard SSE format: "data: <payload>\n\n"
			await eventStream.push(JSON.stringify(response));
		} catch (error) {
			console.error('Failed to fetch device details:', error);
		}
	};

	// initial push of data
	fetchDevices();

	// Setup Interval with Cleanup
	const timer = setInterval(fetchDevices, 45000);

	// Clear the interval when the client disconnects or the stream closes
	eventStream.onClosed(() => {
		clearInterval(timer);
		console.log('SSE Interval cleared for disconnected client.');
	});
	return eventStream.send();
});
