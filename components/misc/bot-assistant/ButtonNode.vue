<template>
	<button
		type="button"
		class="h-10 w-full whitespace-nowrap rounded-full border px-2 py-1 text-sm text-gray-500 outline-none ring-gray-500 hover:ring-2"
		@click="emits('emit-click', props.value)">
		{{ props.label }}
	</button>
</template>

<script setup lang="ts">
	const props = defineProps({
		label: { required: true, type: String },
		value: { required: true, type: String },
	});

	const emits = defineEmits(['emit-click']);
</script>
