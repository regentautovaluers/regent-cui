<template>
	<form @submit.prevent="createAuthorizationLetterRequestHandler">
		<h1 class="text-lg font-light">Create Your Authorization Letter</h1>
		<div class="mt-7 flex flex-col space-x-0 space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
			<!-- Registration Number -->
			<div class="w-full lg:w-1/3">
				<label
					for="registration-number"
					class="mb-2 block text-lg font-medium"
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
					class="mb-2 block text-lg font-medium"
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
					class="mb-2 block text-lg font-medium"
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
				class="mb-2 whitespace-nowrap text-lg font-medium"
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
					{{ capitalizeFirstLetterOfEachWord(branch) }}
				</option>
			</select>
		</div>
		<!-- comments -->
		<div class="mt-7">
			<label
				for="comments-box"
				class="mb-2 block text-lg font-medium"
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
					class="mb-2 block text-lg font-medium"
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
					class="mb-2 block text-lg font-medium"
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
					class="mb-2 block text-lg font-medium"
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
		<div class="mt-7">
			<div class="group">
				<label>
					<input
						type="file"
						name="fileToUpload"
						accept=".jpg, .png, .pdf, .doc, .docx"
						multiple
						class="w-fit rounded-md border border-dashed border-black/75 p-2 file:mr-5 file:rounded-lg file:border-0 file:bg-blue-100 file:px-6 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:cursor-pointer hover:file:bg-amber-50 hover:file:text-amber-700" />
				</label>
			</div>
			<span class="text-gray-500">.jpg, .png, .pdf, .doc, .docx, files accepted.</span>
		</div>
		<!-- submit button -->
		<button
			type="submit"
			class="mt-7 h-16 items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-lg font-semibold text-white hover:bg-blue-700">
			<span v-if="!formSubmissionLoading">Submit Request</span>
			<div
				v-if="formSubmissionLoading"
				class="inline-block size-5 animate-spin rounded-full border-[3px] border-current border-white border-t-transparent text-gray-800"
				role="status"
				aria-label="loading" />
		</button>
	</form>
</template>

<script setup lang="ts">
	const formSubmissionLoading = ref(false);
	async function createAuthorizationLetterRequestHandler(): Promise<void> {}
</script>
