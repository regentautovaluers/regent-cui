import type { AVAMembershipType } from '~/types/ava-roadside-assistance/memebership-types';

export default defineEventHandler(async (event) => {
	try {
		const response: AVAMembershipType[] = [
			{
				id: 1,
				membership_name: 'Roadside Assistance',
				membership_rate: '3500',
				benefits:
					'["A 20KM free Tow","Unlimited Jump-starts","Unlimited Fuel Delivery","Unlimited Tire Change","50% Off Tracking Installation","Post Accident Assistance"]',
				createdAt: '2024-06-28T07:38:05.842Z',
				updatedAt: '2024-06-28T07:38:05.842Z',
				membership_description: 'Roadside assistance that covers you for less',
				recordedBy: 'system',
				free_distance: '20',
			},
			{
				id: 2,
				membership_name: 'Emergency Evacuation',
				membership_rate: '5500',
				benefits:
					'["Unlimited Air Evacuations","Unlimited Ground Evacuations","Unlimited Fuel Delivery","Unlimited Tire Change","50% Off Tracking Installation","Post Accident Assistance"]',
				createdAt: '2024-06-28T07:38:05.863Z',
				updatedAt: '2024-06-28T07:38:05.863Z',
				membership_description: 'Swift and reliable emergency evacuation services',
				recordedBy: 'system',
				free_distance: null,
			},
		];

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
