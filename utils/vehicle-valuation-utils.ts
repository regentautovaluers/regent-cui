import type {
	ValuationStages,
	SimplifiedValuationStage,
} from '~/types/corporate-valuations/valuation-report';
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
