<template>
	<form
		class="laptop:p-4 laptop-lg:p-8 flex flex-1 flex-col p-2"
		@submit.prevent="createFraudsterEntry">
		<div
			id="alert-additional-content-4"
			class="mb-5 rounded-lg border border-blue-300 bg-blue-50 p-4 text-blue-800"
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
				<h3 class="text-sm font-semibold">Autofill With AI</h3>
			</div>

			<p class="mt-2 mb-4 text-sm">
				Do you have the vehicles logbook image? You can upload it here and our quick process
				will pick key information about the vehicle for you and autofill the form.
				<span class="font-bold"
					>AI output may not be accurate. Kindly double check the output. Regent does not
					store any file you upload here.</span
				>
			</p>
			<div
				class="laptop:space-y-0 laptop:flex-row laptop:space-x-4 laptop:h-14 flex h-fit flex-col items-center space-y-4">
				<label
					for="cert-of-registration"
					class="auth-letter-file-input laptop:h-full flex h-14 w-full items-center justify-between rounded-lg border-gray-400 backdrop-opacity-50"
					:class="
						fileLink != ''
							? 'border-green-300 bg-green-50 text-green-800 hover:bg-green-100'
							: 'border-yellow-300 bg-yellow-50 text-yellow-800 hover:bg-yellow-100'
					">
					<span>Click to select vehicle logbook and extract data.</span>
					<input
						id="cert-of-registration"
						type="file"
						accept=".jpg, .jpeg, .png, .webp"
						class="hidden"
						@change.prevent="
							(e) => {
								extractLogbookInfo(
									(e.target as HTMLInputElement)?.files?.[0] as File,
								);
							}
						" />
					<FormSubmissionLoader
						class="mr-2 size-6 animate-spin text-yellow-800"
						v-if="extractionInProgress" />
				</label>
			</div>
		</div>

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
					v-model="onboardDefaulter.registrationNumber" />
			</div>
			<!-- Chassis Number -->
			<div class="w-full lg:w-1/3">
				<label
					for="chassis-number"
					class="generic-input-label generic-input-required-label"
					>Chassis Number</label
				>
				<input
					type="text"
					id="chassis-number"
					class="generic-input"
					placeholder="e.g 318292GHJSk56FGFS"
					required
					v-model="onboardDefaulter.chassisNumber" />
			</div>
			<!-- Engine Number -->
			<div class="w-full lg:w-1/3">
				<label
					for="engine-number"
					class="generic-input-label generic-input-required-label"
					>Engine Number</label
				>
				<input
					type="text"
					id="engine-number"
					class="generic-input"
					placeholder="e.g 123456XYZ"
					required
					v-model="onboardDefaulter.engineNumber" />
			</div>
		</div>

		<div class="mt-5 flex flex-col space-y-4 space-x-0 lg:flex-row lg:space-y-0 lg:space-x-4">
			<!-- Vehicle Color -->
			<div class="w-full lg:w-1/3">
				<label
					for="vehicle-color"
					class="generic-input-label"
					>Vehicle Color</label
				>
				<input
					type="text"
					id="vehicle-color"
					class="generic-input"
					placeholder="e.g Red"
					v-model="onboardDefaulter.color" />
			</div>
			<!-- Vehicle Make -->
			<div class="w-full lg:w-1/3">
				<label
					for="vehicle-make"
					class="generic-input-label generic-input-required-label"
					>Vehicle Make</label
				>
				<input
					type="text"
					id="vehicle-make"
					class="generic-input"
					placeholder="e.g Mazda"
					required
					v-model="onboardDefaulter.make" />
			</div>
			<!-- Vehicle Model -->
			<div class="w-full lg:w-1/3">
				<label
					for="vehicle-model"
					class="generic-input-label generic-input-required-label"
					>Vehicle Model</label
				>
				<input
					type="text"
					id="vehicle-model"
					class="generic-input"
					placeholder="e.g Demio"
					required
					v-model="onboardDefaulter.model" />
			</div>
		</div>

		<div
			id="alert-additional-content-4"
			class="mt-5 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800"
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
				<h3 class="text-sm font-semibold">Incident Description</h3>
			</div>

			<p class="mt-2 mb-4 text-sm">
				Optionally, use the fields below to provide an extra description of the incident you
				are adding to the database. This will be of help to other users of the platform.
			</p>
		</div>

		<!-- Incident Description -->
		<div class="mt-5">
			<label
				for="incident-description"
				class="generic-input-label"
				>Incident Description</label
			>
			<textarea
				id="incident-description"
				class="generic-text-area"
				rows="12"
				placeholder="Provide an optional extra description for this incident"
				v-model="onboardDefaulter.description"></textarea>
		</div>

		<div class="mt-5 flex flex-col space-y-4 space-x-0 lg:flex-row lg:space-y-0 lg:space-x-4">
			<!-- Date of the incident -->
			<div class="w-full lg:w-1/3">
				<label
					for="date-of-incident"
					class="generic-input-label"
					>Date of Incident</label
				>
				<!-- format yyyy-mm-dd -->
				<input
					type="date"
					id="date-of-incident"
					class="generic-input"
					placeholder="e.g 2024-01-17"
					pattern="\d{4}-\d{2}-\d{2}"
					v-model="onboardDefaulter.dateOfIncident" />
			</div>
			<!-- Amount Defaulted -->
			<div class="w-full lg:w-1/3">
				<label
					for="amount-defaulted"
					class="generic-input-label"
					>Amount Defaulted</label
				>
				<input
					type="text"
					id="amount-defaulted"
					class="generic-input"
					placeholder="e.g 15,000"
					v-model="onboardDefaulter.amountDefaulted" />
			</div>
			<!-- Relevant -->
			<div class="relative w-full lg:w-1/3">
				<label
					for="relevant-links"
					class="generic-input-label"
					>Relevant Link(s)</label
				>
				<input
					type="text"
					id="relevant-links"
					class="generic-input"
					placeholder="e.g link to a court case"
					v-model="relevantLink" />

				<button
					@click.prevent="handleAppendingRelevantLink"
					:disabled="!relevantLink"
					class="absolute top-1/2 right-3 size-7 -translate-y-[5%] cursor-pointer rounded-full bg-blue-600 text-white enabled:hover:bg-blue-700 disabled:bg-gray-400 disabled:text-slate-100"
					type="button">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="28"
						height="28"
						viewBox="0 0 32 32">
						<path
							fill="currentColor"
							d="M16 2A14.173 14.173 0 0 0 2 16a14.173 14.173 0 0 0 14 14a14.173 14.173 0 0 0 14-14A14.173 14.173 0 0 0 16 2m8 15h-7v7h-2v-7H8v-2h7V8h2v7h7Z" />
						<path
							fill="none"
							d="M24 17h-7v7h-2v-7H8v-2h7V8h2v7h7z" />
					</svg>
				</button>
			</div>
		</div>

		<div
			v-if="onboardDefaulter.relevantLinks?.length! > 0"
			class="mt-3 p-2">
			<h1 class="mb-2 text-sm font-semibold text-gray-500">Provided Links</h1>
			<div class="flex items-center space-x-2">
				<span
					v-for="(link, index) in onboardDefaulter.relevantLinks"
					:key="index"
					class="mr-2 flex w-fit items-center space-x-2 rounded-full border border-yellow-300 bg-yellow-50 px-2 py-1 text-sm text-yellow-800">
					<a
						:href="link"
						target="_blank"
						>{{ link }}</a
					>
					<button
						class="inline-flex size-5 cursor-pointer items-center justify-center rounded-full border border-yellow-300"
						type="button"
						@click="handleRemovingRelevantLink(index)">
						<span class="ic--round-close size-[16px]"></span>
					</button>
				</span>
			</div>
		</div>

		<!-- submit button -->
		<button
			type="submit"
			:class="[
				'generic-form-submit laptop:w-1/2 desktop-4k:w-1/3 mt-4 w-full',
				onboardDefaulterLoading && 'skeleton skeleton-animated',
			]">
			{{ onboardDefaulterLoading ? 'Please Wait...' : 'Submit Request' }}
		</button>
	</form>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'collateral-verification-onboard-fraudsters',
		layout: 'console-layout',
	});

	const {
		onboardDefaulter,
		onboardDefaulterLoading,
		relevantLink,
		fileLink,
		extractedLogbookInfo,
		extractionInProgress,
		createFraudsterEntry,
		handleAppendingRelevantLink,
		handleRemovingRelevantLink,
		extractLogbookInfo,
	} = useFraudDetection();

	watch(extractedLogbookInfo, (newValue) => {
		(onboardDefaulter.registrationNumber = newValue.registration),
			(onboardDefaulter.chassisNumber = newValue.chassis),
			(onboardDefaulter.engineNumber = newValue.engine_no),
			(onboardDefaulter.color = newValue.colour),
			(onboardDefaulter.make = newValue.make_of_vehicle),
			(onboardDefaulter.model = newValue.model);
	});
</script>
