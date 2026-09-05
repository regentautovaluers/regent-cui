/**
 * The signed report, fetched and CHECKED before it reaches a client.
 *
 * This goes through our own server rather than handing the browser the
 * accident service's URL, for two reasons that are really one reason.
 *
 * Scoping: the claim is fetched with the caller's own credential first, so an
 * insurer can only download a report on a claim the service would already show
 * them. A URL handed to the browser is a URL that can be passed on.
 *
 * And verification, which is the half that has already gone wrong once. In
 * accident-portal a download produced 1,648 bytes of HTML saved as
 * `KCX-904M-v1.pdf`, because a missing file falls through to a single-page app
 * that answers 200 with `text/html`, and the check in front of it could not
 * read the response. Someone opened it expecting a report. Status alone would
 * not have caught it -- both the miss and the real file answer 200. The
 * Content-Type is what does the work.
 *
 * So: fetch it here, refuse anything that is not `application/pdf`, and only
 * then stream it back. A document is never offered on the strength of a link.
 */
export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query: { claimId?: string } = getQuery(event);

	if (!query.claimId) {
		return sendErrorResponse(
			event,
			createProxyError(400, 'A claim id is required.', 'BAD_REQUEST'),
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

	const claimURL = `${config.ACCIDENT_BASE_URL}/api/assessments/${encodeURIComponent(query.claimId)}`;

	try {
		// The caller's own credential is used, so this 404s for somebody else's
		// claim exactly as the detail view does.
		const claim = await makeProxyRequest<Record<string, any>>(
			claimURL,
			undefined,
			event,
		);

		const pdfUrl: string | undefined = claim?.report?.pdf_url ?? claim?.report?.pdfUrl;

		if (!pdfUrl) {
			/*
			 * Not an error, a state: Regent publishes the PDF when the report is
			 * issued, and for most of a claim's life there is simply nothing yet.
			 *
			 * Returned as an ordinary body rather than thrown, because the error
			 * envelope replaces a handler's message with a generic one -- "the
			 * report is not ready" arrived at the browser as "Validation failed",
			 * which tells an insurer nothing and sounds like their fault.
			 */
			setHeader(event, 'Content-Type', 'application/json');
			return {
				issued: false,
				reason: 'The signed report for this claim has not been issued yet.',
			};
		}

		const absolute = pdfUrl.startsWith('http')
			? pdfUrl
			: `${config.ACCIDENT_BASE_URL}${pdfUrl.startsWith('/') ? '' : '/'}${pdfUrl}`;

		// A firewalled host black-holes the connection; without a bound the
		// request sits open and the button looks dead with nothing on screen.
		const response = await fetch(absolute, {
			headers: { Authorization: `Bearer ${parseCookies(event).valuation_auth_token}` },
			signal: AbortSignal.timeout(15_000),
		});

		if (!response.ok) {
			setHeader(event, 'Content-Type', 'application/json');
			return {
				issued: true,
				available: false,
				reason:
					'The report could not be retrieved from the document store. ' +
					'Please try again shortly.',
			};
		}

		const contentType = (response.headers.get('content-type') ?? '').toLowerCase();
		if (!contentType.includes('application/pdf')) {
			/*
			 * The failure this whole route exists for. `text/html` here is a miss
			 * wearing a hit's status code, and passing it on would put a web page
			 * in a client's hands under a .pdf name.
			 */
			setHeader(event, 'Content-Type', 'application/json');
			return {
				issued: true,
				available: false,
				reason:
					'That link did not return a PDF, so there is nothing to open. ' +
					'Ask Regent to generate the report again rather than sending the ' +
					'file on.',
			};
		}

		const body = Buffer.from(await response.arrayBuffer());
		setHeader(event, 'Content-Type', 'application/pdf');
		setHeader(
			event,
			'Content-Disposition',
			`inline; filename="report-${query.claimId}.pdf"`,
		);
		return body;
	} catch (err) {
		console.log(err);
		return sendErrorResponse(event, err);
	}
});
