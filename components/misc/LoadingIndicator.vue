<template>
	<!-- Progress -->
	<div class="w-full flex justify-center">
		<div
		class="flex h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700"
		:class="componentProps.barLength"
		role="progressbar"
		aria-valuenow="25"
		aria-valuemin="0"
		aria-valuemax="100">
		<div
			class="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition duration-500 dark:bg-blue-500"
			style="width: 100%; animation: scroll 1.5s linear infinite"></div>
	</div>
	</div>
	
	<!-- End Progress -->
</template>

<script setup lang="ts">
	const componentProps = defineProps<{
		barLength: string;
	}>();
</script>

<style>
	@keyframes scroll {
		0% {
			transform: translateX(-100%);
		}
		50% {
			transform: translateX(100%);
		}
		100% {
			transform: translateX(-100%);
		}
	}
</style>
