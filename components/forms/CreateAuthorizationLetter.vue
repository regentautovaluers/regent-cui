<template>
	<form>
		<div class="mt-7 flex flex-col space-x-0 space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
			<!-- Registration Number -->
			<div class="w-full lg:w-1/3">
				<label
					for="registration-number"
					class="generic-input-label"
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
					class="generic-input-label"
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
					class="generic-input-label"
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
		<div class="mt-7 flex w-full flex-col">
			<label
				for="fuel-type"
				class="generic-input-label"
				>Preferred Regent Branch</label
			>
			<select
				class="generic-input"
				id="fuel-type"
				required>
				<option value="Select a Preferred Regent Branch">
					Select a Preferred Regent Branch
				</option>
				<option
					v-for="(branch, index) in ['nairobi', 'kilifi', 'mombasa']"
					:key="index"
					:value="branch">
					<!-- {{ capitalizeFirstLetterOfEachWord(branch) }} -->
				</option>
			</select>
		</div>
		<!-- comments -->
		<div class="mt-7">
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
		<div class="mt-7 flex flex-col space-x-0 space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
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
					required />
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
					required />
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
					placeholder="e.g myName"
					required />
			</div>
		</div>

		<!-- file upload -->
		<div class="mt-7 flex flex-col">
			<label>
				<input
					type="file"
					name="fileToUpload"
					accept=".jpg, .png, .pdf, .webp, .doc, .docx"
					multiple
					class="rounded-full" />
			</label>
			<span class="text-gray-500">.jpg, .png, .pdf, .doc, .docx, files accepted.</span>
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
</script>
