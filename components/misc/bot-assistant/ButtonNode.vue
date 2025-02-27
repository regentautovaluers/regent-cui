<template>
	<button
		type="button"
		class="mb-1 h-10 w-full whitespace-nowrap rounded-full border px-2 py-1 text-sm font-semibold text-gray-500 outline-none ring-gray-500 hover:ring-2"
		@click="emits('option-selected', props.value)">
		{{ props.label }}
	</button>
</template>

<script setup lang="ts">
	const props = defineProps({
		label: { required: true, type: String },
		value: { required: true, type: String },
	});

	const emits = defineEmits(['option-selected']);
</script>
