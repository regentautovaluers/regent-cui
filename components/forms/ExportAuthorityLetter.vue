<template>
	<InformationChip>
		<p class="text-sm font-semibold text-gray-500">
			Select the dates between which you want to export your letters.
		</p>
	</InformationChip>
	<form
		class="space-y-2"
		@submit.prevent="exportAuthorityLetter(startDate, endDate)">
		<div>
			<label
				for="letter-start-date"
				class="generic-input-label generic-input-required-label"
				>Start Date</label
			>
			<input
				type="date"
				id="letter-start-date"
				class="generic-input"
				placeholder="Enter Customer Name as Seen In Their National ID"
				pattern="\d{4}-\d{2}-\d{2}"
				required
				v-model="startDate" />
		</div>

		<!-- Ending date Field -->
		<div>
			<label
				for="letter-end-date"
				class="generic-input-label generic-input-required-label"
				>End Date</label
			>
			<input
				type="date"
				id="letter-end-date"
				class="generic-input"
				placeholder="Enter Customer Name as Seen In Their National ID"
				pattern="\d{4}-\d{2}-\d{2}"
				required
				v-model="endDate" />
		</div>

		<!-- submit button -->
		<button
			type="submit"
			class="generic-form-submit">
			<FormSubmissionLoader
				classes="mr-2 size-6 animate-spin text-white"
				v-if="exportAuthorityLettersLoading" />
			{{ exportAuthorityLettersLoading ? $t('request_processing') : 'Export Data' }}
		</button>
	</form>
</template>

<script setup lang="ts">
	const startDate: Ref<string> = ref('');
	const endDate: Ref<string> = ref('');
	const { exportAuthorityLettersLoading, exportAuthorityLetter } = useAuthorityLetters();
</script>
