/**
 * The accident service's claim shapes, as the console consumes them.
 *
 * The service speaks snake_case on the wire (its contract is the shipped field
 * app's). The server route below converts once, at the proxy boundary, so
 * everything from the composable inwards is camelCase like the rest of this
 * codebase.
 */

export type AccidentReportStatus =
	| 'assigned'
	| 'in_progress'
	| 'draft'
	| 'submitted'
	| 'under_review'
	| 'approved'
	| 'rejected'
	| 'issued'
	| 'closed';

/** One row of the insurer's claims table. */
export interface AccidentClaimRow {
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
	items: AccidentClaimRow[];
	total: number;
	page?: number;
	pageSize?: number;
}
