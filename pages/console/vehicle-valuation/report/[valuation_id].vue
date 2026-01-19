<template>
	<div class="console-layout-spacing laptop:grid-cols-2 grid h-fit grid-cols-1 gap-10 pb-5">
		<div
			class="laptop-lg:flex-row laptop-lg:space-x-10 laptop-lg:space-y-0 col-span-2 flex flex-col space-y-10">
			<div
				class="laptop-lg:w-1/2 h-[31rem] w-full rounded-lg border-[.5px] bg-white shadow-md outline-none">
				<div class="flex items-center justify-between px-8 py-5">
					<div class="space-y-3">
						<h2 class="text-gray-600">{{ valuationReport.valuationId }}</h2>
						<h1 class="text-2xl font-bold">{{ valuationReport.regNo }}</h1>
					</div>
					<div>
						<a
							:href="valuationReport.reportURL"
							target="_blank"
							class="generic-form-submit h-[50px] text-base"
							>Download Report</a
						>
					</div>
				</div>
				<hr class="border-[.5px]" />
				<div class="flex h-fit items-center px-10 py-5">
					<img
						:src="valuationReport.vehiclePhotos[0]"
						alt="Vehicle Image"
						class="size-52 rounded-md border shadow-sm" />
					<div class="flex h-52 flex-grow flex-col justify-end px-5">
						<span class="text-lg font-semibold">{{ valuationReport.clientName }}</span>
						<span class="text-lg tracking-wide text-gray-600">{{
							valuationReport.vehicleMake
						}}</span>
						<span class="text-gray-500">{{ valuationReport.vehicleType }}</span>
						<span class="text-gray-500">{{ valuationReport.policyNumber ?? '' }}</span>
					</div>
				</div>
				<div class="grid grid-cols-4 gap-x-2 px-10 py-5">
					<div>
						<h1 class="text-sm font-semibold">Insurer</h1>
						<span class="text-sm text-gray-500">{{ valuationReport.insurer }}</span>
					</div>
					<div>
						<h1 class="text-sm font-semibold">Chassis Number</h1>
						<span class="text-sm text-gray-500">{{
							valuationReport.chassisNumber
						}}</span>
					</div>
					<div>
						<h1 class="text-sm font-semibold">Engine Number</h1>
						<span class="text-sm text-gray-500">{{
							valuationReport.engineNumber
						}}</span>
					</div>
					<div>
						<h1 class="text-sm font-semibold">Mileage</h1>
						<span class="text-sm text-gray-500"
							>{{ valuationReport.inspection.mileage.reading }}
							{{ valuationReport.inspection.mileage.units }}</span
						>
					</div>
				</div>
			</div>
			<div
				class="laptop-lg:w-1/2 thin-scrollbar h-[31rem] w-full overflow-y-scroll rounded-lg border-[.5px] bg-white p-10 shadow-md outline-none">
				<div class="mb-8 flex items-start space-x-4">
					<!-- the pill -->
					<div class="h-8 max-h-8 w-2 max-w-2 min-w-2 rounded-full bg-blue-500"></div>
					<div class="h-fit min-h-32 flex-grow">
						<h1 class="font-semibold">Front Section Condition</h1>
						<p class="mt-3 text-sm text-gray-500">
							{{ valuationReport.inspection.frontSectionComment }}
						</p>
					</div>
				</div>
				<div class="mb-8 flex items-start space-x-4">
					<!-- the pill -->
					<div class="h-8 max-h-8 w-2 max-w-2 min-w-2 rounded-full bg-red-500"></div>
					<div class="h-fit min-h-32 flex-grow">
						<h1 class="font-semibold">Engine & Windscreen Condition</h1>
						<p class="mt-3 text-sm text-gray-500">
							{{ valuationReport.inspection.engineSectionComment }}.
							{{ valuationReport.inspection.windscreenSectionComment }}
						</p>
					</div>
				</div>
				<div class="mb-8 flex items-start space-x-4">
					<!-- the pill -->
					<div class="h-8 max-h-8 w-2 max-w-2 min-w-2 rounded-full bg-blue-500"></div>
					<div class="h-fit min-h-32 flex-grow">
						<h1 class="font-semibold">Left & Right Sides Condition</h1>
						<p class="mt-3 text-sm text-gray-500">
							{{ valuationReport.inspection.leftSideComment }}.
							{{ valuationReport.inspection.rightSideComment }}
						</p>
					</div>
				</div>
				<div class="mb-8 flex items-start space-x-4">
					<!-- the pill -->
					<div class="h-8 max-h-8 w-2 max-w-2 min-w-2 rounded-full bg-green-500"></div>
					<div class="h-fit min-h-32 flex-grow">
						<h1 class="font-semibold">Rear Side & Boot Condition</h1>
						<p class="mt-3 text-sm text-gray-500">
							{{ valuationReport.inspection.backSideComment }}
						</p>
					</div>
				</div>
				<div class="mb-8 flex items-start space-x-4">
					<!-- the pill -->
					<div class="h-8 max-h-8 w-2 max-w-2 min-w-2 rounded-full bg-pink-500"></div>
					<div class="h-fit min-h-32 flex-grow">
						<h1 class="font-semibold">Tyre & Chassis Condition</h1>
						<p class="mt-3 text-sm text-gray-500">
							{{ valuationReport.inspection.tyreCondition }}.
							{{ valuationReport.inspection.chassisCondition }}
						</p>
					</div>
				</div>
				<div class="mb-8 flex items-start space-x-4">
					<!-- the pill -->
					<div class="h-8 max-h-8 w-2 max-w-2 min-w-2 rounded-full bg-yellow-500"></div>
					<div class="h-fit min-h-32 flex-grow">
						<h1 class="font-semibold">Interior & Dashboard Condition</h1>
						<p class="mt-3 text-sm text-gray-500">
							{{ valuationReport.inspection.interiorComment }}.
							{{ valuationReport.inspection.dashboardComment }}
						</p>
					</div>
				</div>
				<div class="mb-8 flex items-start space-x-4">
					<!-- the pill -->
					<div class="h-8 max-h-8 w-2 max-w-2 min-w-2 rounded-full bg-gray-500"></div>
					<div class="h-fit min-h-32 flex-grow">
						<h1 class="font-semibold">Mechanical & Electrical Condition</h1>
						<p class="mt-3 text-sm text-gray-500">
							{{ valuationReport.inspection.electicalSectionComment }}.
							{{ valuationReport.inspection.mechanicalSectionComment }}
						</p>
					</div>
				</div>
				<div class="mb-8 flex items-start space-x-4">
					<!-- the pill -->
					<div class="h-8 max-h-8 w-2 max-w-2 min-w-2 rounded-full bg-violet-500"></div>
					<div class="h-fit min-h-32 flex-grow">
						<h1 class="font-semibold">General Condition & Remedy</h1>
						<p class="mt-3 text-sm text-gray-500">
							{{ valuationReport.inspection.generalCondition }}.
							{{ valuationReport.inspection.remedy }}
						</p>
					</div>
				</div>
			</div>
		</div>

		<div
			class="laptop-lg:grid-cols-4 tablet:grid-cols-2 col-span-2 grid grid-cols-1 gap-10 rounded-lg">
			<div
				class="flex h-24 items-center space-x-4 rounded-lg border-[.5px] bg-white px-8 shadow-md outline-none">
				<div
					class="flex size-12 items-center justify-center rounded-full bg-blue-500 text-white">
					<WalletIcon classes="text-inherit" />
				</div>
				<div class="flex-grow">
					<h1 class="text-sm font-semibold text-gray-600">Assessed Value</h1>
					<span class="text-lg font-semibold text-blue-700">{{
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
				class="flex h-24 items-center space-x-4 rounded-lg border-[.5px] bg-white px-8 shadow-md outline-none">
				<div
					class="flex size-12 items-center justify-center rounded-full bg-green-500 text-white">
					<WalletIcon classes="text-inherit" />
				</div>
				<div class="flex-grow">
					<h1 class="text-sm font-semibold text-gray-600">Market Value</h1>
					<span class="text-lg font-semibold text-blue-700">{{
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
				class="flex h-24 items-center space-x-4 rounded-lg border-[.5px] bg-white px-8 shadow-md outline-none">
				<div
					class="flex size-12 items-center justify-center rounded-full bg-purple-500 text-white">
					<WalletIcon classes="text-inherit" />
				</div>
				<div class="flex-grow">
					<h1 class="text-sm font-semibold text-gray-600">Forced Value</h1>
					<span class="text-lg font-semibold text-blue-700">{{
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
				class="flex h-24 items-center space-x-5 rounded-lg border-[.5px] bg-white px-8 shadow-md outline-none">
				<div
					class="flex size-12 items-center justify-center rounded-full bg-red-500 text-white">
					<WalletIcon classes="text-inherit" />
				</div>
				<div class="flex-grow">
					<h1 class="text-sm font-semibold text-gray-600">Windscreen Value</h1>
					<span class="text-lg font-semibold text-blue-700">{{
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
		<div
			class="laptop-lg:flex-row laptop-lg:space-x-5 col-span-2 flex h-200 flex-col space-y-5 outline-none">
			<div
				class="laptop-lg:w-[15%] laptop-lg:flex-col laptop-lg:space-y-3 thin-scrollbar flex h-full max-h-full min-h-52 space-x-3 overflow-y-scroll">
				<img
					v-for="(i, index) in valuationReport.vehiclePhotos"
					:key="index"
					:src="i"
					alt="Vehicle Image"
					class="laptop:w-[15rem] laptop:h-52 w-72 cursor-pointer rounded-md object-cover"
					:class="activeImage === index && 'border-2 border-pink-600'"
					@click="activeImage = index" />
			</div>
			<div class="relative h-full max-h-full flex-grow border shadow-md">
				<div
					class="absolute bottom-0 flex h-12 w-full items-center space-x-2 bg-gray-500/50 px-4 text-white">
					<span>Vehicle Pictures</span>
					<span>({{ valuationReport.regNo }})</span>
				</div>
				<button
					class="absolute top-2 right-2 flex size-12 items-center justify-center rounded-full bg-blue-600 text-white"
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

		<!-- chat with AI button -->

		<!-- chat trigger button -->
		<button
			class="ai-chat-button fixed right-8 bottom-8"
			type="button"
			@click="isChatOpen = !isChatOpen">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				class="text-slate-100">
				<g fill="none">
					<path
						d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path>
					<path
						fill="currentColor"
						d="M9.107 5.448c.598-1.75 3.016-1.803 3.725-.159l.06.16l.807 2.36a4 4 0 0 0 2.276 2.411l.217.081l2.36.806c1.75.598 1.803 3.016.16 3.725l-.16.06l-2.36.807a4 4 0 0 0-2.412 2.276l-.081.216l-.806 2.361c-.598 1.75-3.016 1.803-3.724.16l-.062-.16l-.806-2.36a4 4 0 0 0-2.276-2.412l-.216-.081l-2.36-.806c-1.751-.598-1.804-3.016-.16-3.724l.16-.062l2.36-.806A4 4 0 0 0 8.22 8.025l.081-.216zM19 2a1 1 0 0 1 .898.56l.048.117l.35 1.026l1.027.35a1 1 0 0 1 .118 1.845l-.118.048l-1.026.35l-.35 1.027a1 1 0 0 1-1.845.117l-.048-.117l-.35-1.026l-1.027-.35a1 1 0 0 1-.118-1.845l.118-.048l1.026-.35l.35-1.027A1 1 0 0 1 19 2"></path>
				</g>
			</svg>
			<span class="text-slate-100">Ask AVA</span>
		</button>

		<!-- chat interface -->
		<div
			:class="[
				'fixed right-8 bottom-22 h-[32rem] w-96 rounded-lg border-2 border-gray-500 bg-white shadow-sm outline-none',
			]"
			v-if="isChatOpen">
			<AIChatHelper
				:booking_id="valuationReport.valuationId"
				:report_url="valuationReport.reportURL"
				report_type="VALUATION" />
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'vehicle-valuation-report',
		layout: 'console-layout',
	});

	const { valuationReport, activeImage, imageStretched } = useValuationReportDownloader();
	const { isChatOpen } = useAIChat();
</script>
