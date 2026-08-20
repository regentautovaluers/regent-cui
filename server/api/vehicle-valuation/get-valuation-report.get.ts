import { SlimmedValuationReport } from "~~/shared/types/valuation-report";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { valuationId }: { valuationId: string } = getQuery(event);

  let endpoint = `${config.VALUATION_BASE_URL}/api/v1/final/get-inspection-details?valuationId=${valuationId}`;

  try {
    const response = await makeProxyRequest<GenericResponse<ValuationReport>>(
      endpoint,
      event,
    );

    const reportData = response.data;
    const cleanedResponse: SlimmedValuationReport = {
      reportURL: reportData.valuationBooking.reportURL,
      insurerName: reportData.engineAndWindscreenFinal.insurerName,
      valuationId: reportData.valuationBooking.valuationId,
      regNo: reportData.valuationBooking.regNo,
      clientName: reportData.valuationBooking.clientName,
      vehicleMake: reportData.vehicleMake,
      vehicleType: reportData.vehicleType,
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
      sectionComments: [
        { name: "Tyre Condition", chipColor: "orange", value: "hello world" },
        { name: "Extras", chipColor: "pink", value: reportData.extras },
        {
          name: "Mechanical Condition",
          chipColor: "red",
          value:
            reportData.mechanicalAndElectricalFinal.generalMechanicalRemarks,
        },
        {
          name: "Electrical Condition",
          chipColor: "blue",
          value:
            reportData.mechanicalAndElectricalFinal.generalElectricalRemarks,
        },
      ],
      mileage: {
        reading: reportData.interiorFinal.odometerCurrentReading,
        units: reportData.interiorFinal.odometerReadingUnits,
      },
      generalCondition: reportData.generalCondition,
      remedy: reportData.remedy,
      vehicleValue: reportData.valuationBooking.vehicleValue,
    };
    return sendSuccessResponse(cleanedResponse);
  } catch (err) {
    console.log(err);
    return sendErrorResponse(err);
  }
});
