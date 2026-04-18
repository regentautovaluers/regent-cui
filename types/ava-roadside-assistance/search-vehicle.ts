export interface SearchResult {
	membership: Membership;
	membershipVehicle: MembershipVehicle;
}

export interface Membership {
	id: number;
	membership_number: string;
	full_name: string;
	phone_number: string;
	userEmail: string;
	corporateId: string;
	category: string;
	recordedBy: string;
	createdAt: string;
}

export interface MembershipVehicle {
	id: number;
	membershipType: MembershipType;
	membership: Membership;
	registration: string;
	make: string;
	model: string;
	color: string;
	available_free_distance: string;
	start_date: string;
	end_date: string;
	membership_status: string;
	payment_status: string;
	bill: any;
	createdAt: string;
	updatedAt: string;
}

export interface MembershipType {
	id: number;
	membership_name: string;
	membership_rate: string;
	benefits: string;
	createdAt: string;
	updatedAt: string;
	membership_description: string;
	recordedBy: string;
	free_distance: string;
}

// for picking only what's necessary here
export type SlimmedSearchResult = {
	user: Pick<Membership, 'full_name' | 'phone_number' | 'userEmail'>;
	vehicleDetails: Pick<MembershipVehicle, 'registration' | 'make' | 'model' | 'available_free_distance'>;
};
