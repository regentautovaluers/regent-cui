export interface ValuationPrinicpal {
	userId: string;
	username: string;
	email: string;
	phoneNumber: string;
	userRoles: UserRoles[];
	roleInOrganization: string;
	branchId: string;
	corpOrganization: CorpOrganization;
	accountEnabled: boolean;
}

export type UserRoles = 'ROLE_CORP_NORM' | 'ROLE_CORP_ADMIN';

export type CorpClass =
	| 'BANK'
	| 'MICRO_FINANCE'
	| 'SACCO'
	| 'INSURANCE'
	| 'COURT'
	| 'GOVT_INST'
	| 'OTHERS';

export interface CorpOrganization {
	corpId: string;
	corpName: string;
	broker: boolean;
	corpClass: CorpClass;
}

export interface LoginResponse {
	username: string;
	email: string;
	phoneNumber: string;
	userId: string;
	userRoles: UserRoles[];
	refreshToken: string;
	jwtToken: string;
	branchId: string;
	branchName: any;
	corpId: string;
	corpName: string;
	roleInOrganization: string;
	isBroker: boolean;
	corpType: CorpClass;
}
