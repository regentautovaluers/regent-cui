export interface AvaMembershipFleets {
	id: number;
	fleetname: string;
	corporate?: string;
	contact_full_name?: string;
	contact_phone_number?: string;
	contact_email?: string;
	createdAt?: Date;
	memberCount?: string;
}

export interface CreateMembershipFleets {
	corporate: string;
	fleetname: string;
	contact_full_name: string;
	contact_phone_number: string;
	contact_email: string;
	recordedBy: string;
}
