<template>
	<div class="console-layout-padding grid h-fit grid-cols-2 gap-10 pb-5">
		<div class="min-h-[50.5rem] rounded-lg border-[.5px] shadow-md outline-none">
			<div class="flex items-center justify-between p-10">
				<div class="space-y-3">
					<h2 class="text-gray-600">{{ valuationReport.valuationId }}</h2>
					<h1 class="text-4xl font-bold">{{ valuationReport.regNo }}</h1>
				</div>
				<div>
					<a
						:href="valuationReport.reportURL"
						target="_blank"
						class="generic-form-submit text-base"
						>Download Report</a
					>
				</div>
			</div>
			<hr class="border-[.5px]" />
			<div class="flex h-fit items-center px-10 py-5">
				<img
					:src="valuationReport.vehiclePhotos[0]"
					alt="Vehicle Image"
					class="size-64 rounded-md border object-cover shadow-sm" />
				<div class="flex h-52 flex-grow flex-col justify-end px-5">
					<span class="text-2xl font-semibold">{{ valuationReport.clientName }}</span>
					<span class="text-xl tracking-wide text-gray-600">{{
						valuationReport.vehicleMake
					}}</span>
					<span class="text-lg text-gray-500">{{ valuationReport.vehicleType }}</span>
					<span class="text-lg text-gray-500">ABCD/1234/RTYU/XYZ</span>
				</div>
			</div>
			<div class="grid grid-cols-4 gap-x-2 px-10 py-5">
				<div>
					<h1 class="text-lg font-semibold">Insurer</h1>
					<span class="text-gray-500">{{ valuationReport.insurer }}</span>
				</div>
				<div>
					<h1 class="text-lg font-semibold">Chassis Number</h1>
					<span class="text-gray-500">{{ valuationReport.chassisNumber }}</span>
				</div>
				<div>
					<h1 class="text-lg font-semibold">Engine Number</h1>
					<span class="text-gray-500">{{ valuationReport.engineNumber }}</span>
				</div>
				<div>
					<h1 class="text-lg font-semibold">Mileage</h1>
					<span class="text-gray-500"
						>{{ valuationReport.inspection.mileage.reading }}
						{{ valuationReport.inspection.mileage.units }}</span
					>
				</div>
			</div>

			<!-- kyc -->
			<div class="grid grid-cols-3 gap-2 px-10 py-5">
				<div class="col-span-3">
					<h1 class="font-semibold text-gray-600">Client KYCs</h1>
				</div>
				<div
					class="bg rounded-lg border-[1px] border-yellow-500 bg-yellow-100/50 p-3"
					v-for="(report, index) in valuationReport.kycDocuments"
					:key="index">
					<h1 class="font-semibold text-yellow-700">{{ report.split(': ')[0] }}</h1>
					<a
						:href="report.split(': ')[1]"
						target="_top"
						class="text-sm text-blue-700"
						>Download</a
					>
				</div>
			</div>
		</div>
		<div
			class="max-h-[50rem] min-h-[50.5rem] space-y-5 overflow-y-scroll rounded-lg border-[.5px] p-10 shadow-md outline-none">
			<div class="mb-8 flex items-start space-x-4">
				<!-- the pill -->
				<div class="h-10 max-h-10 w-2 min-w-2 max-w-2 rounded-full bg-blue-500"></div>
				<div class="h-fit min-h-32 flex-grow">
					<h1 class="text-2xl font-semibold">Front Section Condition</h1>
					<p class="mt-3 text-gray-500">
						{{ valuationReport.inspection.frontSectionComment }}
					</p>
				</div>
			</div>
			<div class="mb-8 flex items-start space-x-4">
				<!-- the pill -->
				<div class="h-10 max-h-10 w-2 min-w-2 max-w-2 rounded-full bg-red-500"></div>
				<div class="h-fit min-h-32 flex-grow">
					<h1 class="text-2xl font-semibold">Engine & Windscreen Condition</h1>
					<p class="mt-3 text-gray-500">
						{{ valuationReport.inspection.engineSectionComment }}.
						{{ valuationReport.inspection.windscreenSectionComment }}
					</p>
				</div>
			</div>
			<div class="mb-8 flex items-start space-x-4">
				<!-- the pill -->
				<div class="h-10 max-h-10 w-2 min-w-2 max-w-2 rounded-full bg-blue-500"></div>
				<div class="h-fit min-h-32 flex-grow">
					<h1 class="text-2xl font-semibold">Left & Right Sides Condition</h1>
					<p class="mt-3 text-gray-500">
						{{ valuationReport.inspection.leftSideComment }}.
						{{ valuationReport.inspection.rightSideComment }}
					</p>
				</div>
			</div>
			<div class="mb-8 flex items-start space-x-4">
				<!-- the pill -->
				<div class="h-10 max-h-10 w-2 min-w-2 max-w-2 rounded-full bg-green-500"></div>
				<div class="h-fit min-h-32 flex-grow">
					<h1 class="text-2xl font-semibold">Rear Side & Boot Condition</h1>
					<p class="mt-3 text-gray-500">
						{{ valuationReport.inspection.backSideComment }}
					</p>
				</div>
			</div>
			<div class="mb-8 flex items-start space-x-4">
				<!-- the pill -->
				<div class="h-10 max-h-10 w-2 min-w-2 max-w-2 rounded-full bg-pink-500"></div>
				<div class="h-fit min-h-32 flex-grow">
					<h1 class="text-2xl font-semibold">Tyre & Chassis Condition</h1>
					<p class="mt-3 text-gray-500">
						{{ valuationReport.inspection.tyreCondition }}.
						{{ valuationReport.inspection.chassisCondition }}
					</p>
				</div>
			</div>
			<div class="mb-8 flex items-start space-x-4">
				<!-- the pill -->
				<div class="h-10 max-h-10 w-2 min-w-2 max-w-2 rounded-full bg-yellow-500"></div>
				<div class="h-fit min-h-32 flex-grow">
					<h1 class="text-2xl font-semibold">Interior & Dashboard Condition</h1>
					<p class="mt-3 text-gray-500">
						{{ valuationReport.inspection.interiorComment }}.
						{{ valuationReport.inspection.dashboardComment }}
					</p>
				</div>
			</div>
			<div class="mb-8 flex items-start space-x-4">
				<!-- the pill -->
				<div class="h-10 max-h-10 w-2 min-w-2 max-w-2 rounded-full bg-gray-500"></div>
				<div class="h-fit min-h-32 flex-grow">
					<h1 class="text-2xl font-semibold">Mechanical & Electrical Condition</h1>
					<p class="mt-3 text-gray-500">
						{{ valuationReport.inspection.electicalSectionComment }}.
						{{ valuationReport.inspection.mechanicalSectionComment }}
					</p>
				</div>
			</div>
			<div class="mb-8 flex items-start space-x-4">
				<!-- the pill -->
				<div class="h-10 max-h-10 w-2 min-w-2 max-w-2 rounded-full bg-violet-500"></div>
				<div class="h-fit min-h-32 flex-grow">
					<h1 class="text-2xl font-semibold">General Condition & Remedy</h1>
					<p class="mt-3 text-gray-500">
						{{ valuationReport.inspection.generalCondition }}.
						{{ valuationReport.inspection.remedy }}
					</p>
				</div>
			</div>
		</div>
		<div class="col-span-2 grid grid-cols-4 gap-x-10 rounded-lg">
			<div
				class="flex h-28 items-center space-x-4 rounded-lg border-[.5px] px-8 shadow-md outline-none">
				<div
					class="flex size-16 items-center justify-center rounded-full bg-blue-500 text-white">
					<WalletIcon classes="text-inherit" />
				</div>
				<div class="flex-grow">
					<h1 class="text-lg font-semibold text-gray-600">Assessed Value</h1>
					<span class="text-2xl font-semibold text-blue-700">{{
						valuationReport.awardedValues.assessedValue == null
							? 'N/A'
							: Intl.NumberFormat('en-US', {
									minimumFractionDigits: 0,
									maximumFractionDigits: 0,
								}).format(valuationReport.awardedValues.assessedValue)
					}}</span>
				</div>
			</div>
			<div
				class="flex h-28 items-center space-x-4 rounded-lg border-[.5px] px-8 shadow-md outline-none">
				<div
					class="flex size-16 items-center justify-center rounded-full bg-green-500 text-white">
					<WalletIcon classes="text-inherit" />
				</div>
				<div class="flex-grow">
					<h1 class="text-lg font-semibold text-gray-600">Market Value</h1>
					<span class="text-2xl font-semibold text-blue-700">{{
						valuationReport.awardedValues.marketValue == null
							? 'N/A'
							: Intl.NumberFormat('en-US', {
									minimumFractionDigits: 0,
									maximumFractionDigits: 0,
								}).format(valuationReport.awardedValues.marketValue)
					}}</span>
				</div>
			</div>

			<div
				class="flex h-28 items-center space-x-4 rounded-lg border-[.5px] px-8 shadow-md outline-none">
				<div
					class="flex size-16 items-center justify-center rounded-full bg-purple-500 text-white">
					<WalletIcon classes="text-inherit" />
				</div>
				<div class="flex-grow">
					<h1 class="text-lg font-semibold text-gray-600">Forced Value</h1>
					<span class="text-2xl font-semibold text-blue-700">{{
						valuationReport.awardedValues.forcedValue == null
							? 'N/A'
							: Intl.NumberFormat('en-US', {
									minimumFractionDigits: 0,
									maximumFractionDigits: 0,
								}).format(valuationReport.awardedValues.forcedValue)
					}}</span>
				</div>
			</div>
			<div
				class="flex h-28 items-center space-x-4 rounded-lg border-[.5px] px-8 shadow-md outline-none">
				<div
					class="flex size-16 items-center justify-center rounded-full bg-red-500 text-white">
					<WalletIcon classes="text-inherit" />
				</div>
				<div class="flex-grow">
					<h1 class="text-lg font-semibold text-gray-600">Windscreen Value</h1>
					<span class="text-2xl font-semibold text-blue-700">{{
						valuationReport.awardedValues.windscreenValue == null
							? 'N/A'
							: Intl.NumberFormat('en-US', {
									minimumFractionDigits: 0,
									maximumFractionDigits: 0,
								}).format(valuationReport.awardedValues.windscreenValue)
					}}</span>
				</div>
			</div>
		</div>
		<!-- assessment images -->
		<div class="col-span-2 flex h-[50rem] space-x-5 outline-none">
			<div class="flex h-full max-h-full w-[15%] flex-col space-y-3 overflow-y-scroll">
				<img
					v-for="(i, index) in valuationReport.vehiclePhotos"
					:key="index"
					:src="i"
					alt="Vehicle Image"
					class="max-h-48 min-h-48 w-full cursor-pointer rounded-md object-cover"
					:class="activeImage === index && 'border-2 border-pink-600'"
					@click="activeImage = index" />
			</div>
			<div class="relative h-full max-h-full flex-grow border shadow-md">
				<div
					class="absolute bottom-0 flex h-16 w-full items-center space-x-2 bg-gray-500/50 px-4 text-xl text-white">
					<span>Vehicle Pictures</span>
					<span>({{ valuationReport.regNo }})</span>
				</div>
				<button
					class="absolute right-2 top-2 flex size-12 items-center justify-center rounded-full bg-blue-600 text-white"
					@click="imageStretched = !imageStretched"
					title="Fit or Zoom">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="30"
						height="30"
						viewBox="0 0 24 24"
						class="text-inherit">
						<path
							fill="currentColor"
							fill-rule="evenodd"
							d="M6 4.75c-.69 0-1.25.56-1.25 1.25v3a.75.75 0 0 1-1.5 0V6A2.75 2.75 0 0 1 6 3.25h3a.75.75 0 0 1 0 1.5zM14.25 4a.75.75 0 0 1 .75-.75h3A2.75 2.75 0 0 1 20.75 6v3a.75.75 0 0 1-1.5 0V6c0-.69-.56-1.25-1.25-1.25h-3a.75.75 0 0 1-.75-.75M4 14.25a.75.75 0 0 1 .75.75v3c0 .69.56 1.25 1.25 1.25h3a.75.75 0 0 1 0 1.5H6A2.75 2.75 0 0 1 3.25 18v-3a.75.75 0 0 1 .75-.75m16 0a.75.75 0 0 1 .75.75v3A2.75 2.75 0 0 1 18 20.75h-3a.75.75 0 0 1 0-1.5h3c.69 0 1.25-.56 1.25-1.25v-3a.75.75 0 0 1 .75-.75"
							clip-rule="evenodd" />
					</svg>
				</button>
				<img
					:src="valuationReport.vehiclePhotos[activeImage]"
					alt="Vehicle Image"
					class="size-full rounded-md"
					:class="imageStretched && 'object-cover'" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'vehicle-valuation-report',
		layout: 'console-layout',
	});

	const { params: routeParams } = useRoute();
	const runtimeConfig = useRuntimeConfig();
	const imageStretched: Ref<boolean> = ref(true);
	const activeImage: Ref<number> = ref(0);

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

	const { data: valuationReport } = (await useFetch(
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
					insurer: reportData.engineAndWindscreenFinal.insurerName,
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
						frontSectionComment: reportData.frontFinal.generatedComment,
						engineSectionComment:
							reportData.engineAndWindscreenFinal.engineGeneratedComment,
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
						dashboardComment: reportData.interiorFinal.dashboardGeneratedComment,
						mileage: {
							reading: reportData.interiorFinal.odometerCurrentReading,
							units: reportData.interiorFinal.odometerReadingUnits,
						},
						generalCondition: reportData.generalCondition,
						remedy: reportData.remedy,
					},
					awardedValues: {
						assessedValue: valuationBooking.vehicleValue.assessedValue,
						marketValue: valuationBooking.vehicleValue.marketValue,
						forcedValue: valuationBooking.vehicleValue.forcedSaleValue,
						windscreenValue: valuationBooking.vehicleValue.windscreenValue,
					},
				};
			},
		},
	)) as any;
</script>
