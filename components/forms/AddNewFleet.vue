<template>
	<form @submit.prevent="createFleet">
		<div>
			<label
				for="fleet-name"
				class="generic-input-label"
				>Fleet Name</label
			>
			<input
				type="text"
				id="fleet-name"
				class="generic-input"
				placeholder="e.g Kenya Power & Lightning Company"
				required
				v-model="fleetName" />
		</div>

		<div
			class="mt-3 flex flex-col items-center justify-between space-x-0 space-y-3 lg:flex-row lg:space-x-3 lg:space-y-0">
			<!-- Phone Field -->
			<div class="w-full lg:w-1/2">
				<label
					for="contact-person-phone"
					class="generic-input-label"
					>Contact Person Phone Number</label
				>
				<input
					type="text"
					id="contact-person-phone"
					class="generic-input"
					placeholder="e.g +254704080056"
					required
					v-model="contactPhoneNumber" />
			</div>

			<!-- Email field -->
			<div class="w-full lg:w-1/2">
				<label
					for="contact-person-email"
					class="generic-input-label"
					>Contact Person Email</label
				>
				<input
					type="email"
					id="contact-person-email"
					class="generic-input"
					placeholder="e.g youremail@co.ke"
					required
					v-model="contactEmail" />
			</div>
		</div>
		<!-- Full Name Field -->
		<div class="mt-3">
			<label
				for="contact-person-name"
				class="generic-input-label"
				>Contact Person Name</label
			>
			<input
				type="text"
				id="contact-person-name"
				class="generic-input"
				placeholder="e.g John Mwangi"
				required
				v-model="contactFullName" />
		</div>

		<!-- submit button -->
		<button
			type="submit"
			class="generic-form-submit mt-3">
			<FormSubmissionLoader
				classes="mr-2 size-6 animate-spin text-white"
				v-if="createFleetLoading" />
			{{ createFleetLoading ? 'Processing' : 'Create Fleet' }}
		</button>
	</form>
</template>

<script setup lang="ts">
	const {
		fleetName,
		contactFullName,
		contactPhoneNumber,
		contactEmail,
		createFleetLoading,
		createFleet,
	} = useFleets();
</script>
