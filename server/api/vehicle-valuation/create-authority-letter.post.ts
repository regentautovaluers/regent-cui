import type { GenericResponse } from '~/types/corporate-valuations/generic-response-type';
import type { AuthorityLetter } from '~/types/corporate-valuations/authority-letters';
import { type MultiPartData } from 'h3';

export default defineEventHandler(async (event) => {
	const requestData: MultiPartData[] | undefined = await readMultipartFormData(event);
	const formData = new FormData();
	const cookies = parseCookies(event);
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
		// source the authority letter pdf
		const requestBody: AuthorityLetter = buildAuthorityLetterRequestBody(pdfInput);
		const pdfBlob = await $fetch<Blob>('/api/vehicle-valuation/build-authority-letter', {
			method: 'POST',
			body: requestBody,
			responseType: 'blob',
		});

		// append it to the request's formData
		formData.append('files', pdfBlob, 'authority-letter.pdf');

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

function buildAuthorityLetterRequestBody(input: Record<string, string>): AuthorityLetter {
	let letter: AuthorityLetter = {
		letterId: 'UNKNOWN',
		createdByBroker: input.isCreatedByBroker == 'true',
		registrationNumber: input.regNo,
		clientName: input.clientName,
		feedback: 'UNKNOWN',
		clientPhone: input.clientPhone,
		policyNumber: input.policyNumber ?? '-',
		agencyName: input.isCreatedByBroker == 'true' ? input.agentName : '-',
		authorizedBy: {
			username: input.authorizedByUsername,
			phoneNumber: input.authorizedByPhoneNumber,
		},
		createdOn: new Date().toISOString().replace('T', ' '),
		assessmentStage: 'UNKNOWN',
		reportURL: 'UNKNOWN',
		feedbackTrail: [
			{
				id: 0,
				feedback: input.comments,
				dateAdded: 'UNKNOWN',
				addedByRegentUser: null,
				addedByCorporateUser: {
					userId: 'UNKNOWN',
					username: 'UNKNOWN',
				},
			},
		],
		uploadedDocuments: [],
		corpOrganization: {
			corpId: 'UNKNOWN',
			corpName: input.corporateName,
		},
	};

	return letter;
}
