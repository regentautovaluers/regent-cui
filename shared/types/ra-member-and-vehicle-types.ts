import type {
  AVAMember,
  AVAMemberVehicle,
} from "./ra-fleets-member-onboarding";
export interface CorporateAVAMembers {
  memberships: AVAMem[];
  totalPages: number;
  totalCount: number;
}

export type AVAMem = Pick<
  AVAMember,
  "full_name" | "phone_number" | "userEmail" | "corporateId" | "category"
> & {
  id: number;
  membership_number: string;
  membershipVehicles: AVAMemberVeh[];
  recordedBy: string;
  createdAt: string;
  membershipVehicleCount: number;
  membershipVehicleCounts: MembershipVehicleCount[];
};

export type SlimmedAVAMem = Omit<
  AVAMem,
  "membershipVehicles" | "membershipVehicleCount" | "membershipVehicleCounts"
>;

export type AVAMemberVeh = Pick<
  AVAMemberVehicle,
  | "registration"
  | "make"
  | "model"
  | "color"
  | "start_date"
  | "end_date"
  | "payment_status"
  | "membership_status"
> & {
  id: number;
  membershipType: MembershipType;
  available_free_distance: string;
  bill: number | null;
  createdAt: string;
  updatedAt: string;
};

export interface SearchAVAMemberVehicle {
  membership: SlimmedAVAMem;
  membershipVehicle: AVAMemberVeh & { membership: SlimmedAVAMem };
}

export type MembershipName = "Roadside Assistance" | "Emergency Evacuation";

export interface MembershipType {
  id: number;
  membership_name: MembershipName;
  membership_rate: string;
  benefits: string;
  createdAt: string;
  updatedAt: string;
  membership_description: string;
  recordedBy: string;
  free_distance: string;
}

export interface MembershipVehicleCount {
  membershipTypeId: number;
  membership_name: string;
  vehicleCount: number;
}

export interface CorporateAVAFleet {
  id: number;
  fleetname: string;
  corporate: string;
  contact_full_name: string;
  contact_phone_number: string;
  contact_email: string;
  createdAt: string;
  updatedAt: string;
  recordedBy: string;
}

export type GetCorporateAVAMemberVehiclesPagination = {
  currentPage: number;
  currentSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type GetCorporateAVAMemberVehiclesMember = Pick<
  AVAMember,
  "full_name" | "phone_number" | "userEmail" | "corporateId" | "category"
> & { fleet: CorporateAVAFleet; membershipVehicles: AVAMemberVeh[] };

export type GetCorporateAVAMemberVehicles = {
  memberships: GetCorporateAVAMemberVehiclesMember[];
  pagination: GetCorporateAVAMemberVehiclesPagination | null;
};

export type SlimmedGetCorporateAVAMemberVehicles = Pick<
  GetCorporateAVAMemberVehiclesMember,
  "membershipVehicles"
> &
  Pick<GetCorporateAVAMemberVehicles, "pagination">;
