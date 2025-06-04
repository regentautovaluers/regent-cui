<template>
	<CreateAuthorizationLetter
		@open-search-agent-corp-modal="isSearchCorpBrokersModalOpen = true" />

	<!-- Search Corp or Broker modal -->
	<ParentModal
		modal-id="export-to-excel"
		modal-title="Export to Excel"
		class="h-72"
		v-if="isExportExcelModalOpen"
		@close-modal="isExportExcelModalOpen = false">
		<ExportAuthorityLetter />
	</ParentModal>

	<!-- Search Corp or Broker modal -->
	<ParentModal
		modal-id="search-corp-brokers"
		:modal-title="isPrincipalBroker() ? 'Search Corporate' : 'Search Brokers'"
		class="h-112"
		v-if="isSearchCorpBrokersModalOpen"
		@close-modal="isSearchCorpBrokersModalOpen = false">
		<SearchCorporateOrBroker
			@close-search-agent-corp-modal="isSearchCorpBrokersModalOpen = false" />
	</ParentModal>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'vehicle-valuation-create-authorization-letter',
		layout: 'console-layout',
	});

	const { isPrincipalBroker } = useAuth();
	const isSearchCorpBrokersModalOpen: Ref<boolean> = ref(false);
	const isExportExcelModalOpen: Ref<boolean> = ref(false);
</script>
