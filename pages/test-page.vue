<template>
	<button @click="isModalOpen = true">Open Modal</button>
	<ParentModal
		v-if="isModalOpen"
		modal-id="demo-id"
		modal-title="My Sample Modal"
		@close-modal="isModalOpen = false">
		<h1>Demo modal</h1>
	</ParentModal>
</template>

<script setup lang="ts">
	const isModalOpen: Ref<boolean> = ref(false);
</script>
