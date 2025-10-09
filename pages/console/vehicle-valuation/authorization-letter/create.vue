<template>
	<div class="laptop:p-4 laptop-tablet:p-8 flex flex-1 flex-col p-2">
		<form
			@submit.prevent="createAuthorizationLetter"
			class="flex flex-1 flex-col">
			<div
				class="tablet:flex-row tablet:space-y-0 tablet:space-x-4 flex flex-col space-y-4 space-x-0">
				<!-- Registration Number -->
				<div class="tablet:w-1/3 w-full">
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
				<div class="tablet:w-1/3 w-full">
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
				<div class="tablet:w-1/3 w-full">
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
						class="me-2 h-4 w-4 shrink-0"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 20 20">
						<path
							d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
					</svg>
					<span class="sr-only">Info</span>
					<h3 class="text-sm font-medium">Notice On Regent Branches</h3>
				</div>

				<p class="mt-2 mb-4 text-sm">
					If you fail to choose a preffered Regent Branch to direct your request for
					valuation to, the request will be sent to Customer Care. If your preferred
					branch is not showing up here, please 'Refresh List' or contact us for support.
				</p>
				<div class="flex">
					<button
						type="button"
						class="rounded-lg border border-yellow-800 bg-transparent px-3 py-1.5 text-center text-sm font-medium text-yellow-800 hover:bg-yellow-900 hover:text-white focus:ring-4 focus:ring-yellow-300 focus:outline-none"
						@click.prevent="refreshRegentBranches">
						Refresh List
					</button>
				</div>
			</div>

			<div
				class="tablet:flex-row tablet:space-y-0 tablet:space-x-4 flex flex-col space-y-4 space-x-0">
				<!-- select regent branch -->
				<div class="tablet:w-1/2 relative mt-2 flex w-full flex-col">
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
						<!-- TODO: Re-enable this later -->
						<!-- <option
					v-for="(branch, index) in regentBranches"
					:key="index"
					:value="branch.branchId">
					{{ branch.branchName }}
				</option> -->
					</select>
					<span
						class="icon-[svg-spinners--ring-resize] absolute top-[42px] right-8 text-2xl text-gray-500"
						v-if="fetchStatus"></span>
				</div>

				<!-- select their own branch -->
				<div class="tablet:w-1/2 relative mt-2 flex w-full flex-col">
					<label
						for="corporate-branch"
						class="generic-input-label"
						>Select A Branch</label
					>
					<select
						class="generic-input"
						id="corporate-branch"
						v-model="corporateBranch">
						<option
							v-for="(branch, index) in corporateBranches"
							:key="index"
							:value="branch.branchId"
							:selected="
								getPrincipal?.branchId != null &&
								getPrincipal?.branchId == branch.branchId
							">
							{{ branch.branchName }}
						</option>
					</select>
					<span
						class="icon-[svg-spinners--ring-resize] absolute top-[42px] right-8 text-2xl text-gray-500"
						v-if="loadingCorporateBranchesStatus == 'pending'"></span>
				</div>
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
					class="generic-text-area"
					rows="8"
					placeholder="Provide optional comments for this request."
					v-model="comments"></textarea>
			</div>
			<!-- data below the comments box -->
			<div
				class="tablet:flex-row tablet:space-y-0 tablet:space-x-4 mt-5 flex flex-col space-y-4 space-x-0">
				<!-- Policy Number -->
				<div class="tablet:w-1/3 w-full">
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
				<div class="tablet:w-1/3 relative w-full">
					<label class="generic-input-label">{{
						isPrincipalBroker() ? 'Select Corporate' : 'Select Broker / Agent'
					}}</label>
					<input
						type="text"
						id="officer-name"
						class="generic-input peer"
						:required="isPrincipalBroker()"
						placeholder="Start typing to search"
						v-model="agencyOrCorpName" />
					<span
						class="icon-[svg-spinners--ring-resize] absolute top-[42px] right-3 text-2xl text-gray-500"
						v-if="fetchingCorporateClients"></span>

					<!-- selectable entries  -->
					<div
						class="peer thin-scrollbar absolute -top-52 hidden h-52 max-h-52 w-full flex-col space-y-2 overflow-y-auto rounded-xl border border-gray-200 bg-white p-3 shadow-md peer-focus:flex hover:flex">
						<button
							class="w-full cursor-pointer rounded-md bg-gray-100 p-2 text-start text-gray-500 transition-colors duration-200 outline-none hover:bg-gray-300 hover:text-gray-700"
							type="button"
							v-for="(e, idx) in computedCorporateClients"
							:key="idx"
							@click.prevent="
								() => {
									((agencyOrCorpName = e.corpName), (agencyOrCorpId = e.corpId));
								}
							">
							{{ e.corpName }}
						</button>
					</div>
				</div>
				<!-- Authorized By -->
				<div class="tablet:w-1/3 w-full">
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
						:value="getPrincipal?.username" />
				</div>
			</div>

			<!-- documents -->
			<div
				class="mt-4 flex w-full max-w-full grid-cols-2 flex-wrap items-center space-y-2 space-x-2">
				<!-- Certificate of Registration -->
				<label
					for="cert-of-registration"
					class="auth-letter-file-input border-gray-400 backdrop-opacity-50"
					:class="
						certUploaded
							? 'border-green-300 bg-green-50 text-green-800 hover:bg-green-100'
							: 'border-yellow-300 bg-yellow-50 text-yellow-800 hover:bg-yellow-100'
					">
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

				<!-- kra pin -->
				<label
					for="kra-pin"
					class="auth-letter-file-input border-gray-400 backdrop-opacity-50"
					:class="
						kraPinUploaded
							? 'border-green-300 bg-green-50 text-green-800 hover:bg-green-100'
							: 'border-yellow-300 bg-yellow-50 text-yellow-800 hover:bg-yellow-100'
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
					class="auth-letter-file-input border-gray-400 backdrop-opacity-50"
					:class="
						natIdUploaded
							? 'border-green-300 bg-green-50 text-green-800 hover:bg-green-100'
							: 'border-yellow-300 bg-yellow-50 text-yellow-800 hover:bg-yellow-100'
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

				<label
					for="vehicle-logbook"
					class="auth-letter-file-input border-gray-400 backdrop-opacity-50"
					:class="
						logbookUploaded
							? 'border-green-300 bg-green-50 text-green-800 hover:bg-green-100'
							: 'border-yellow-300 bg-yellow-50 text-yellow-800 hover:bg-yellow-100'
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

				<!-- Authority Letter -->
				<label
					for="authority-letter"
					class="auth-letter-file-input border-gray-400 backdrop-opacity-50"
					:class="
						letterUploaded
							? 'border-green-300 bg-green-50 text-green-800 hover:bg-green-100'
							: 'border-yellow-300 bg-yellow-50 text-yellow-800 hover:bg-yellow-100'
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
				:class="[
					'generic-form-submit mt-4 w-full md:w-1/3',
					createAuthorizationLetterLoading && 'skeleton skeleton-animated',
				]">
				{{ createAuthorizationLetterLoading ? 'Please Wait...' : 'Submit Request' }}
			</button>
		</form>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'vehicle-valuation-create-authorization-letter',
		layout: 'console-layout',
	});

	const { fetchStatus, refreshRegentBranches } = useRegentBranches();
	const { getPrincipal, isPrincipalBroker } = useAuth();
	const {
		registrationNumber,
		clientName,
		clientPhone,
		preferredBranch,
		comments,
		policyNumber,
		agencyOrCorpName,
		agencyOrCorpId,
		createAuthorizationLetterLoading,
		logbookUploaded,
		kraPinUploaded,
		natIdUploaded,
		certUploaded,
		letterUploaded,
		corporateBranch,
		createAuthorizationLetter,
		handleFileUpload,
		computedCorporateClients,
		fetchingCorporateClients,
		shouldTriggerFetch,
	} = useAuthorityLetters();
	const { corporateBranches, fetchStatus: loadingCorporateBranchesStatus } = useCorporateBranch();

	onMounted(async () => await shouldTriggerFetch());
</script>
