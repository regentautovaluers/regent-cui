import type { GenericResponse } from '~/types/corporate-valuations/generic-response-type';

export default defineEventHandler(async (event) => {
	const requestData = await readMultipartFormData(event);

	// re-bind the values
	const formData = new FormData();

	requestData?.forEach((e) => {
		if (e.name != 'files') {
			formData.append(e.name as string, e.data as unknown as string);
		}

		formData.append(
			e.name as string,
			new Blob(e.data as unknown as BlobPart[], {
				type: e.type as string,
			}),
			e.filename as string,
		);
	});

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
