<template>
	<!-- <h1 class="text-2xl">
		Selected agency/ corp: {{ getSelectedCorpOrBroker }} and ref: {{ agencyOrCorp.name }}
	</h1> -->
	<form @submit.prevent="createAuthorizationLetter">
		<div class="mt-5 flex flex-col space-x-0 space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
			<!-- Registration Number -->
			<div class="w-full lg:w-1/3">
				<label
					for="registration-number"
					class="generic-input-label generic-input-required-label"
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
			<!-- Client Name -->
			<div class="w-full lg:w-1/3">
				<label
					for="client-name"
					class="generic-input-label generic-input-required-label"
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
			<!-- Client Phone Number -->
			<div class="w-full lg:w-1/3">
				<label
					for="client-phone"
					class="generic-input-label generic-input-required-label"
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
				<p>
					If you fail to choose a preffered Regent Branch to direct your request for
					valuation to, the request will be sent to Customer Care. If your preferred
					branch is not showing up here, please 'Refresh List' or contact us for support.
				</p>
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
				for="preffered-branch"
				class="generic-input-label"
				>Preferred Regent Branch</label
			>
			<select
				class="generic-input"
				id="preffered-branch"
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
				>Extra Instructions</label
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
				<label class="generic-input-label">{{
					isPrincipalBroker() ? 'Select Corporate' : 'Select Broker / Agency'
				}}</label>
				<button
					type="button"
					id="officer-name"
					class="generic-input text-start"
					@click="emits('open-search-agent-corp-modal')">
					{{ agencyOrCorp.name }}
				</button>
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
				class="auth-letter-file-input border-gray-400 bg-opacity-50"
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
							handleFileUpload(
								(e.target as HTMLInputElement)?.files?.[0] as File,
								'Logbook',
							);
							logbookUploaded = true;
						}
					" />
			</label>

			<!-- KRA PIN -->
			<label
				for="kra-pin"
				class="auth-letter-file-input ml-3 border-gray-400 bg-opacity-50"
				:class="
					kraPinUploaded ? 'bg-green-500 text-green-500' : 'bg-blue-400 text-blue-500'
				">
				<span>KRA PIN</span>
				<input
					id="kra-pin"
					type="file"
					accept=".jpg, .jpeg, .png, .pdf, .webp, .doc, .docx"
					class="hidden"
					@change.prevent="
						(e) => {
							handleFileUpload(
								(e.target as HTMLInputElement)?.files?.[0] as File,
								'KRA PIN',
							);
							kraPinUploaded = true;
						}
					" />
			</label>

			<!-- National ID -->
			<label
				for="national-id"
				class="auth-letter-file-input ml-3 border-gray-400 bg-opacity-50"
				:class="
					natIdUploaded ? 'bg-green-500 text-green-500' : 'bg-blue-400 text-blue-500'
				">
				<span>National ID</span>
				<input
					id="national-id"
					type="file"
					accept=".jpg, .jpeg, .png, .pdf, .webp, .doc, .docx"
					class="hidden"
					@change.prevent="
						(e) => {
							handleFileUpload(
								(e.target as HTMLInputElement)?.files?.[0] as File,
								'National ID',
							);
							natIdUploaded = true;
						}
					" />
			</label>

			<!-- Certificate of Registration -->
			<label
				for="cert-of-registration"
				class="auth-letter-file-input ml-3 border-gray-400 bg-opacity-50"
				:class="certUploaded ? 'bg-green-500 text-green-500' : 'bg-blue-400 text-blue-500'">
				<span>Certificate of Incorporation</span>
				<input
					id="cert-of-registration"
					type="file"
					accept=".jpg, .jpeg, .png, .pdf, .webp, .doc, .docx"
					class="hidden"
					@change.prevent="
						(e) => {
							handleFileUpload(
								(e.target as HTMLInputElement)?.files?.[0] as File,
								'Certificate of Registration',
							);
							certUploaded = true;
						}
					" />
			</label>

			<!-- Authority Letter -->
			<label
				for="authority-letter"
				class="auth-letter-file-input border-gray-400 bg-opacity-50 md:ml-3"
				:class="
					letterUploaded ? 'bg-green-500 text-green-500' : 'bg-blue-400 text-blue-500'
				">
				<span>Authority Letter</span>
				<input
					id="authority-letter"
					type="file"
					accept=".jpg, .jpeg, .png, .pdf, .webp, .doc, .docx"
					class="hidden"
					@change.prevent="
						(e) => {
							handleFileUpload(
								(e.target as HTMLInputElement)?.files?.[0] as File,
								'Authority Letter',
							);
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
	const emits = defineEmits(['open-search-agent-corp-modal']);
	const {
		registrationNumber,
		clientName,
		clientPhone,
		preferredBranch,
		comments,
		policyNumber,
		agencyOrCorp,
		createAuthorizationLetterLoading,
		logbookUploaded,
		kraPinUploaded,
		natIdUploaded,
		certUploaded,
		letterUploaded,
		createAuthorizationLetter,
		handleFileUpload,
		getSelectedCorpOrBroker,
	} = useAuthorityLetters();
	const { isPrincipalBroker } = useAuth();
</script>
