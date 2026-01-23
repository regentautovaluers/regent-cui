export type MembershipCategory = 'individual' | 'corporate';
export type PaymentStatus = 'paid' | 'not paid';
export type MembershipStatus = 'active' | 'inactive';

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
	membership_status: PaymentStatus | ''; // This is sketchy. Figure out another way to do this!
	start_date: string;
	end_date: string;
}

export interface BulkMemberRegistrationRequest {
	corpName: string;
	full_name: string;
	phone_number: string;
	userEmail: string;
	corporateId: string;
	membershipTypeId: number;
	available_free_distance: number | string;
	registration: string;
	start_date: string;
	end_date: string;
	make: string;
	model: string;
	color: string;
	payment_status: PaymentStatus;
	membership_status: MembershipStatus;
	recordedBy: string;
	category: MembershipCategory;
	fleetId: number;
}
