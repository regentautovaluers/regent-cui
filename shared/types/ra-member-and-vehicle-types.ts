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

export interface MembershipVehicleCount {
  membershipTypeId: number;
  membership_name: string;
  vehicleCount: number;
}
