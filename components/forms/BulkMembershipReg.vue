<template>
	<div class="flex-1">
		<div
			id="alert-additional-content-4"
			class="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800"
			role="alert">
			<div class="flex items-center">
				<svg
					class="me-2 h-4 w-4 shrink-0"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 20 20">
					<path
						d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
				</svg>
				<span class="sr-only">Info</span>
				<h3 class="text-sm font-medium">Notice On Client Fleets</h3>
			</div>
			<p class="mt-2 mb-4 text-sm text-wrap">
				You must have a fleet before you can add members. The members you onboard using this
				form will be linked to that fleet. If you have no fleet, click the 'Add Fleet'
				button below to add to your fleets. If your fleet is not showing up here, please
				'Refresh List' or contact us for support.
			</p>
			<div class="flex">
				<button
					type="button"
					class="me-2 inline-flex items-center rounded-lg bg-yellow-800 px-3 py-1.5 text-center text-sm font-medium text-white hover:bg-yellow-900 focus:ring-4 focus:ring-yellow-300 focus:outline-none"
					data-modal-target="add-fleet-modal"
					data-modal-toggle="add-fleet-modal"
					@click="setSidebarCollapsedState(false)">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="2em"
						height="2em"
						viewBox="0 0 24 24"
						class="me-1 size-4"
						fill="currentColor"
						aria-hidden="true">
						<path
							d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1" />
					</svg>
					Add Fleet
				</button>
				<button
					type="button"
					class="rounded-lg border border-yellow-800 bg-transparent px-3 py-1.5 text-center text-sm font-medium text-yellow-800 hover:bg-yellow-900 hover:text-white focus:ring-4 focus:ring-yellow-300 focus:outline-none"
					@click="refeshFleets()">
					Refresh List
				</button>
			</div>
		</div>

		<form @submit.prevent="registerMembersInBulk">
			<!-- Full Name Field -->
			<div class="relative">
				<label
					for="fleet-name"
					class="generic-input-label"
					>Client Fleet</label
				>
				<select
					class="generic-input"
					id="fleet-name"
					v-model="selectedFleetId"
					required>
					<option
						:value="0"
						v-if="corporateFleetData && (corporateFleetData as []).length > 0">
						Select the fleet you form the available ones
					</option>
					<option
						:value="0"
						v-else>
						No fleet available. Please add one!
					</option>
					<option
						v-for="(fleet, index) in corporateFleetData"
						:key="index"
						:value="fleet.id">
						{{ fleet.fleetname }}
					</option>
				</select>
				<FormSubmissionLoader
					class="absolute top-[52%] right-6 mr-2 size-5 animate-spin text-gray-500"
					v-if="retrievingFleetList" />
			</div>
			<div
				class="mt-7 flex flex-col items-center justify-between space-y-3 space-x-0 lg:flex-row lg:space-y-0 lg:space-x-3">
				<!-- Full Name Field -->
				<div class="w-full lg:w-1/3">
					<label
						for="contact-person-name"
						class="generic-input-label"
						>Contact Person Name</label
					>
					<input
						type="text"
						id="contact-person-name"
						disabled
						:value="computedFleetDetails?.contact_full_name"
						class="generic-input"
						placeholder="John Doe" />
				</div>

				<!-- Phone Field -->
				<div class="w-full lg:w-1/3">
					<label
						for="contact-person-phone"
						class="generic-input-label"
						>Contact Person Phone</label
					>
					<input
						type="text"
						id="contact-person-phone"
						disabled
						:value="computedFleetDetails?.contact_email"
						class="generic-input"
						placeholder="254704080056" />
				</div>

				<!-- Email field -->
				<div class="w-full lg:w-1/3">
					<label
						for="contact-person-email"
						class="generic-input-label"
						>Contact Person Email</label
					>
					<input
						type="email"
						id="contact-person-email"
						disabled
						:value="computedFleetDetails?.contact_email"
						class="generic-input"
						placeholder="youremail@co.ke" />
				</div>
			</div>

			<!-- Download Excel document -->
			<h1 class="mt-5 font-semibold text-gray-500">Download Excel Template</h1>
			<div class="flex flex-col">
				<span class="text-sm text-gray-500"
					>Kindly download our Excel template and complete all columns. Kindly refrain
					from altering the column structure or their sequence.</span
				>
				<a
					href="https://media.regentautovaluers.com/media/download/utility-media/ava-roadside-assistance/onboarding_template.xlsx"
					target="_top"
					type="button"
					class="mt-3 inline-flex h-16 w-full items-center justify-between rounded-lg border-[1.9px] border-dashed bg-pink-300 px-4 py-3 text-sm text-pink-700 backdrop-opacity-50 disabled:pointer-events-none disabled:opacity-50">
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
						class="mt-3 flex h-16 cursor-pointer flex-col items-center justify-between rounded-lg border-[1.9px] border-dashed border-gray-300 bg-blue-300 px-4 py-3 text-sm backdrop-opacity-50">
						<div class="flex w-full items-center justify-between text-blue-700">
							<span> Click here to upload the completed Excel document </span>
							<UploadIcon />
						</div>
						<input
							id="dropzone-file"
							type="file"
							accept=".xlsx"
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
			</div>

			<!-- submit button -->
			<button
				type="submit"
				:class="[
					'generic-form-submit laptop:w-1/3 mt-3 w-full',
					registerBulkMembershipsLoading && 'skeleton skeleton-animated',
				]"
				:disabled="errorMessage?.type == 'error' || processedFleetData.length == 0">
				{{ registerBulkMembershipsLoading ? 'Please Wait...' : 'Onboard Members' }}
			</button>
		</form>

		<p
			class="font-sbold mt-4 text-sm font-semibold text-gray-500"
			v-if="processedFleetData.length < 1">
			Your Data Will Show Up Here
		</p>
		<p
			class="font-sbold mt-4 text-sm font-semibold text-red-500"
			v-else-if="processedFleetData.length < 1">
			{{ errorMessage }}
		</p>
		<div
			v-else
			class="mt-4 flex h-fit flex-grow">
			<div class="my-2 flex-grow">
				<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
					<h1 class="font-bold text-gray-500">
						Discovered {{ processedFleetData.length }} vehicles.
					</h1>
					<table class="w-full text-left text-gray-500">
						<thead class="bg-gray-100 text-sm text-gray-700 uppercase">
							<tr>
								<th
									scope="col"
									class="table-headers ps-3">
									Client Name.
								</th>
								<th
									scope="col"
									class="table-headers">
									Contacts
								</th>
								<th
									scope="col"
									class="table-headers">
									Reg No.
								</th>
								<th
									scope="col"
									class="table-headers">
									Start Date
								</th>
								<th
									scope="col"
									class="table-headers">
									End Date
								</th>
							</tr>
						</thead>
						<tbody>
							<!-- the actual data -->
							<tr
								class="border-b bg-white hover:bg-gray-100"
								v-for="(entry, index) in processedFleetData"
								:key="index">
								<td class="generic-table-cell py-5 ps-3 text-gray-600">
									{{ entry.full_name }}
								</td>
								<td class="generic-table-cell py-5">
									<span>{{ entry.phone_number }}</span
									><br /><span>{{ entry.userEmail }}</span>
								</td>

								<td class="generic-table-cell py-5 font-semibold text-pink-600">
									{{ entry.registration }}
								</td>
								<th class="generic-table-cell inline-flex space-x-1 py-5">
									{{ entry.start_date }}
								</th>
								<td class="generic-table-cell py-5">
									{{ entry.end_date }}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<!-- Add Fleet modal -->
		<ParentModal
			modal-id="add-fleet-modal"
			modal-title="Add Fleet">
			<AddNewFleet />
		</ParentModal>
	</div>
</template>

<script setup lang="ts">
	const { corporateFleetData, retrievingFleetList, refeshFleets } = useFleets();
	const {
		selectedFleetId,
		computedFleetDetails,
		errorMessage,
		registerBulkMembershipsLoading,
		processedFleetData,
		parseUploadedExcelFile,
		registerMembersInBulk,
	} = useBulkMembershipRegistration();
</script>
