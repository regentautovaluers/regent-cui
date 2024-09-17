<template>
	<form>
		<div class="mt-5 flex flex-col space-x-0 space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
			<!-- Registration Number -->
			<div class="w-full lg:w-1/3">
				<label
					for="registration-number"
					class="generic-input-label after:ml-0.5 after:text-gray-500 after:content-['*']"
					>Registration Number</label
				>
				<input
					type="text"
					id="registration-number"
					class="generic-input"
					placeholder="e.g KDH 908Y"
					required />
			</div>
			<!-- Customer Name -->
			<div class="w-full lg:w-1/3">
				<label
					for="customer-name"
					class="generic-input-label after:ml-0.5 after:text-gray-500 after:content-['*']"
					>Customer Name</label
				>
				<input
					type="text"
					id="customer-name"
					class="generic-input"
					placeholder="e.g Janet Wangari Thuo"
					required />
			</div>
			<!-- Customer Phone Number -->
			<div class="w-full lg:w-1/3">
				<label
					for="customer-phone"
					class="generic-input-label after:ml-0.5 after:text-gray-500 after:content-['*']"
					>Customer Phone Number</label
				>
				<input
					type="text"
					id="customer-phone"
					class="generic-input"
					placeholder="e.g 254789261947"
					required />
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
				required>
				<option
					:value="null"
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
				for="comments-box"
				class="generic-input-label"
				>Comments</label
			>
			<textarea
				id="comments-box"
				class="block w-full rounded-lg border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
				rows="8"
				placeholder="Provide optional comments for this request."></textarea>
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
					placeholder="e.g MGL/07/080/00/489586/2020" />
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
					placeholder="e.g Esther Kasele" />
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
					placeholder="e.g Jane Doe" />
			</div>
		</div>

		<div class="mt">
			<!-- upload logbook -->
			<h1 class="mt-2 text-lg antialiased">Logbook</h1>
			<div class="flex flex-col">
				<div>
					<label
						for="logbook-file"
						class="mt-1 flex h-16 cursor-pointer flex-col items-center justify-between rounded-lg border-[1.9px] border-dashed border-gray-400 bg-blue-400 bg-opacity-50 px-4 py-3">
						<div class="flex w-full items-center justify-between text-blue-500">
							<span> Click here to upload the vehicle&apos;s logbook </span>
							<UploadIcon />
						</div>
						<input
							id="logbook-file"
							type="file"
							accept=".jpg, .png, .pdf, .webp, .doc, .docx"
							class="hidden"
							required />
					</label>
				</div>
			</div>

			<!-- upload KRA PIN -->
			<h1 class="mt-2 text-lg antialiased">KRA PIN</h1>
			<div class="flex flex-col">
				<div>
					<label
						for="pin-file"
						class="mt-1 flex h-16 cursor-pointer flex-col items-center justify-between rounded-lg border-[1.9px] border-dashed border-gray-400 bg-blue-400 bg-opacity-50 px-4 py-3">
						<div class="flex w-full items-center justify-between text-blue-500">
							<span> Click here to upload the client&apos;s KRA PIN </span>
							<UploadIcon />
						</div>
						<input
							id="pin-file"
							type="file"
							accept=".jpg, .png, .pdf, .webp, .doc, .docx"
							class="hidden" />
					</label>
				</div>
			</div>

			<!-- upload ID -->
			<h1 class="mt-2 text-lg antialiased">National ID</h1>
			<div class="flex flex-col">
				<div>
					<label
						for="nationalid-file"
						class="mt-1 flex h-16 cursor-pointer flex-col items-center justify-between rounded-lg border-[1.9px] border-dashed border-gray-400 bg-blue-400 bg-opacity-50 px-4 py-3">
						<div class="flex w-full items-center justify-between text-blue-500">
							<span> Click here to upload the client&apos;s National ID </span>
							<UploadIcon />
						</div>
						<input
							id="nationalid-file"
							type="file"
							accept=".jpg, .png, .pdf, .webp, .doc, .docx"
							class="hidden" />
					</label>
				</div>
			</div>

			<!-- upload KRA PIN -->
			<h1 class="mt-2 text-lg antialiased">Certificate of Registration</h1>
			<div class="flex flex-col">
				<div>
					<label
						for="regcert-file"
						class="mt-1 flex h-16 cursor-pointer flex-col items-center justify-between rounded-lg border-[1.9px] border-dashed border-gray-400 bg-blue-400 bg-opacity-50 px-4 py-3">
						<div class="flex w-full items-center justify-between text-blue-500">
							<span>
								Click here to upload the vehicle&apos;s certificate of
								registration</span
							>
							<UploadIcon />
						</div>
						<input
							id="regcert-file"
							type="file"
							accept=".jpg, .png, .pdf, .webp, .doc, .docx"
							class="hidden" />
					</label>
				</div>
			</div>

			<!-- upload Authority Letter -->
			<h1 class="mt-2 text-lg antialiased">Authority Letter</h1>
			<div class="flex flex-col">
				<div>
					<label
						for="authletter-file"
						class="mt-1 flex h-16 cursor-pointer flex-col items-center justify-between rounded-lg border-[1.9px] border-dashed border-gray-400 bg-blue-400 bg-opacity-50 px-4 py-3">
						<div class="flex w-full items-center justify-between text-blue-500">
							<span> Click here to upload your authority letter</span>
							<UploadIcon />
						</div>
						<input
							id="authletter-file"
							type="file"
							accept=".jpg, .png, .pdf, .webp, .doc, .docx"
							class="hidden" />
					</label>
				</div>
			</div>
		</div>

		<!-- submit button -->
		<button
			type="submit"
			class="generic-form-submit mt-4 w-1/3">
			<FormSubmissionLoader
				classes="mr-2 size-6 animate-spin text-white"
				v-if="createAuthorizationLetterLoading" />
			{{ createAuthorizationLetterLoading ? $t('request_processing') : 'Submit Request' }}
		</button>
	</form>
</template>

<script setup lang="ts">
	const createAuthorizationLetterLoading: Ref<boolean> = ref(false);
	const { regentBranches, fetchStatus, fetchError, refreshRegentBranches } = useRegentBranches();
</script>
