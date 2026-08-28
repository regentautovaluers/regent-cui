export type UserRoles = "ROLE_CORP_NORM" | "ROLE_CORP_ADMIN";

export interface BaseAppPrincipal {
  userId: string;
  username: string;
  email: string;
  phoneNumber: string | null;
  userRoles: UserRoles[];
  roleInOrganization: string;
  branchId: string | null;
  lastLogin: string | null;
}

export type ValuationPrincipal = BaseAppPrincipal & {
  corpOrganization: CorpOrganization;
  accountEnabled: boolean;
};

export type CorpClass =
  | "BANK"
  | "MICRO_FINANCE"
  | "SACCO"
  | "INSURANCE"
  | "COURT"
  | "GOVT_INST"
  | "OTHERS";

export interface CorpOrganization {
  corpId: string;
  corpName: string;
  broker: boolean;
  corpClass: CorpClass;
}

export type LoginResponse = BaseAppPrincipal &
  Pick<CorpOrganization, "corpId" | "corpName"> & {
    refreshToken?: string;
    jwtToken?: string;
    branchName: string | null;
    passwordUpdated: boolean;
    isBroker: boolean;
    corpType: CorpClass;

    // extra
    rememberMe: boolean;
  };

export interface SlimmedLoginReponse extends Pick<
  LoginResponse,
  | "userId"
  | "username"
  | "email"
  | "phoneNumber"
  | "corpId"
  | "corpName"
  | "rememberMe"
  | "branchId"
  | "isBroker"
> {
  isAdmin: boolean;
  isLoggedIn: boolean;
  isTrackingLoggedIn: boolean;
}
