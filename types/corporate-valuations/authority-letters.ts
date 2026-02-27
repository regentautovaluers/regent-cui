import type { RegentUser } from './valuation-report';

export interface AuthorityLetter {
	letterId: string;
	registrationNumber: string;
	clientName: string;
	feedback: string;
	clientPhone: string;
	policyNumber: string | null;
	agencyName: string | null;
	authorizedBy: AuthorizedBy;
	createdOn: string;
	assessmentStage: string;
	reportURL: string | null;
	feedbackTrail: FeedbackTrail[];
	uploadedDocuments: string[];
}

export interface AuthorizedBy {
	username: string;
}

export interface FeedbackTrail {
	id: number;
	feedback: string;
	dateAdded: string;
	addedByRegentUser: RegentUser | null;
	addedByCorporateUser: AddedByCorporateUser;
}

export interface AddedByCorporateUser {
	userId: string;
	username: string;
}
