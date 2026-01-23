import type { AVAMembershipType } from '~/types/ava-roadside-assistance/memebership-types';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const endpoint = `${config.AVA_BASE_URL}/api/v1/control-unit/membershiptypes`;
	try {
		const response = await makeProxyRequest<AVAMembershipType[]>(endpoint);

		// delete unused keys
		response.forEach((e) => {
			delete e.createdAt;
			delete e.updatedAt;
			delete e.recordedBy;
			delete e.membership_rate;

			e.benefits = cleanupMembershipBenefits(e.benefits as string);
		});
		return sendSuccessResponse(event, response);
	} catch (err) {
		return sendErrorResponse(event, err);
	}
});

function cleanupMembershipBenefits(inputString: string) {
	let array = JSON.parse(inputString);
	let cleanedArray: string[] = array.map((item: string) => {
		let cleanedItem = item.replace(/\\/g, '');
		cleanedItem = cleanedItem.charAt(0).toUpperCase() + cleanedItem.slice(1);
		return cleanedItem;
	});

	return cleanedArray;
}
