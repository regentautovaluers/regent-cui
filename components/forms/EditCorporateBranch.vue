<template>
	<form @submit.prevent="editCorporateBranch(branchName, branchLocation, props.branchId)">
		<div class="mt-3 flex flex-col">
			<label
				class="font-bold text-gray-500"
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
				class="font-bold text-gray-500"
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
			class="generic-form-submit mt-3">
			<FormSubmissionLoader
				classes="mr-2 size-6 animate-spin text-white"
				v-if="editCorporateBranchLoading" />
			{{ editCorporateBranchLoading ? 'Processing' : 'Update Branch' }}
		</button>
	</form>
</template>

<script setup lang="ts">
	const props = defineProps({
		branchId: { required: true, type: String },
		branchName: { required: true, type: String },
		branchLocation: { required: true, type: String },
	});

	const branchName: Ref<string> = ref(props.branchName);
	const branchLocation: Ref<string> = ref(props.branchLocation);

	const { editCorporateBranchLoading, editCorporateBranch } = useCorporateBranch();
</script>
