/**
 * One accident claim, in full.
 *
 * Scoping stays the accident service's job. It derives the corporate identity
 * from the estate JWT it verifies and refuses a claim belonging to another
 * organisation, so this route passes the id through and does not attempt to
 * decide who may read it -- a check the browser could influence is not a
 * boundary.
 */
export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query: { claimId?: string } = getQuery(event);

	if (!config.ACCIDENT_BASE_URL) {
		return sendErrorResponse(
			event,
			createProxyError(
				503,
				'The accident service is not configured for this environment.',
				'SERVICE_UNAVAILABLE',
			),
		);
	}

	if (!query.claimId) {
		return sendErrorResponse(
			event,
			createProxyError(400, 'A claim id is required.', 'BAD_REQUEST'),
		);
	}

	const requestURL = `${config.ACCIDENT_BASE_URL}/api/assessments/${encodeURIComponent(query.claimId)}`;

	try {
		const response = await makeProxyRequest<Record<string, any>>(
			requestURL,
			undefined,
			event,
		);

		return sendSuccessResponse(event, withProxiedPhotos(convertKeys(response)));
	} catch (err) {
		console.log(err);
		return sendErrorResponse(event, err);
	}
});

/**
 * snake_case -> camelCase. Only KEYS are converted: values such as
 * `under_review` are data, and rewriting them would change a claim's status.
 */
const snakeToCamel = (k: string): string =>
	k.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());

const convertKeys = (value: unknown): any => {
	if (Array.isArray(value)) return value.map(convertKeys);
	if (value === null || typeof value !== 'object') return value;
	const out: Record<string, unknown> = {};
	for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
		out[snakeToCamel(k)] = convertKeys(v);
	}
	return out;
};

/**
 * Point photo URLs at this console instead of at the accident service.
 *
 * The service signs them as service-relative `/api/media/{id}` paths. Left
 * alone they resolve against regent-cui's origin, which serves nothing there,
 * and every damage photograph renders as a broken tile.
 */
function withProxiedPhotos(claim: any): any {
	if (!claim || !Array.isArray(claim.photos)) return claim;
	return {
		...claim,
		photos: claim.photos.map((photo: any) => {
			const url: string | undefined = photo?.remoteUrl;
			if (typeof url !== 'string' || !url.startsWith('/api/media/')) return photo;
			return {
				...photo,
				remoteUrl: `/api/accident-assessment/photo?path=${encodeURIComponent(url)}`,
			};
		}),
	};
}
