export interface GenericCollateralVerificationResponse<T> {
  apiReleaseVersion: string;
  organizationName: string;
  status: number;
  message: string;
  data: T;
  pagination: CollateralVerificationPagination;
}

export interface CollateralVerificationEntry {
  id: string;
  registrationNumber: string;
  chassisNumber: string;
  engineNumber: string;
  color?: string;
  make: string;
  model: string;
  yearOfManufacture: number;
  corporateClientId: string;
  corporateClientName: string;
  corpClientRepName: string;
  corpClientEmail: string;
  corpClientPhoneNumber: string;
  description: any;
  relevantLinks: any[];
  dateOfIncident: string;
  amountDefaulted: string;
}

export interface CollateralVerificationPagination {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}
