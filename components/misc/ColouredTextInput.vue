<template>
	<h2
		:class="[
			textSize,
			boldText && 'font-semibold',
			'bg-linear-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent',
		]">
		{{ text }}
	</h2>
</template>

<script setup lang="ts">
	withDefaults(defineProps<{ text: string; textSize?: string; boldText?: boolean }>(), {
		text: '',
		textSize: 'tablet:text-4xl laptop-lg:text-6xl text-2xl',
		boldText: false,
	});
</script>
