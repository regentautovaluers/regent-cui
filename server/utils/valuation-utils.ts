import type { ValuationBooking } from '~/types/corporate-valuations/valuation-report';

/**
 * Removes unwanted keys form the valuation booking
 * @param vb the valuation
 */
export function cleanValuations(vb: ValuationBooking) {
	delete vb.bookingSource;
	delete vb.bookingReversed;
	delete vb.draftCreationDate;
	delete vb.vehicleOwnership;
	delete vb.clientNatIdNumber;
	delete vb.kraPin;
	delete vb.vehicleType;
	delete vb.serviceCharge;
	delete vb.paymentMethod;
	delete vb.valuationLocation;
	delete vb.uploadedDocuments;
	delete vb.proposedValuationDate;
	delete vb.onBehalfOfRegentBranch;
	delete vb.onBehalfOfRegentBranch;
	delete vb.regentValuer;
	delete vb.regentBooker;
	delete vb.approvedByManager;
	delete vb.approvedByQc;
	delete vb.approvedBySecretary;
	delete vb.reportValidationToken;
	delete vb.inspectionFnl;
}
