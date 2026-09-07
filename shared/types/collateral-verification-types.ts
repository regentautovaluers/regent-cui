export interface GenericCollateralVerificationResponse<T> {
  apiReleaseVersion: string;
  organizationName: string;
  status: number;
  message: string;
  data: T;
  pagination: CollateralVerificationPagination;
}

export interface CollateralVerification {
  registrationNumber: string;
  chassisNumber: string;
  engineNumber: string;
  color?: string;
  make: string;
  model: string;
  yearOfManufacture: number;
  description: any;
  relevantLinks: any[];
  dateOfIncident: string;
  amountDefaulted: string;
}

export interface CollateralVerificationCreator {
  corporateClientId: string;
  corporateClientName: string;
  corpClientRepName: string;
  corpClientEmail: string;
  corpClientPhoneNumber: string | null;
}

export type CollateralVerificationEntry = {
  id: string;
} & CollateralVerification &
  CollateralVerificationCreator;

export type CollateralVerificationTokens = {
  id: string;
  name: string | null;
  balance: number;
  billingType: "postpaid" | "prepaid";
  invoiceDueDays: string | number | null;
  fraudBundleSearches: number | null;
  verifyNationalIdSearches: number | null;
  verifyAlienIdSearches: number | null;
  verifyVehicleSearches: number | null;
  verifyDrivingLicenseSearches: number | null;
  verifyKraPinSearches: number | null;
  verifyBusinessSearches: number | null;
  verifyCollateralSearches: number | null;
  verifyBankAccountSearches: number | null;
  createdAt: string;
  updatedAt: string;
};

export interface CollateralVerificationPagination {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}
