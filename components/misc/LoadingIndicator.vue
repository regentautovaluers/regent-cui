<template>
	<!-- Progress -->
	<div class="w-full flex justify-center">
		<div
			class="flex h-2 rounded-lg overflow-hidden"
			:class="componentProps.injectClasses"
			role="progressbar"
			aria-valuenow="25"
			aria-valuemin="0"
			aria-valuemax="100">
			<div
				class="bg-gray-200"
				style="width: 80%; animation: scroll 1.8s linear infinite"></div>
		</div>
	</div>

	<!-- End Progress -->
</template>

<script setup lang="ts">
	const componentProps = defineProps<{
		injectClasses: string;
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

	@keyframes zoom {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(100%);
		}
	}
</style>
