<template>
	<div
		class="laptop:p-4 laptop-lg:p-8 flex flex-1 flex-col rounded-lg border-2 bg-white p-2 outline-none">
		<form
			@submit.prevent="createAuthorizationLetter"
			class="flex flex-1 flex-col">
			<div class="flex flex-col space-y-4 space-x-0 lg:flex-row lg:space-y-0 lg:space-x-4">
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
					<!-- TODO: Re-enable this later -->
					<!-- <option
					v-for="(branch, index) in regentBranches"
					:key="index"
					:value="branch.branchId">
					{{ branch.branchName }}
				</option> -->
				</select>
				<FormSubmissionLoader
					class="absolute top-[52%] right-6 mr-2 size-5 animate-spin text-gray-500"
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
					class="generic-text-area resize-none"
					rows="10"
					placeholder="Provide optional instructions for this request."
					v-model="comments"></textarea>
			</div>
			<!-- data below the comments box -->
			<div
				class="mt-5 flex flex-col space-y-4 space-x-0 lg:flex-row lg:space-y-0 lg:space-x-4">
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
				<div class="relative w-full lg:w-1/3">
					<label class="generic-input-label">{{
						isPrincipalBroker ? 'Select Corporate' : 'Select Broker / Agency'
					}}</label>
					<input
						type="text"
						id="officer-name"
						class="generic-input peer"
						:required="isPrincipalBroker"
						placeholder="Start typing to search"
						v-model="agencyOrCorpName" />
					<span
						class="icon-[svg-spinners--ring-resize] absolute top-[37px] right-3 text-2xl text-gray-500"
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
						:value="getPrincipal()?.username" />
				</div>
			</div>

			<!-- documents -->
			<div class="tablet:grid-cols-2 laptop:grid-cols-3 mt-4 grid grid-cols-1 gap-3">
				<template
					v-for="(name, idx) in allowedFiles"
					:key="idx">
					<div>
						<label
							class="text-heading mb-2 block text-sm font-medium text-gray-600"
							:for="name.toLocaleLowerCase().replaceAll(' ', '-')"
							>{{ name }}</label
						>
						<input
							:class="[
								'bg-neutral-secondary-medium border-default-medium text-heading focus:ring-brand focus:border-brand placeholder:text-body block w-full cursor-pointer rounded-xl border text-sm text-gray-500 shadow-xs',
							]"
							:id="name.toLocaleLowerCase().replaceAll(' ', '-')"
							type="file"
							accept=".jpg, .jpeg, .png, .pdf, .webp"
							@change="
								(e) => {
									handleFileUpload(e, name);
								}
							" />
					</div>
				</template>
			</div>

			<!-- data consent notice -->
			<div
				class="mt-4 rounded-lg border border-blue-300 bg-blue-50 p-4 text-blue-800"
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
					<h3 class="text-sm font-semibold">Data Protection Consent Notice</h3>
				</div>

				<p class="mt-2 mb-4 text-sm">
					By proceeding, I consent to Regent Automobile Valuers & Assessors Limited
					collecting, processing, and storing my personal or corporate data for purposes
					related to vehicle valuation, tracking, road rescue, accident management, and
					related automotive services, in accordance with the Kenya Data Protection Act,
					2019 and the company’s Privacy Policy.
				</p>
				<div class="flex items-center">
					<input
						id="consent-checkbox"
						type="checkbox"
						v-model="consentProvided"
						class="h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500" />
					<label
						for="consent-checkbox"
						class="ms-2 text-sm font-medium text-blue-800"
						>I agree.
					</label>
				</div>
			</div>

			<!-- submit button -->
			<button
				type="submit"
				:disabled="!consentProvided || createAuthorizationLetterLoading"
				:class="[
					'generic-form-submit mt-4 w-full md:w-1/3',
					createAuthorizationLetterLoading && 'skeleton skeleton-animated',
				]">
				{{ createAuthorizationLetterLoading ? 'Please Wait...' : 'Create Letter' }}
			</button>
		</form>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'vehicle-valuation-create-authorization-letter',
		layout: 'console-layout',
	});

	const { regentBranches, fetchStatus, fetchError, refreshRegentBranches } = useRegentBranches();
	const { getPrincipal } = useAuth();
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
		allowedFiles,
		createAuthorizationLetter,
		handleFileUpload,
		computedCorporateClients,
		fetchingCorporateClients,
		consentProvided,
		shouldTriggerFetch,
	} = useAuthorityLetters();
	const { isPrincipalBroker } = useAuth();

	onMounted(async () => await shouldTriggerFetch());
</script>
