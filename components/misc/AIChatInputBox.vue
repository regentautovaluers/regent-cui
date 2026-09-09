<template>
	<form
		class="w-full"
		@submit.prevent="submitQuestion()">
		<div class="relative size-fit w-full">
			<textarea
				id="comments"
				class="generic-text-area resize-none rounded-2xl text-sm shadow-sm"
				:rows="inputRowHeight ?? 5"
				:placeholder="callToActionText"
				v-model="userQueryModel"
				:disabled="awaitingResponseModel"></textarea>
			<button
				type="submit"
				class="absolute right-3 bottom-3 inline-flex items-center justify-center rounded-full bg-blue-600 p-2 text-sm space-x-2 text-slate-100 ring-1 disabled:bg-blue-300 disabled:text-blue-700"
				v-show="userQueryModel && userQueryModel.length > 0"
				:disabled="!userQueryModel || awaitingResponseModel">
				<span
					class="icon-[svg-spinners--90-ring] size-5"
					v-if="awaitingResponseModel"></span>
				<span
					class="icon-[material-symbols-light--arrow-upward-alt-rounded] size-6"
					v-else></span>
			</button>
		</div>
		<p class="mt-1.5 text-center text-sm text-gray-500">
			AVA is experimental. Responses could contain mistakes.
		</p>
		<div
			v-if="showSuggestionStrips"
			class="mt-4">
			<button
				v-for="(q, idx) in sampleQuestions"
				@click="sampleQuestionClicked(q)"
				:key="idx"
				class="m-1 rounded-full border p-2 text-xs text-gray-700 transition-colors duration-150 ease-in-out outline-none hover:border-gray-300 hover:bg-gray-100/70">
				{{ q }}
			</button>
		</div>
	</form>
</template>

<script setup lang="ts">
	interface Props {
		showSuggestionStrips?: boolean;
		callToActionText: string;
		inputRowHeight?: number;
	}

	const sampleQuestions: readonly string[] = [
		'How many vehicles did we valuate this year?',
		'How many valuations did we have last month?',
		'What is the average vehicle value in our portfolio? and what are some of the top vehicles',
		'What are our top 10 most-valuated vehicle makes?',
		'Which branch handles most of our valuations?',
		'Show me the 20 most recent tampered vehicles?',
		'Accident-state vehicles from this year',
		'Compare our SUVs and sedans by average value',
	];

	const userQueryModel = defineModel('userQueryModel', { type: String, default: '' });
	const awaitingResponseModel = defineModel('awaitingResponseModel', {
		type: Boolean,
		default: false,
	});
	const props = defineProps<Props>();

	const emits = defineEmits(['formSubmitted']);
	function submitQuestion() {
		emits('formSubmitted');
	}

	function sampleQuestionClicked(input: string) {
		userQueryModel.value = input;
		// emits('formSubmitted');
	}
</script>
