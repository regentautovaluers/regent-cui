import type { GenericResponse } from '~/types/corporate-valuations/generic-response-type';

export default defineEventHandler(async (event) => {
	const requestData = await readMultipartFormData(event);

	// re-bind the values
	const formData = new FormData();

	// Check if requestData exists and iterate using for...of
	if (requestData) {
		for (const e of requestData) {
			const name = e.name as string;

			if (name !== 'files') {
				formData.append(name, e.data.toString());
				continue;
			}

			formData.append(
				'files',
				new Blob([e.data] as BlobPart[], { type: e.type }),
				e.filename,
			);
		}
	}

	const cookies = parseCookies(event);
	const config = useRuntimeConfig();
	try {
		const endpoint = `${config.public.VALUATION_BASE_URL}/api/v1/authority-letter/corp/create-authority-letter`;
		await makeProxyRequest<GenericResponse<any>>(endpoint, {
			headers: {
				Authorization: `Bearer ${cookies.valuation_auth_token}`,
			},
			body: formData,
			method: 'POST',
		});
		return sendSuccessResponse(event, null);
	} catch (err) {
		return sendErrorResponse(event, err);
	}
});
