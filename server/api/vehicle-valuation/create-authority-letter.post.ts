import type { GenericResponse } from '~/types/corporate-valuations/generic-response-type';
import { type MultiPartData } from 'h3';

export default defineEventHandler(async (event) => {
	const requestData: MultiPartData[] | undefined = await readMultipartFormData(event);
	const formData = new FormData();
	const config = useRuntimeConfig();
	const pdfInput: Record<string, string> = {};
	const blackListedKeys: string[] = [
		'authorizedByUsername',
		'authorizedByPhoneNumber',
		'isCreatedByBroker',
		'corporateName',
		'agentName',
	];

	// Check if requestData exists and iterate using for...of
	if (requestData) {
		for (const e of requestData) {
			const name = e.name as string;

			if (name !== 'files') {
				if (!blackListedKeys.includes(name)) {
					// append to the form
					formData.append(name, e.data.toString());
				}

				// append to the pdfInputRecord
				pdfInput[name] = e.data.toString();
				continue;
			}

			formData.append(
				'files',
				new Blob([e.data] as BlobPart[], { type: e.type }),
				e.filename,
			);
		}
	}

	try {
		const endpoint = `${config.public.VALUATION_BASE_URL}/api/v1/authority-letter/corp/create-authority-letter`;
		await makeProxyRequest<GenericResponse<any>>(
			endpoint,
			{
				body: formData,
				method: 'POST',
			},
			event,
		);
		return sendSuccessResponse(event, null);
	} catch (err) {
		return sendErrorResponse(event, err);
	}
});
