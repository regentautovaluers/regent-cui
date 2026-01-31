import type {
	CleanedRearangedAndMapped,
	PaginationData,
	ValuationData,
} from '~/types/corporate-valuations/legacy-valuations';
import { mapLegacyValuationToNewType } from '~/utils/vehicle-valuation-utils';
import { cleanValuations } from '~/server/utils/valuation-utils';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query: {
		mode: 'LIST' | 'SEARCH';
		corp: string;
		period_from?: string;
		period_to?: string;
		reg_no?: string;
	} = getQuery(event);

	let requestURL =
		query.mode == 'SEARCH'
			? `${config.LEGACY_VALUATION_BASE_URL}/ava/api/reg-search?uname=${config.LEGACY_VALUATION_AUTH_UNAME}&password=${config.LEGACY_VALUATION_AUTH_PWD}`
			: `${config.LEGACY_VALUATION_BASE_URL}/ava/api/corp-report?uname=${config.LEGACY_VALUATION_AUTH_UNAME}&password=${config.LEGACY_VALUATION_AUTH_PWD}&pwd`;

	if (query.corp) {
		requestURL += `&corp=${query.corp}`;
	}

	if (query.period_from) {
		requestURL += `&period_from=${query.period_from}`;
	}

	if (query.period_to) {
		requestURL += `&period_to=${query.period_to}`;
	}

	if (query.reg_no) {
		requestURL += `&reg_no=${query.reg_no}`;
	}

	try {
		const response = JSON.parse(
			await makeProxyRequest<string>(requestURL, {
				method: 'GET',
			}),
		);
		const cleanedAndMapped: CleanedRearangedAndMapped = {
			paginationData: response[0] as PaginationData,
			valuationData: (response.toSpliced(0, 1) as ValuationData[]).map((v) => {
				let vb = mapLegacyValuationToNewType(v);
				cleanValuations(vb);
				return vb;
			}),
		};

		return sendSuccessResponse(event, cleanedAndMapped);
	} catch (err) {
		console.log(err);
		return sendErrorResponse(event, err);
	}
});
