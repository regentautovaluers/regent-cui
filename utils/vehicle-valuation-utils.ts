import { ValuationStages } from '~/types';

export const determineValuationStage = (
	stage?: String,
): { status: 'Completed' | 'Ongoing' } | null => {
	if (!stage) {
		return null;
	}

	const stagesRepresentingOngoing: ValuationStages[] = [
		ValuationStages.AWAITING_ASSESSMENT,
		ValuationStages.VALUER_DRAFT,
		ValuationStages.PENDING,
		ValuationStages.AWAITING_MANAGER_APPROVAL,
		ValuationStages.AWAITING_QC_APPROVAL,
	];

	const stagesRepresentingCompleted: ValuationStages[] = [
		ValuationStages.INVOICING,
		ValuationStages.COMPLETED,
	];
	const stageAsEnum = ValuationStages[stage as keyof typeof ValuationStages];

	if (stagesRepresentingOngoing.includes(stageAsEnum)) {
		return {
			status: 'Ongoing',
		};
	}

	if (stagesRepresentingCompleted.includes(stageAsEnum)) {
		return {
			status: 'Completed',
		};
	}

	return null;
};
