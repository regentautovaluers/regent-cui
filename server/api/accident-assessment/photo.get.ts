/**
 * A photograph from an accident claim, proxied so the browser can load it.
 *
 * The accident service returns photo URLs as SIGNED, SERVICE-RELATIVE paths:
 * `/api/media/{id}?e=...&s=...`. Relative to what, though. Rendered as-is in
 * this console they resolve against regent-cui's own origin, which serves no
 * such path, and an insurer opening a claim sees a row of broken tiles where
 * the damage photographs should be. Nine of them, on every claim.
 *
 * So the path is rewritten to point here (get-claim does the rewriting) and
 * this route fetches it from the service with the caller's own credential.
 * That keeps two things true: the browser never needs the service's address,
 * and a photograph is only served to somebody the service would already show
 * the claim to.
 *
 * Only `/api/media/...` paths are accepted. The id and signature come back
 * from a response body, and a proxy that will fetch any path it is handed is
 * a way to reach anything the server can.
 */
export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query: { path?: string } = getQuery(event);

	if (!query.path) {
		return sendErrorResponse(
			event,
			createProxyError(400, 'A photo path is required.', 'validation_error'),
		);
	}

	if (!config.ACCIDENT_BASE_URL) {
		return sendErrorResponse(
			event,
			createProxyError(
				503,
				'The accident service is not configured for this environment.',
				'network_error',
			),
		);
	}

	/*
	 * The allowlist. `path` arrives from a rewritten response body, so it is
	 * checked rather than trusted: it must be relative, and it must be the
	 * media route. `new URL` against the service origin makes an absolute URL
	 * or an attempt to escape one both fail this test rather than passing it.
	 */
	const serviceOrigin = new URL(config.ACCIDENT_BASE_URL as string);
	let target: URL;
	try {
		target = new URL(query.path, serviceOrigin);
	} catch {
		return sendErrorResponse(
			event,
			createProxyError(400, 'That photo path is not valid.', 'validation_error'),
		);
	}

	const sameHost =
		target.origin === serviceOrigin.origin &&
		target.pathname.startsWith('/api/media/');

	if (!sameHost) {
		return sendErrorResponse(
			event,
			createProxyError(
				400,
				'That photo path is not one this console will fetch.',
				'validation_error',
			),
		);
	}

	try {
		const response = await fetch(target, {
			headers: {
				Authorization: `Bearer ${parseCookies(event).valuation_auth_token}`,
			},
			// A redirect would carry the credential to a host never checked.
			redirect: 'manual',
			signal: AbortSignal.timeout(15_000),
		});

		if (!response.ok) {
			return sendErrorResponse(
				event,
				createProxyError(
					response.status === 404 ? 404 : 502,
					'That photograph could not be loaded.',
					'remote_api_error',
				),
			);
		}

		const type = response.headers.get('content-type') ?? '';
		if (!type.startsWith('image/')) {
			// The same disguise a missing report wears: a 200 that is not the
			// thing asked for.
			return sendErrorResponse(
				event,
				createProxyError(
					502,
					'That link did not return an image.',
					'remote_api_error',
				),
			);
		}

		setHeader(event, 'Content-Type', type);
		setHeader(event, 'Cache-Control', 'private, max-age=300');
		return Buffer.from(await response.arrayBuffer());
	} catch (err) {
		return sendErrorResponse(event, err);
	}
});
