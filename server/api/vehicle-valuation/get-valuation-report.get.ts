import type { ValuationReport } from '~/types/corporate-valuations/valuation-report';
import type { GenericResponse } from '~/types/corporate-valuations/generic-response-type';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const { valuation_id }: { valuation_id: string } = getQuery(event);
	const cookies = parseCookies(event);

	let endpoint = `${config.VALUATION_BASE_URL}/api/v1/final/get-inspection-details?valuationId=${valuation_id}`;

	try {
		const response = await makeProxyRequest<GenericResponse<ValuationReport>>(endpoint, {
			headers: {
				Authorization: `Bearer ${cookies.valuation_auth_token}`,
			},
		});

		const reportData = response.data;
		const cleanedResponse = {
			reportURL: reportData.valuationBooking.reportURL,
			insurer: reportData.engineAndWindscreenFinal.insurerName,
			valuationId: reportData.valuationBooking.valuationId,
			regNo: reportData.valuationBooking.regNo,
			clientName: reportData.valuationBooking.clientName,
			vehicleType: reportData.valuationBooking.vehicleType,
			engineNumber: reportData.engineAndWindscreenFinal.engineNumber,
			chassisNumber: reportData.tyreAndChassisFinal.chassisNumber,
			policyNumber: reportData.engineAndWindscreenFinal.policyNumber,
			vehiclePhotos: [
				...reportData.frontFinal.frontPhotos,
				...reportData.engineAndWindscreenFinal.enginePhotos,
				...reportData.engineAndWindscreenFinal.windscreenPhotos,
				...reportData.rightSideFinal.rightSidePhotos,
				...reportData.backSideFinal.backPhotos,
				...reportData.backSideFinal.bootPhotos,
				...reportData.leftSideFinal.leftSidePhotos,
				...reportData.tyreAndChassisFinal.chassisPhotos,
				...reportData.tyreAndChassisFinal.tyrePhotos,
				...reportData.interiorFinal.upholsteryPhotos,
				...reportData.interiorFinal.odometerPhotos,
			],
			inspection: {
				frontSectionComment: reportData.frontFinal.generatedComment,
				engineSectionComment: reportData.engineAndWindscreenFinal.engineGeneratedComment,
				windscreenSectionComment:
					reportData.engineAndWindscreenFinal.windscreenGeneratedComment,
				leftSideComment: reportData.leftSideFinal.generatedComment,
				rightSideComment: reportData.rightSideFinal.generatedComment,
				backSideComment: reportData.backSideFinal.generatedComment,
				mechanicalSectionComment:
					reportData.mechanicalAndElectricalFinal.mechanicalGeneratedComment,
				electicalSectionComment:
					reportData.mechanicalAndElectricalFinal.electricalGeneratedComment,
				vehicleExtras: reportData.extras,
				tyreCondition: reportData.tyreAndChassisFinal.tyreGeneratedComment,
				chassisCondition: reportData.tyreAndChassisFinal.chassisGeneratedComment,
				interiorComment: reportData.interiorFinal.interiorGeneratedComment,
				mileage: {
					reading: reportData.interiorFinal.odometerCurrentReading,
					units: reportData.interiorFinal.odometerReadingUnits,
				},
				generalCondition: reportData.generalCondition,
				remedy: reportData.remedy,
			},
			awardedValues: {
				assessedValue: reportData.valuationBooking.vehicleValue.assessedValue,
				marketValue: reportData.valuationBooking.vehicleValue.marketValue,
				forcedValue: reportData.valuationBooking.vehicleValue.forcedSaleValue,
				windscreenValue: reportData.valuationBooking.vehicleValue.windscreenValue,
			},
		};
		return sendSuccessResponse(event, cleanedResponse);
	} catch (err) {
		console.log(err);
		return sendErrorResponse(event, err);
	}
});
