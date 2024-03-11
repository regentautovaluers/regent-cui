<template>
	<form @submit.prevent="registerBulkMember">
		<div
			class="flex flex-col lg:flex-row items-center justify-between space-y-3 lg:space-y-0 space-x-0 lg:space-x-3">
			<!-- Full Name Field -->
			<div class="w-full">
				<label
					for="corporate-name"
					class="block font-medium mb-2 dark:text-white"
					>Corporate Name</label
				>
				<select
					class="py-3 px-4 pe-9 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					id="corporate-name">
					<option
						v-for="(make, index) in [
							'Kenya Power & Lighting Company',
							'Minet Insurance',
							'Riara Group of Schools',
							'Safaricom Kenya LTD',
						]"
						:key="index">
						{{ make }}
					</option>
				</select>
			</div>
		</div>
		<div
			class="flex flex-col lg:flex-row items-center justify-between space-y-3 lg:space-y-0 space-x-0 lg:space-x-3 mt-7">
			<!-- Full Name Field -->
			<div class="w-full lg:w-1/3">
				<label
					for="contact-person-name"
					class="block font-medium mb-2 dark:text-white"
					>Contact Person Name</label
				>
				<input
					type="text"
					id="contact-person-name"
					class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="Client Name as On Their National ID" />
			</div>

			<!-- Phone Field -->
			<div class="w-full lg:w-1/3">
				<label
					for="contact-person-phone"
					class="block font-medium mb-2 dark:text-white"
					>Contact Person Phone</label
				>
				<input
					type="text"
					id="contact-person-phone"
					class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="+254704080056" />
			</div>

			<!-- Email field -->
			<div class="w-full lg:w-1/3">
				<label
					for="contact-person-email"
					class="block font-medium mb-2 dark:text-white"
					>Contact Person Email</label
				>
				<input
					type="email"
					id="contact-person-email"
					class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="youremail@co.ke" />
			</div>
		</div>

		<!-- Cover Period -->
		<div class="flex items-center justify-between space-x-3 mt-7">
			<!-- Starting date Field -->
			<div class="w-1/2">
				<label
					for="cover-period-starts"
					class="block font-medium mb-2 dark:text-white"
					>Cover Period Starts</label
				>
				<input
					type="date"
					id="cover-period-starts"
					class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="Enter Customer Name as Seen In Their National ID" />
			</div>

			<!-- Ending date Field -->
			<div class="w-1/2">
				<label
					for="cover-period-ends"
					class="block font-medium mb-2 dark:text-white"
					>Cover Period Ends</label
				>
				<input
					type="date"
					id="cover-period-ends"
					class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="Enter Customer Name as Seen In Their National ID" />
			</div>
		</div>

		<!-- Download Excel document -->
		<h1 class="mt-16 text-2xl antialiased">Download Excel Template</h1>
		<div class="flex flex-col">
			<span class="text-lg text-gray-500"
				>Kindly download our Excel template and complete all columns
				exactly as provided. Please refrain from altering the column
				structure or their sequence.</span
			>
			<button
				type="button"
				class="py-3 px-4 w-full mt-3 h-16 items-center rounded-lg border-2 border-dotted text-white disabled:opacity-50 disabled:pointer-events-none inline-flex justify-between bg-pink-400 bg-opacity-50">
				<span class="text-pink-500">
					Click here to intiate excel template download
				</span>
				<Icon
					name="material-symbols-light:cloud-download"
					class="text-pink-400"
					size="38" />
			</button>
		</div>

		<!-- upload Excel document -->
		<h1 class="mt-10 text-2xl antialiased">Upload Excel Document</h1>
		<div class="flex flex-col">
			<span class="text-lg text-gray-500"
				>Please upload the completed document to proceed with your
				submission.</span
			>

			<div class="w-full">
				<label
					for="dropzone-file"
					class="mt-3 flex flex-col items-center justify-between border-[1.9px] border-gray-400 border-dashed cursor-pointer h-16 rounded py-3 px-4 bg-blue-400 bg-opacity-50">
					<div class="flex items-center justify-between w-full">
						<span class="text-blue-500">
							Click here to upload the completed Excel document
						</span>
						<Icon
							name="material-symbols-light:cloud-upload"
							class="text-blue-400"
							size="38" />
					</div>
					<input
						id="dropzone-file"
						type="file"
						accept=".xlsx"
						class="hidden" />
				</label>
			</div>
			<!-- File Uploading Progress Form -->
			<div class="mt-3">
				<!-- Progress Bar -->
				<div
					class="flex w-full h-3 bg-gray-200 rounded-full overflow-hidden"
					role="progressbar"
					aria-valuenow="1"
					aria-valuemin="0"
					aria-valuemax="100">
					<div
						class="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition duration-500"
						style="width: 1%"></div>
				</div>
				<div
					class="flex items-center justify-between w-full text-end text-lg text-gray-500 antialiased">
					<span> UPLOAD PROGESS </span>
					<span>0%</span>
				</div>
				<!-- End Progress Bar -->
			</div>
			<!-- End File Uploading Progress Form -->
		</div>

		<button
			type="submit"
			class="py-3 px-4 w-full mt-7 lg:w-1/2 text-lg h-16 items-center gap-x-2 font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
			<span v-if="!formSubmissionLoading">Create Membership</span>
			<div
				v-if="formSubmissionLoading"
				class="animate-spin inline-block size-5 border-[3px] border-white border-current border-t-transparent text-gray-800 rounded-full"
				role="status"
				aria-label="loading" />
		</button>
	</form>
</template>

<script setup lang="ts">
	const formSubmissionLoading = ref(false);
	function registerBulkMember(): void {}
</script>
