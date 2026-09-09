export interface AVAMembershipType {
	id: number;
	membership_name: string;
	membership_rate?: string;
	benefits: string | string[];
	createdAt?: Date | String;
	updatedAt?: Date | String;
	membership_description: string;
	recordedBy?: string;
	free_distance: null | string;
}
