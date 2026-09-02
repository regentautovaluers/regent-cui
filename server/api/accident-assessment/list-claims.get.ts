import type { AccidentClaimPage } from '~/types/accident-assessment/accident-claim';

/**
 * An insurer's own accident claims.
 *
 * Scoping is the SERVER's job, not this route's. The accident service derives
 * the corporate identity from the estate JWT it verifies and filters to that
 * organisation; passing a corpId from the browser would be a filter a client
 * could change, which is not the same thing as a boundary.
 */
export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query: {
		status?: string;
		q?: string;
		page?: number;
		size?: number;
	} = getQuery(event);

	if (!config.ACCIDENT_BASE_URL) {
		// Better to say the section is not configured than to call an empty host
		// and surface a confusing network error.
		return sendErrorResponse(
			event,
			createProxyError(
				503,
				'The accident service is not configured for this environment.',
				'SERVICE_UNAVAILABLE',
			),
		);
	}

	let requestURL = `${config.ACCIDENT_BASE_URL}/api/assessments?`;

	if (query.status) {
		requestURL = requestURL + `&status=${encodeURIComponent(query.status)}`;
	}

	if (query.q) {
		requestURL = requestURL + `&q=${encodeURIComponent(query.q)}`;
	}

	if (query.page) {
		requestURL = requestURL + `&page=${query.page}`;
	}

	if (query.size) {
		requestURL = requestURL + `&page_size=${query.size}`;
	}

	try {
		const response = await makeProxyRequest<Record<string, any>>(
			requestURL,
			undefined,
			event,
		);

		return sendSuccessResponse(event, toCamelClaimPage(response));
	} catch (err) {
		console.log(err);
		return sendErrorResponse(event, err);
	}
});

/**
 * snake_case -> camelCase, once, here.
 *
 * Only KEYS are converted. Values such as `under_review` are data, not
 * identifiers, and rewriting them would silently change a claim's status.
 */
const snakeToCamel = (k: string): string =>
	k.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());

const convertKeys = (value: unknown): unknown => {
	if (Array.isArray(value)) return value.map(convertKeys);
	if (value === null || typeof value !== 'object') return value;
	const out: Record<string, unknown> = {};
	for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
		out[snakeToCamel(k)] = convertKeys(v);
	}
	return out;
};

function toCamelClaimPage(raw: Record<string, any>): AccidentClaimPage {
	const converted = convertKeys(raw) as Record<string, any>;
	return {
		items: converted?.items ?? converted?.results ?? [],
		total: converted?.total ?? 0,
		page: converted?.page,
		pageSize: converted?.pageSize,
	};
}
