import type {
	ValuationStages,
	SimplifiedValuationStage,
} from '~/types/corporate-valuations/valuation-report';
import type { ValuationData } from '~/types/corporate-valuations/legacy-valuations';
import type { ValuationBooking } from '~/types/corporate-valuations/valuation-report';

export const determineValuationStage = (
	stage?: ValuationStages,
): { status: SimplifiedValuationStage } | null => {
	if (!stage) {
		return null;
	}

	const stagesRepresentingOngoing: ValuationStages[] = [
		'AWAITING_ASSESSMENT',
		'VALUER_DRAFT',
		'PENDING',
		'AWAITING_MANAGER_APPROVAL',
		'AWAITING_QC_APPROVAL',
	];

	const stagesRepresentingCompleted: ValuationStages[] = ['INVOICING', 'COMPLETED'];

	if (stagesRepresentingOngoing.includes(stage)) {
		return {
			status: 'Ongoing',
		};
	}

	if (stagesRepresentingCompleted.includes(stage)) {
		return {
			status: 'Completed',
		};
	}

	return null;
};

export function mapLegacyValuationToNewType(v: ValuationData): ValuationBooking {
	const wrapped = {
		valuationId: v.administration?.booking_no,
		bookingDate: v.administration?.add_date.replace(' ', 'T'),
		inspectionDate: v.inspection?.inspection_date,
		regNo: v.vehicle?.registration_number,
		vehicleImage: null,
		clientName: v.client?.customer_name,
		clientEmail: v.client?.email,
		clientPhone: null,
		valuationStage: null,
		paymentStatus: '',
		pendingDocuments: [],
		valuationType: null,
		corpOrganization: null,
		corporateBranch: null,
		onBehalfOfOrganization: null,
		regentBranch: {
			branchId: null,
			branchEmail: null,
			branchName: v.administration?.regent_branch,
		},
		pendingDocumentsURL: null,
		isSpecial: null,
		specialReportsUnit: null,
		serialNumber: '',
		corporateRefNumber: undefined,
		boxNumber: null,
		reportURL: v.documents?.valuation_pdf,
		vehicleValue: null,
		completeTransaction: null,
		pending: v.administration?.pending,
		inspectionNote: v.administration?.nb,
		inspectionFnl: null,
		approvalDate: null,
	};

	// console.log(
	// 	'legacy data: ',
	// 	JSON.stringify(v, null, 2),
	// 	'\n',
	// 	'wrapped: ',
	// 	JSON.stringify(wrapped, null, 2),
	// );
	return wrapped;
}
