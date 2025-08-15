<template>
	<form
		@submit.prevent="uploadBulkData"
		class="laptop:p-4 laptop-lg:p-8 flex flex-1 flex-col rounded-md bg-white p-2 shadow-sm border-[.5px]">
		<!-- Download Excel document -->
		<h1 class="mt-5 font-semibold text-gray-500">Download Excel Template</h1>
		<div class="flex flex-col">
			<span class="text-sm text-gray-500"
				>Kindly download our Excel template and complete all columns. Kindly refrain from
				altering the column structure or their sequence.</span
			>
			<a
				href="https://media.regentautovaluers.com/media/download/utility-media/collateral-verification/onboarding_template.xlsx"
				target="_top"
				type="button"
				class="mt-3 inline-flex h-16 w-full items-center justify-between rounded-lg border-[1.9px] border-dashed bg-pink-300 px-4 py-3 text-sm text-pink-500 backdrop-opacity-50 disabled:pointer-events-none disabled:opacity-50">
				<span> Click here to intiate excel template download </span>
				<DownloadIcon />
			</a>
		</div>
		<!-- upload Excel document -->
		<h1 class="mt-5 font-semibold text-gray-500">Upload Excel Document</h1>
		<div class="flex flex-col">
			<span class="text-sm text-gray-500"
				>Please upload the completed document to proceed with onboarding.</span
			>
			<div>
				<label
					for="dropzone-file"
					class="mt-3 flex h-16 cursor-pointer flex-col items-center justify-between rounded-lg border-[1.9px] border-dashed border-gray-400 bg-blue-300 px-4 py-3 backdrop-opacity-50">
					<div class="flex w-full items-center justify-between text-sm text-blue-500">
						<span> Click here to upload the completed Excel document </span>
						<UploadIcon />
					</div>
					<input
						id="dropzone-file"
						type="file"
						accept=".xlsx, .xls"
						class="hidden"
						@change="parseUploadedExcelFile($event)" />
				</label>
			</div>
		</div>
		<div class="mt-3">
			<span
				class="font-medium"
				:class="errorMessage.type === 'error' ? 'text-red-500' : 'text-green-500'"
				v-if="errorMessage"
				>{{ errorMessage.message }}</span
			>
			<div
				class="flex h-3 w-full overflow-hidden rounded-full bg-gray-200"
				role="progressbar"
				aria-valuenow="1"
				aria-valuemin="0"
				aria-valuemax="100">
				<div
					class="flex flex-col justify-center overflow-hidden rounded-full bg-blue-600 text-center text-xs whitespace-nowrap text-white transition duration-500"
					:style="{ width: currentProgress }" />
			</div>
			<div class="flex w-full items-center justify-between text-end text-gray-500">
				<span class="uppercase">File Parsing Progress</span>
				<span>{{ currentProgress }}</span>
			</div>
		</div>

		<div
			v-if="processedBulkData.length < 1"
			class="mt-4 flex flex-grow items-center justify-center rounded-md border-[1px]">
			<h1 class="font-sbold text-sm font-semibold text-gray-500 italic">
				Your Data Will Show Up Here
			</h1>
		</div>
		<div
			v-else
			class="mt-4 flex h-fit flex-grow">
			<div class="my-2 flex-grow">
				<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
					<table class="w-full text-left text-gray-500">
						<thead class="bg-gray-100 text-sm text-gray-700 uppercase">
							<tr>
								<th
									scope="col"
									class="table-headers">
									Reg No.
								</th>
								<th
									scope="col"
									class="table-headers">
									Color
								</th>
								<th
									scope="col"
									class="table-headers">
									Chassis No.
								</th>
								<th
									scope="col"
									class="table-headers">
									Engine No.
								</th>
								<th
									scope="col"
									class="table-headers">
									Make & Model
								</th>
								<th
									scope="col"
									class="table-headers">
									Incident Date
								</th>
							</tr>
						</thead>
						<tbody>
							<!-- the actual data -->
							<tr
								class="border-b bg-white hover:bg-gray-100"
								v-for="(entry, index) in processedBulkData"
								:key="index">
								<td class="generic-table-cell p-5 font-semibold text-blue-600">
									{{ entry.registrationNumber }}
								</td>
								<td class="generic-table-cell p-5">
									{{ entry.color }}
								</td>
								<td class="generic-table-cell p-5">
									{{ entry.chassisNumber }}
								</td>
								<td class="generic-table-cell p-5 font-semibold text-pink-600">
									{{ entry.engineNumber }}
								</td>
								<th class="generic-table-cell inline-flex space-x-1 p-5">
									<span>{{ entry.make }}</span>
									<span>{{ entry.model }}</span>
								</th>
								<td class="generic-table-cell p-5">
									{{ entry.dateOfIncident }}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<!-- submit button -->
		<button
			v-if="processedBulkData.length > 0"
			type="submit"
			:class="[
				'generic-form-submit laptop:w-1/3 mt-3 w-full',
				bulkOnboardingLoading && 'skeleton skeleton-animated',
			]"
			:disabled="errorMessage?.type == 'error'">
			{{ bulkOnboardingLoading ? 'Please Wait...' : 'Onboard Members' }}
		</button>
	</form>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'collateral-verification-bulk-onboard-fraudsters',
		layout: 'console-layout',
	});

	const {
		bulkOnboardingLoading,
		processedBulkData,
		currentProgress,
		errorMessage,
		parseUploadedExcelFile,
		uploadBulkData,
	} = useBulkOnboardDefaulters();
</script>
