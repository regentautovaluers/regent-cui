import type { GenericResponse } from '~/types/corporate-valuations/generic-response-type';

export default defineEventHandler(async (event) => {
	const {
		reg_no,
		client_name,
		client_phone,
		letter_id,
	}: { reg_no: string; client_name: string; client_phone: string; letter_id: string } =
		await readBody(event);
	const cookies = parseCookies(event);
	const config = useRuntimeConfig();

	const formData = new FormData();
	formData.append('regNo', reg_no);
	formData.append('clientName', client_name);
	formData.append('clientPhone', client_phone);
	formData.append('letterId', letter_id);

	try {
		const endpoint = `${config.VALUATION_BASE_URL}/api/v1/authority-letter/corp/update-authority-letter`;
		await makeProxyRequest<GenericResponse<any>>(endpoint, {
			headers: {
				Authorization: `Bearer ${cookies.valuation_auth_token}`,
			},
			body: formData,
			method: 'PATCH',
		});
		return sendSuccessResponse(event, null);
	} catch (err) {
		return sendErrorResponse(event, err);
	}
});
