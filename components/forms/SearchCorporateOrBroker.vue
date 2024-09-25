<template>
	<div class="flex h-full flex-col">
		<form
			class="relative h-fit"
			@submit.prevent="searchCorporateOrBroker">
			<input
				type="text"
				class="generic-input"
				placeholder="Search Fuzzily By Name"
				v-model="corpOrBrokerSearchTerm" />
			<button
				type="submit"
				class="absolute right-0 top-0 flex size-14 items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700">
				<FormSubmissionLoader
					classes="size-6 animate-spin text-white"
					v-if="searchCorpOrBrokerLoading" />
				<SearchIcon v-else />
			</button>
		</form>
		<div class="mt-1 max-h-full flex-grow overflow-y-auto">
			<div
				class="hover:bg-border-blue-600 flex h-16 items-center justify-between rounded-lg border border-blue-500 bg-blue-100 px-2 py-1 transition-colors duration-150 ease-linear hover:bg-blue-200"
				v-for="(result, index) in searchCorpOrBrokerResults"
				:key="index">
				<h1 class="font-semibold text-blue-500">
					{{ result.corpName }}
				</h1>
				<button
					@click="assignAgency(result.corpId)"
					class="rounded-lg bg-blue-600 p-2 px-4 text-white">
					Select
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const {
		searchCorpOrBrokerResults,
		corpOrBrokerSearchTerm,
		searchCorpOrBrokerLoading,
		searchCorporateOrBroker,
	} = useAuth();
	const { assignAgency } = useAuthorityLetters();
</script>
