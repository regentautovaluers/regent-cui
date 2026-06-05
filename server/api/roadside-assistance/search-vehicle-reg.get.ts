import type {
	SearchResult,
	SlimmedSearchResult,
} from '~/types/ava-roadside-assistance/search-vehicle';
import { ProxyError } from '~/types/proxy-types';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query: { registration: string; corpId: string } = getQuery(event);
	const endpoint = `${config.AVA_BASE_URL}/api/v1/bookings?registration=${query.registration}&corporateId=${query.corpId}`;

	try {
		const response = await makeProxyRequest<SearchResult>(endpoint, undefined, event);
		const {
			membership: { full_name, phone_number, userEmail },
			membershipVehicle: { registration, make, model, available_free_distance },
		} = response;

		const slimmed: SlimmedSearchResult = {
			user: { full_name, phone_number, userEmail },
			vehicleDetails: { registration, make, model, available_free_distance },
		};
		return sendSuccessResponse(event, slimmed);
	} catch (err) {
		if ((err as ProxyError).statusCode == 404) {
			return sendSuccessResponse(event, null);
		}
		return sendErrorResponse(event, err);
	}
});
