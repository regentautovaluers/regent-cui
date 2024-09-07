<template>
	<main class="flex h-screen flex-col items-center justify-center">
		<h1 class="text-5xl font-semibold text-gray-500">{{ props.error?.statusCode }}</h1>
		<h1 class="font-semibold italic text-gray-500">
			{{ props.error ? props.error.message : 'Something Went Wrong!' }}
		</h1>
	</main>
</template>

<script setup lang="ts">
	import type { NuxtError } from '#app';

	const props = defineProps({
		error: Object as () => NuxtError,
	});
</script>
