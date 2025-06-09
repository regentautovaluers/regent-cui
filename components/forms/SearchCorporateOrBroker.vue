<template>
	<div class="flex h-full flex-col">
		<form
			class="relative h-fit"
			@submit.prevent="searchCorporateOrBroker">
			<input
				type="text"
				class="generic-input"
				placeholder="Search By Name"
				v-model="corpOrBrokerSearchTerm" />
			<button
				type="submit"
				class="generic-search-submit-button">
				<FormSubmissionLoader
					class="size-6 animate-spin text-white"
					v-if="searchCorpOrBrokerLoading" />
				<SearchIcon v-else />
			</button>
		</form>
		<div class="mt-1 max-h-full flex-grow space-y-1 overflow-y-auto">
			<div
				class="flex h-full flex-col items-center justify-center rounded-lg"
				v-if="searchCorpOrBrokerResults?.length === 0">
				<BirdieNotFoundIcon />
				<h1 class="font-semibold text-gray-500">No Matches Found!</h1>
			</div>
			<div
				class="hover:bg-border-blue-600 flex h-16 items-center justify-between rounded-lg border border-blue-500 bg-blue-100 px-2 py-1 transition-colors duration-150 ease-linear hover:bg-blue-200"
				v-else
				v-for="(result, index) in searchCorpOrBrokerResults"
				:key="index">
				<h1 class="font-semibold text-blue-500">
					{{ result.corpName }}
				</h1>
				<button
					@click="
						setSelectedCorpOrBroker({
							name: result.corpName,
							id: result.corpId,
						})
					"
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

	const { setSelectedCorpOrBroker } = useAuthorityLetters();
</script>
