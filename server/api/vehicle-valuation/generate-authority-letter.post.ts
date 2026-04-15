import type { AuthorityLetter } from '~/types/corporate-valuations/authority-letters';

export default defineEventHandler(async (event) => {
	const body: AuthorityLetter = await readBody(event);
	const config = useRuntimeConfig();

	try {
		const endpoint = `${config.REPORT_GENERATOR_BASE_URL}/report/generate-authority-letter`;
		const response = await makeProxyRequest<ArrayBuffer>(endpoint, {
			method: 'POST',
			body,
			responseType: 'arrayBuffer',
		});
		// 2. Set the appropriate headers so the browser knows it's a PDF
		setResponseHeaders(event, {
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'attachment; filename="electronic-authority-letter.pdf"',
		});

		// 3. Return the buffer directly
		return Buffer.from(response);
	} catch (err) {
		return sendErrorResponse(event, err);
	}
});
