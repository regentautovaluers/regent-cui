<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="1.4em"
		height="1.4em"
		viewBox="0 0 24 24"
		:class="props.classes">
		<path
			:fill="props.color"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="1.5"
			d="M4.5 7h15M7 12h10m-7 5h4" />
	</svg>
</template>

<script lang="ts" setup>
	const props = defineProps({
		classes: { required: false, type: String },
		color: { required: false, type: String },
	});
</script>
