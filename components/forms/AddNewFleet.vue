<template>
	<form @submit.prevent="createFleet">
		<div>
			<label
				for="fleet-name"
				class="generic-input-label generic-input-required-label"
				>Fleet Name</label
			>
			<input
				type="text"
				id="fleet-name"
				class="generic-input h-[50px]"
				placeholder="e.g Kenya Power & Lightning Company"
				required
				v-model="fleetName" />
		</div>

		<div
			class="mt-3 flex flex-col items-center justify-between space-y-3 space-x-0 lg:flex-row lg:space-y-0 lg:space-x-3">
			<!-- Phone Field -->
			<div class="w-full lg:w-1/2">
				<label
					for="contact-person-phone"
					class="generic-input-label generic-input-required-label"
					>Contact Person Phone Number</label
				>
				<input
					type="text"
					id="contact-person-phone"
					class="generic-input h-[50px]"
					placeholder="e.g +254704080056"
					required
					v-model="contactPhoneNumber" />
			</div>

			<!-- Email field -->
			<div class="w-full lg:w-1/2">
				<label
					for="contact-person-email"
					class="generic-input-label generic-input-required-label"
					>Contact Person Email</label
				>
				<input
					type="email"
					id="contact-person-email"
					class="generic-input h-[50px]"
					placeholder="e.g youremail@co.ke"
					required
					v-model="contactEmail" />
			</div>
		</div>
		<!-- Full Name Field -->
		<div class="mt-3">
			<label
				for="contact-person-name"
				class="generic-input-label generic-input-required-label"
				>Contact Person Name</label
			>
			<input
				type="text"
				id="contact-person-name"
				class="generic-input h-[50px]"
				placeholder="e.g John Mwangi"
				required
				v-model="contactFullName" />
		</div>

		<!-- submit button -->
		<button
			type="submit"
			:class="[
				'generic-form-submit mt-3',
				createFleetLoading && 'skeleton skeleton-animated',
			]">
			{{ createFleetLoading ? 'Please Wait...' : 'Create Fleet' }}
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
