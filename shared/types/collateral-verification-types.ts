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

export interface GenericIPRSQueryResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface IPRSIDCheckData {
  ErrorCode: string | null;
  ErrorMessage: string | null;
  ErrorOcurred: string | null;
  Citizenship: string | null;
  Clan: string | null;
  Date_of_Birth: string | null;
  Date_of_Death: string | null;
  Ethnic_Group: string | null;
  Family: string | null;
  First_Name: string | null;
  Gender: string | null;
  ID_Number: string | null;
  Occupation: string | null;
  Other_Name: string | null;
  Pin: string | null;
  Place_of_Birth: string | null;
  Place_of_Death: string | null;
  Place_of_Live: string | null;
  Surname: string | null;
  Date_of_Issue: string | null;
  RegOffice: string | null;
  Serial_Number: string | null;
}

export interface IPRSCollateralSearchResultEntry {
  title: string;
  value: string | number | null;
}
