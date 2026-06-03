<template>
	<main class="h-screen flex items-center justify-center">
		<slot></slot>
	</main>
</template>

<script setup lang="ts">
	const slides: string[] = [
		'/images/slides/regenttrack/1.png',
		'/images/slides/regenttrack/2.png',
		'/images/slides/regenttrack/3.png',
		'/images/slides/regenttrack/4.png',
	];
	const { public: publicRuntimeConfig } = useRuntimeConfig();
</script>
