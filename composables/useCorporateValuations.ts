export const useCorporateValuations = () => {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const { name: routeName, params: routeParams } = useRoute();

	const activeView: Ref<string> = ref('pending');

	// for fetching corp valuations
	const page: Ref<number> = ref(0);
	const pageSize: number = 10;
	const corpValuations: Ref<any[]> = ref([]);
	const totalPages: Ref<number> = ref(0);
	const searchRegNo: Ref<string> = ref('');

	const {
		status: fetchValuationsStatus,
		execute: executeFetchValuations,
		error: fetchValuationsError,
	} = useFetch(
		() => {
			let requestURL = `/api/v1/valuation/booking/get-all?corpId=${getPrincipal.value.corpId}&page=${page.value}&size=${pageSize}`;

			if (routeName == 'vehicle-valuation-tampered-vehicles') {
				requestURL = requestURL + `&isVehicleTampered=true`;
			}

			if (searchRegNo.value !== '') {
				requestURL = requestURL + `&registrationNumber=${searchRegNo.value}`;
			}

			return requestURL;
		},
		{
			key: 'corporate-valuations',
			baseURL: runtimeConfig.public.VALUATION_BASE_URL,
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
			server: false,
			lazy: true,
			onResponse({ response }) {
				if (response.status === 200 && response._data.data !== null) {
					const data = response._data.data;
					corpValuations.value = data;
					const extras = response._data.requestExtras;
					totalPages.value = extras.totalPages;
				}
			},
		},
	) as any;

	return {
		activeView,
		fetchValuationsStatus,
		fetchValuationsError,
		corpValuations,
		totalPages,
		page,
		executeFetchValuations,
	};
};

export const useCorporateValuationReport = () => {
	const { params: routeParams } = useRoute();
	const runtimeConfig = useRuntimeConfig();

	const collateInspectionPictures = (
		frontPhotos: string[],
		enginePhotos: string[],
		windscreenPhotos: string[],
		rightPhotos: string[],
		backPhotos: string[],
		bootPhotos: [],
		leftPhotos: any[],
		chassisPhotos: string[],
		tyrePhotos: string[],
		upholsteryPhotos: string[],
		odometerPhotos: [],
	): string[] => {
		return [
			...frontPhotos,
			...enginePhotos,
			...windscreenPhotos,
			...rightPhotos,
			...backPhotos,
			...bootPhotos,
			...leftPhotos,
			...chassisPhotos,
			...tyrePhotos,
			...upholsteryPhotos,
			...odometerPhotos,
		];
	};

	const { data: valuationReport } = useFetch(
		`/api/v1/final/get-inspection-details?valuationId=${routeParams.valuation_id}`,
		{
			key: 'valuation-report',
			baseURL: runtimeConfig.public.VALUATION_BASE_URL,
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
			server: true,
			transform: (report: any) => {
				const reportData = report.data;
				const valuationBooking = reportData.valuationBooking;
				return {
					reportURL: valuationBooking.reportURL,
					valuationId: valuationBooking.valuationId,
					regNo: valuationBooking.regNo,
					clientName: valuationBooking.clientName,
					vehicleMake: valuationBooking.vehicleMake,
					vehicleType: valuationBooking.vehicleType,
					kycDocuments: valuationBooking.uploadedDocuments,
					engineNumber: reportData.engineAndWindscreenFinal.engineNumber,
					chassisNumber: reportData.tyreAndChassisFinal.chassisNumber,
					vehiclePhotos: collateInspectionPictures(
						reportData.frontFinal.frontPhotos,
						reportData.engineAndWindscreenFinal.enginePhotos,
						reportData.engineAndWindscreenFinal.windscreenPhotos,
						reportData.rightSideFinal.rightSidePhotos,
						reportData.backSideFinal.backPhotos,
						reportData.backSideFinal.bootPhotos,
						reportData.leftSideFinal.leftSidePhotos,
						reportData.tyreAndChassisFinal.chassisPhotos,
						reportData.tyreAndChassisFinal.tyrePhotos,
						reportData.interiorFinal.upholsteryPhotos,
						reportData.interiorFinal.odometerPhotos,
					),
					inspection: {
						mechanicalSectionComment:
							reportData.mechanicalAndElectricalFinal.mechanicalGeneratedComment,
						electicalSectionComment:
							reportData.mechanicalAndElectricalFinal.electricalGeneratedComment,
						vehicleExtras: reportData.extras,
						tyreCondition: reportData.tyreAndChassisFinal.tyreGeneratedComment,
						mileage: {
							reading: reportData.interiorFinal.odometerCurrentReading,
							units: reportData.interiorFinal.odometerReadingUnits,
						},
					},
				};
			},
		},
	) as any;

	return {
		valuationReport,
	};
};
