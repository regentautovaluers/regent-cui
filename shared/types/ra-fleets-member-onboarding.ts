export interface AVAAvailableFleets {
  id: number;
  fleetname: string;
  corporate?: string;
  contact_full_name?: string;
  contact_phone_number?: string;
  contact_email?: string;
  createdAt?: string;
  memberCount?: string;
}

export interface AVACreateFleet {
  corporate: string;
  fleetname: string;
  contact_full_name: string;
  contact_phone_number: string;
  contact_email: string;
  recordedBy: string;
}

// supporting types
export type MembershipCategory = "individual" | "corporate";
export type PaymentStatus = "paid" | "not paid";
export type MembershipStatus = "active" | "inactive";

// the person and their account -> called a member
export interface AVAMember {
  full_name: string;
  phone_number: string;
  userEmail: string;
  corporateId?: string;
  category: MembershipCategory;
  recordedBy?: string;
}

// the person's (AVAMember) vehicle
export interface AVAMemberVehicle {
  corpName?: string;
  membershipTypeId: number;
  registration: string;
  make: string;
  model: string;
  color: string;
  payment_status: string;
  membership_status: PaymentStatus | string; // This is sketchy. Figure out another way to do this!
  start_date: string;
  end_date: string;
}

export type SingleAVAMemberRegistration = {
  member: AVAMember;
  vehicles: AVAMemberVehicle[];
};

export type BulkAVAMemberRegistration = AVAMember &
  AVAMemberVehicle & {
    fleetId: number;
    available_free_distance: number | string;
  };
