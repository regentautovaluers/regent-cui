<template>
	<form @submit.prevent="addCorporateBranch(branchName, branchLocation)">
		<div class="flex flex-col">
			<label
				class="generic-input-label"
				for="branch-name"
				>Branch Name</label
			>
			<div class="flex flex-grow">
				<input
					type="text"
					id="branch-name"
					class="generic-input"
					placeholder="Westlands Branch A"
					required
					v-model="branchName" />
			</div>
		</div>
		<div class="mt-3 flex flex-col">
			<label
				class="generic-input-label"
				for="branch-location"
				>Branch Location</label
			>
			<div class="flex flex-grow">
				<input
					type="text"
					id="branch-location"
					class="generic-input"
					placeholder="Westlands Road, Nairobi"
					required
					v-model="branchLocation" />
			</div>
		</div>

		<!-- submit button -->
		<button
			type="submit"
			:class="[
				'generic-form-submit mt-3',
				addCorporateBranchLoading && 'skeleton skeleton-animated',
			]">
			{{ addCorporateBranchLoading ? 'Please Wait...' : 'Add Branch' }}
		</button>
	</form>
</template>

<script setup lang="ts">
	const branchName: Ref<string> = ref('');
	const branchLocation: Ref<string> = ref('');

	const { addCorporateBranchLoading, addCorporateBranch } = useCorporateBranch();
</script>
