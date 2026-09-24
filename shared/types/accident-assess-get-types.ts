export type AccidentReportStatus =
  | "assigned"
  | "in_progress"
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "issued"
  | "closed";

/** One row of the insurer's claims table. */
export interface AccidentClaimEntry {
  id: string;
  regNo?: string;
  clientName?: string;
  insuranceCompany?: string;
  claimNo?: string;
  policyNo?: string;
  assessorName?: string;
  grandTotal?: number;
  status: AccidentReportStatus;
  updatedAt?: string;
  assessmentDate?: string;
}

export interface AccidentClaimPage {
  items: AccidentClaimEntry[];
  total: number;
  page?: number;
  pageSize?: number;
}
