<template>
	<div class="grid h-fit grid-cols-2 gap-10 pb-5">
		<div class="rounded-lg border-[.5px] shadow-md outline-none">
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
			<div class="flex h-fit items-center p-10">
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
			<div class="grid grid-cols-4 gap-x-2 p-10">
				<div>
					<h1 class="text-lg font-semibold">Client Name</h1>
					<span class="text-gray-500">Test Name</span>
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
			<div class="grid grid-cols-3 gap-x-2 px-10 py-5">
				<div class="col-span-4">
					<h1 class="text-lg font-semibold text-gray-600">Client KYCs</h1>
				</div>
				<div
					class="rounded-lg bg-gray-100 p-3"
					v-for="(report, index) in valuationReport.kycDocuments"
					:key="index">
					<h1 class="font-semibold text-gray-700">{{ report.split(': ')[0] }}</h1>
					<a
						:href="report.split(': ')[1]"
						target="_top"
						class="text-sm text-blue-700"
						>Download</a
					>
				</div>
			</div>
		</div>
		<div class="space-y-5 rounded-lg border-[.5px] p-10 shadow-md outline-none">
			<div class="flex items-start space-x-4">
				<!-- the pill -->
				<div class="h-10 max-h-10 w-2 max-w-2 rounded-full bg-blue-500"></div>
				<div class="h-28 flex-grow">
					<h1 class="text-2xl font-semibold">Tyre Condition</h1>
					<p class="mt-3 text-gray-500">
						{{ valuationReport.inspection.tyreCondition }}
					</p>
				</div>
			</div>
			<div class="flex items-start space-x-4">
				<!-- the pill -->
				<div class="h-10 max-h-10 w-2 max-w-2 rounded-full bg-green-500"></div>
				<div class="h-28 flex-grow">
					<h1 class="text-2xl font-semibold">Extras</h1>
					<p class="mt-3 text-gray-500">
						{{ valuationReport.inspection.vehicleExtras.join(', ') }}
					</p>
				</div>
			</div>
			<div class="flex items-start space-x-4">
				<!-- the pill -->
				<div class="h-10 max-h-10 w-2 max-w-2 rounded-full bg-pink-500"></div>
				<div class="h-28 flex-grow">
					<h1 class="text-2xl font-semibold">Electrical Condition</h1>
					<p class="mt-3 text-gray-500">
						{{ valuationReport.inspection.electicalSectionComment }}
					</p>
				</div>
			</div>
			<div class="flex items-start space-x-4">
				<!-- the pill -->
				<div class="h-10 max-h-10 w-2 max-w-2 rounded-full bg-yellow-500"></div>
				<div class="h-28 flex-grow">
					<h1 class="text-2xl font-semibold">Mechanical Condition</h1>
					<p class="mt-3 text-gray-500">
						{{ valuationReport.inspection.mechanicalSectionComment }}
					</p>
				</div>
			</div>
			<div class="flex items-start space-x-4">
				<!-- the pill -->
				<div class="h-10 max-h-10 w-4 max-w-4 rounded-full bg-red-500"></div>
				<div class="h-fit flex-grow">
					<h1 class="text-2xl font-semibold">Coachwork</h1>
					<p class="mt-3 text-gray-500">
						Lorem ipsum dolor sit amet consectetur, adipisicing elit. Commodi laudantium
						iure, eligendi illo doloribus similique! Tenetur numquam reprehenderit
						laborum dolores nam, itaque cumque error nemo sapiente iure saepe hic
						repellendus!
					</p>
				</div>
			</div>
		</div>
		<div class="col-span-2 grid h-28 grid-cols-5 gap-x-10 rounded-lg">
			<div
				class="flex h-full items-center space-x-4 rounded-lg border-[.5px] px-8 shadow-md outline-none">
				<div
					class="flex size-16 items-center justify-center rounded-full bg-blue-500 text-white">
					<WalletIcon classes="text-inherit" />
				</div>
				<div class="flex-grow">
					<h1 class="text-lg font-semibold text-gray-600">Assessed Value</h1>
					<span class="text-2xl font-semibold text-blue-700">1,700,000</span>
				</div>
			</div>
			<div
				class="flex h-full items-center space-x-4 rounded-lg border-[.5px] px-8 shadow-md outline-none">
				<div
					class="flex size-16 items-center justify-center rounded-full bg-yellow-500 text-white">
					<WalletIcon classes="text-inherit" />
				</div>
				<div class="flex-grow">
					<h1 class="text-lg font-semibold text-gray-600">Windscreen Value</h1>
					<span class="text-2xl font-semibold text-blue-700">1,700,000</span>
				</div>
			</div>
			<div
				class="flex h-full items-center space-x-4 rounded-lg border-[.5px] px-8 shadow-md outline-none">
				<div
					class="flex size-16 items-center justify-center rounded-full bg-green-500 text-white">
					<WalletIcon classes="text-inherit" />
				</div>
				<div class="flex-grow">
					<h1 class="text-lg font-semibold text-gray-600">Market Value</h1>
					<span class="text-2xl font-semibold text-blue-700">1,700,000</span>
				</div>
			</div>
			<div
				class="flex h-full items-center space-x-4 rounded-lg border-[.5px] px-8 shadow-md outline-none">
				<div
					class="flex size-16 items-center justify-center rounded-full bg-purple-500 text-white">
					<WalletIcon classes="text-inherit" />
				</div>
				<div class="flex-grow">
					<h1 class="text-lg font-semibold text-gray-600">Forced Sale Value</h1>
					<span class="text-2xl font-semibold text-blue-700">1,700,000</span>
				</div>
			</div>
			<div
				class="flex h-full items-center space-x-4 rounded-lg border-[.5px] px-8 shadow-md outline-none">
				<div
					class="flex size-16 items-center justify-center rounded-full bg-red-500 text-white">
					<WalletIcon classes="text-inherit" />
				</div>
				<div class="flex-grow">
					<h1 class="text-lg font-semibold text-gray-600">Note Value</h1>
					<span class="text-2xl font-semibold text-blue-700">1,700,000</span>
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
					class="h-48 max-h-48 w-full cursor-pointer rounded-sm object-cover"
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
					class="size-full rounded-sm"
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

	const { valuationReport } = useCorporateValuationReport();
	const imageStretched: Ref<boolean> = ref(true);
	const activeImage: Ref<number> = ref(0);
</script>
