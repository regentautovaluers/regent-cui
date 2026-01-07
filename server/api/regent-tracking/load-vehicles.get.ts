import { makeProxyRequest } from '~/server/utils/proxy-utils';
import { TrackedVehicles } from '~/types/regent-tracking/tracked-vehicles';
import SecurityUtil from '~/utils/security-util';
import { TraceabilityReport } from '~/types/regent-tracking/trace-report';

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

		let combinedVehicleData = vehicleData.flatMap(
			(vehicle) => vehicle.items as TrackedVehicles[],
		);

		// we have to load the client details here to reduce complicated calls on the front-end
		if (combinedVehicleData.length > 0) {
			const deviceIds: number[] = combinedVehicleData.map((v) => {
				return v.id;
			});
			let base64Encoded = SecurityUtil.encodeBase64(deviceIds.join(','));
			const userDetailsEndpoint =
				`${config.REGENT_TRACK_CERTS_BASE_URL}/tracking/traceabilityC.php?
					api_key=${config.TRACKING_CERTS_API_KEY}
					&tracker_id=${base64Encoded}
					&page=1
					&limit=${deviceIds.length}`.trim();
			try {
				const results = await makeProxyRequest<TraceabilityReport>(userDetailsEndpoint);
				results.results.forEach((r) => {
					let entry = combinedVehicleData.find(
						(e) => e.id == r.tracker_id,
					) as TrackedVehicles;

					// trace whether vehicle is on watchlist
					if (r.comments.length > 0) {
						const latest_comment = r.comments[0];
						entry.on_watchlist = latest_comment.watchlist == 'Y' ? true : false;
					} else {
						entry.on_watchlist = false;
					}

					// set the comment, and driver name and phone number
					entry.comment = r.comments;

					entry.driver_data.name = r.clientName;
					entry.driver_data.phone = r.clientNo;
				});
			} catch (error) {
				console.error('Failed to fetch traceability details. Cause: ', error);
			}

			return sendSuccessResponse(event, combinedVehicleData);
		} else {
			return sendSuccessResponse(event, [] as TrackedVehicles[]);
		}
	} catch (err) {
		console.log(err);
		return sendErrorResponse(event, err);
	}
});
