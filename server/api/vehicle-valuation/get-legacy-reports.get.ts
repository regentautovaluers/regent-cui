import type { LegacyValuation } from '~/types/corporate-valuations/legacy-valuations';
import type { GenericResponse } from '~/types/corporate-valuations/generic-response-type';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query: {
		page: number;
		size: number;
		bookingId?: string;
		startDate?: string;
		endDate?: string;
		corpId: string;
		searchTerm?: string; 
	} = getQuery(event);

	let requestURL = `${config.LEGACY_VALUATION_BASE_URL}/api/v1/valuations/search?&page=${query.page}&size=${query.size}`;

	if (query.bookingId) {
		requestURL += `&bookingId=${query.bookingId}`;
	}

	if (query.startDate) {
		requestURL += `&startDate=${query.startDate}`;
	}

	if (query.endDate) {
		requestURL += `&endDate=${query.endDate}`;
	}

	if (query.corpId) {
		requestURL += `&corpId=${query.corpId}`;
	}

	if (query.searchTerm) {
		requestURL += `&searchTerm=${query.searchTerm}`;
	}

	try {
		const response = await makeProxyRequest<GenericResponse<LegacyValuation[]>>(requestURL, {
			method: 'GET',
			headers: {
				"X-API-Key": `${config.LEGACY_VALUATION_API_KEY}`
			}
		});
		return sendSuccessResponse(event, response);
	} catch (err) {
		return sendErrorResponse(event, err);
	}
});
