import { makeProxyRequest } from '~/server/utils/proxy-utils';
import { TrackedVehicles } from '~/types/regent-tracking/tracked-vehicles';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query = getQuery(event);

	// Set source context for response wrapper
	event.context.source = 'regent-tracking-service';

	const vehicleData = await makeProxyRequest<
		{ id: number; title: string; items: TrackedVehicles[] }[]
	>(
		`${config.public.REGENT_TRACK_BASE_URL}/api/get_devices?lang=en&user_api_hash=${query.api_hash}`,
	);

	// Simple transformation
	return vehicleData[0].items as TrackedVehicles[];
});
