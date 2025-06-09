<template>
	<CreateAuthorizationLetter />

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
		:modal-title="isPrincipalBroker() ? 'Search Corporate' : 'Search From Brokers'"
		class="h-112">
		<SearchCorporateOrBroker />
	</ParentModal>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'vehicle-valuation-create-authorization-letter',
		layout: 'console-layout',
	});

	const { isPrincipalBroker } = useAuth();
	const isExportExcelModalOpen: Ref<boolean> = ref(false);
</script>
