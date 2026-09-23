export interface RegentBranch {
  branchId: string;
  branchName: string;
  branchEmail?: string;
  branchPhone?: string;
  branchLocation?: string;
  branchCode?: string;
  paymentPool?: any;
  paymentPoolType?: any;
  regentBranchCluster?: any;
}

export type CorporateBranch = Pick<
  RegentBranch,
  "branchId" | "branchName" | "branchLocation"
>;
