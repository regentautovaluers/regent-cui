import { makeProxyRequest } from '~/server/utils/proxy-utils';
import { TrackedVehicles } from '~/types/regent-tracking/tracked-vehicles';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query = getQuery(event);
	let endpoint = `${config.REGENT_TRACK_BASE_URL}/api/get_devices?lang=en&user_api_hash=${query.api_hash}`;

	if (query.page) {
		endpoint = endpoint + `&page=${query.page}`;
	}

	if (query.limit) {
		endpoint = endpoint + `&limit=${query.limit}`;
	}

	try {
		const vehicleData =
			await makeProxyRequest<{ id: number; title: string; items: TrackedVehicles[] }[]>(
				endpoint,
			);
		return sendSuccessResponse(
			event,
			vehicleData.flatMap((vehicle) => vehicle.items as TrackedVehicles[]),
		);
	} catch (err) {
		return sendErrorResponse(event, err);
	}
});
