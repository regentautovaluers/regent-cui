export type MembershipCategory = 'individual';

export interface IndividualMemberRegistrationRequest {
	full_name: string;
	phone_number: string;
	userEmail: string;
	corporateId: string;
	category: MembershipCategory;
	recordedBy: string;
	vehicles?: IndividualMemberVehicle[];
}

export interface IndividualMemberVehicle {
	corpName: string;
	membershipTypeId: number;
	registration: string;
	make: string;
	model: string;
	color: string;
	payment_status: string;
	membership_status: string;
	start_date: string;
	end_date: string;
}
