<template>
	<form @submit.prevent="createAuthorizationLetter">
		<div class="mt-5 flex flex-col space-x-0 space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
			<!-- Registration Number -->
			<div class="w-full lg:w-1/3">
				<label
					for="registration-number"
					class="generic-input-label after:ml-0.5 after:text-gray-600 after:content-['*']"
					>Registration Number</label
				>
				<input
					type="text"
					id="registration-number"
					class="generic-input"
					placeholder="e.g KDH 908Y"
					required
					v-model="registrationNumber" />
			</div>
			<!-- Customer Name -->
			<div class="w-full lg:w-1/3">
				<label
					for="client-name"
					class="generic-input-label after:ml-0.5 after:text-gray-600 after:content-['*']"
					>Client Name</label
				>
				<input
					type="text"
					id="client-name"
					class="generic-input"
					placeholder="e.g Janet Wangari Thuo"
					required
					v-model="clientName" />
			</div>
			<!-- Customer Phone Number -->
			<div class="w-full lg:w-1/3">
				<label
					for="client-phone"
					class="generic-input-label after:ml-0.5 after:text-gray-600 after:content-['*']"
					>Client Phone Number</label
				>
				<input
					type="text"
					id="client-phone"
					class="generic-input"
					placeholder="e.g 254789261947"
					required
					v-model="clientPhone" />
			</div>
		</div>
		<!-- Preffered Regent Branch -->
		<div
			id="alert-additional-content-4"
			class="mt-4 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800"
			role="alert">
			<div class="flex items-center">
				<svg
					class="me-2 h-4 w-4 flex-shrink-0"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 20 20">
					<path
						d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
				</svg>
				<span class="sr-only">Info</span>
				<h3 class="text-lg font-medium">Notice On Regent Branches</h3>
			</div>
			<div class="mb-4 mt-2">
				If you fail to choose a preffered Regent Branch to direct your request for valuation
				to, the request will be sent to Customer Care. If your preferred branch is not
				showing up here, please 'Refresh List' or contact us for support.
			</div>
			<div class="flex">
				<button
					type="button"
					class="rounded-lg border border-yellow-800 bg-transparent px-3 py-1.5 text-center font-medium text-yellow-800 hover:bg-yellow-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-yellow-300"
					@click.prevent="refreshRegentBranches">
					Refresh List
				</button>
			</div>
		</div>
		<div class="relative mt-2 flex w-full flex-col">
			<label
				for="fuel-type"
				class="generic-input-label"
				>Preferred Regent Branch</label
			>
			<select
				class="generic-input"
				id="fuel-type"
				v-model="preferredBranch">
				<option
					:value="''"
					selected>
					Send to Customer Care
				</option>
				<option
					v-for="(branch, index) in regentBranches"
					:key="index"
					:value="branch.branchId">
					{{ branch.branchName }}
				</option>
			</select>
			<FormSubmissionLoader
				classes="mr-2 absolute right-0 top-[52%] right-6 size-5 animate-spin text-gray-500"
				v-if="fetchStatus === 'pending'" />
		</div>
		<!-- comments -->
		<div class="mt-5">
			<label
				for="comments"
				class="generic-input-label"
				>Comments</label
			>
			<textarea
				id="comments"
				class="block w-full rounded-lg border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
				rows="8"
				placeholder="Provide optional comments for this request."
				v-model="comments"></textarea>
		</div>
		<!-- data below the comments box -->
		<div class="mt-5 flex flex-col space-x-0 space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
			<!-- Policy Number -->
			<div class="w-full lg:w-1/3">
				<label
					for="policy-number"
					class="generic-input-label"
					>Policy Number</label
				>
				<input
					type="text"
					id="policy-number"
					class="generic-input"
					placeholder="e.g MGL/07/080/00/489586/2020"
					v-model="policyNumber" />
			</div>
			<!-- Officer Name -->
			<div class="w-full lg:w-1/3">
				<label
					for="officer-name"
					class="generic-input-label"
					>Agency / Broker / Bank Officer</label
				>
				<input
					type="text"
					id="officer-name"
					class="generic-input"
					placeholder="e.g Esther Kasele"
					v-model="agencyName" />
			</div>
			<!-- Authorized By -->
			<div class="w-full lg:w-1/3">
				<label
					for="authorized-by"
					class="generic-input-label"
					>Authorized By</label
				>
				<input
					type="text"
					id="authorized-by"
					class="generic-input"
					disabled
					:value="getPrincipal.username" />
			</div>
		</div>

		<!-- documents -->
		<h1 class="my-2 text-lg font-semibold">Related Documents</h1>

		<div class="flex flex-wrap items-center space-y-2 md:space-y-0">
			<!-- Logbook -->
			<label
				for="vehicle-logbook"
				class="w-fit cursor-pointer rounded-full border-[1.9px] border-dashed border-gray-400 bg-opacity-50 px-4 py-2 hover:border-gray-600"
				:class="
					logbookUploaded ? 'bg-green-500 text-green-500' : 'bg-blue-400 text-blue-500'
				">
				<span>Vehicle Logbook</span>
				<input
					id="vehicle-logbook"
					type="file"
					accept=".jpg, .jpeg, .png, .pdf, .webp, .doc, .docx"
					class="hidden"
					@change.prevent="
						(e) => {
							handleFileUpload('logbook', e.target?.files[0], 'logbook');
							logbookUploaded = true;
						}
					" />
			</label>

			<!-- KRA PIN -->
			<label
				for="kra-pin"
				class="ml-3 w-fit cursor-pointer rounded-full border-[1.9px] border-dashed border-gray-400 bg-blue-400 bg-opacity-50 px-4 py-2 hover:border-gray-600">
				<span class="text-blue-500">KRA PIN</span>
				<input
					id="kra-pin"
					type="file"
					accept=".jpg, .jpeg, .png, .pdf, .webp, .doc, .docx"
					class="hidden"
					@change.prevent="
						(e) => {
							handleFileUpload('pin', e.target?.files[0], 'pin');
							kraPinUploaded = true;
						}
					" />
			</label>

			<!-- National ID -->
			<label
				for="national-id"
				class="ml-3 w-fit cursor-pointer rounded-full border-[1.9px] border-dashed border-gray-400 bg-blue-400 bg-opacity-50 px-4 py-2 hover:border-gray-600">
				<span class="text-blue-500">National ID</span>
				<input
					id="national-id"
					type="file"
					accept=".jpg, .jpeg, .png, .pdf, .webp, .doc, .docx"
					class="hidden"
					@change.prevent="
						(e) => {
							handleFileUpload('natid', e.target?.files[0], 'natid');
							natIdUploaded = true;
						}
					" />
			</label>

			<!-- Certificate of Registration -->
			<label
				for="cert-of-registration"
				class="ml-3 w-fit cursor-pointer rounded-full border-[1.9px] border-dashed border-gray-400 bg-blue-400 bg-opacity-50 px-4 py-2 hover:border-gray-600">
				<span class="text-blue-500">Certificate of Registration</span>
				<input
					id="cert-of-registration"
					type="file"
					accept=".jpg, .jpeg, .png, .pdf, .webp, .doc, .docx"
					class="hidden"
					@change.prevent="
						(e) => {
							handleFileUpload('regcert', e.target?.files[0], 'regcert');
							certUploaded = true;
						}
					" />
			</label>

			<!-- Authority Letter -->
			<label
				for="authority-letter"
				class="w-fit cursor-pointer rounded-full border-[1.9px] border-dashed border-gray-400 bg-blue-400 bg-opacity-50 px-4 py-2 hover:border-gray-600 md:ml-3">
				<span class="text-blue-500">Authority Letter</span>
				<input
					id="authority-letter"
					type="file"
					accept=".jpg, .jpeg, .png, .pdf, .webp, .doc, .docx"
					class="hidden"
					@change.prevent="
						(e) => {
							handleFileUpload('authletter', e.target?.files[0], 'authletter');
							letterUploaded = true;
						}
					" />
			</label>
		</div>

		<!-- submit button -->
		<button
			type="submit"
			class="generic-form-submit mt-4 w-full md:w-1/3">
			<FormSubmissionLoader
				classes="mr-2 size-6 animate-spin text-white"
				v-if="createAuthorizationLetterLoading" />
			{{ createAuthorizationLetterLoading ? $t('request_processing') : 'Submit Request' }}
		</button>
	</form>
</template>

<script setup lang="ts">
	const { regentBranches, fetchStatus, fetchError, refreshRegentBranches } = useRegentBranches();
	const { getPrincipal } = useAuth();
	const {
		registrationNumber,
		clientName,
		clientPhone,
		preferredBranch,
		comments,
		policyNumber,
		agencyName,
		createAuthorizationLetterLoading,
		logbookUploaded,
		kraPinUploaded,
		natIdUploaded,
		certUploaded,
		letterUploaded,
		createAuthorizationLetter,
		handleFileUpload,
	} = useAuthorityLetters();
</script>
