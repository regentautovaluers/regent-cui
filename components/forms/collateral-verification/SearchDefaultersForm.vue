<template>
	<form @submit.prevent="emits('initiate-search', { regNo, engineNo, chassisNo })">
		<!-- Registration Number -->
		<div>
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
				v-model.trim="regNo" />
		</div>
		<!-- Client Name -->
		<div class="mt-4">
			<label
				for="client-name"
				class="generic-input-label"
				>Engine Number</label
			>
			<input
				type="text"
				id="client-name"
				class="generic-input"
				placeholder="e.g ENGINE123"
				v-model.trim="engineNo" />
		</div>
		<!-- Client Phone Number -->
		<div class="mt-4">
			<label
				for="client-phone"
				class="generic-input-label"
				>Chassis Number</label
			>
			<input
				type="text"
				id="client-phone"
				class="generic-input"
				placeholder="e.g CHASSIS123"
				v-model.trim="chassisNo" />
		</div>

		<!-- submit button -->
		<button
			type="submit"
			:class="[
				'generic-form-submit mt-4 w-full',
				props.searchLoading && 'skeleton skeleton-animated',
			]">
			{{ props.searchLoading ? 'Please Wait...' : 'Submit Request' }}
		</button>
	</form>
</template>

<script setup lang="ts">
	const regNo = ref('');
	const engineNo = ref('');
	const chassisNo = ref('');
	const { searchDefaulterLoading, searchCollateralType, searchDefaulter } =
		useCollateralVerification();
	const emits = defineEmits(['initiate-search']);
	const props = defineProps({
		searchLoading: {
			required: true,
			type: Boolean,
		},
	});
</script>
