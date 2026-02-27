import type { GenericResponse } from '~/types/corporate-valuations/generic-response-type';
import type { AuthorityLetter } from '~/types/corporate-valuations/authority-letters';

export default defineEventHandler(async (event) => {
	const query: {
		corpId: string;
		page: number;
		size: number;
		searchTerm?: string;
		startDate?: string;
		endDate?: string;
		ongoing?: string;
	} = getQuery(event);
	const cookies = parseCookies(event);
	const config = useRuntimeConfig();

	let requestURL = `${config.VALUATION_BASE_URL}/api/v1/authority-letter/corp/get-authority-letter?corpId=${query.corpId}&page=${query.page}&size=${query.size}`;

	if (query.searchTerm) {
		requestURL = requestURL + `&searchTerm=${query.searchTerm}`;
	}

	if (query.startDate) {
		requestURL = requestURL + `&startDate=${query.startDate}`;
	}

	if (query.endDate) {
		requestURL = requestURL + `&endDate=${query.endDate}`;
	}

	if (query.ongoing) {
		requestURL = requestURL + `&ongoing=${query.ongoing}`;
	}

	try {
		let response = await makeProxyRequest<GenericResponse<AuthorityLetter[]>>(requestURL, {
			headers: {
				Authorization: `Bearer ${cookies.valuation_auth_token}`,
			},
		});
		return sendSuccessResponse(event, response);
	} catch (err) {
		console.log(err);
		return sendErrorResponse(event, err);
	}
});
