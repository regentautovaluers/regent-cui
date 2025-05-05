<template>
	<CreateAuthorizationLetter
		@open-search-agent-corp-modal="isSearchCorpBrokersModalOpen = true" />

	<!-- Search Corp or Broker modal -->
	<ParentModal
		modal-id="search-corp-brokers"
		modal-title="Export to Excel"
		class="h-[18rem]"
		v-if="isExportExcelModalOpen"
		@close-modal="isExportExcelModalOpen = false">
		<ExportAuthorityLetter />
	</ParentModal>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'vehicle-valuation-create-authorization-letter',
		layout: 'console-layout',
	});

	const isSearchCorpBrokersModalOpen: Ref<boolean> = ref(false);
	const isExportExcelModalOpen: Ref<boolean> = ref(false);
</script>
