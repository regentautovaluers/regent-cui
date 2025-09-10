import { makeProxyRequest } from '~/server/utils/proxy-utils';
import { TrackedVehicles } from '~/types/regent-tracking/tracked-vehicles';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const api_hash = getRouterParam(event, 'api_hash');

	// Set source context for response wrapper
	event.context.source = 'regent-tracking-service';

	const vehicleData: any = await makeProxyRequest(
		`${config.public.REGENT_TRACK_BASE_URL}/api/get_devices?lang=en&user_api_hash=${`$2y$10$VG5xofVqWW6B1gu2zLDFYezsoLkyUonucCKZyR5tAFqb7XV5Tx2yi`}`,
	);

	// Simple transformation
	return vehicleData[0].items as TrackedVehicles[];
});
