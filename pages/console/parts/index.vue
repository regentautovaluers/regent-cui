<template>
	<div class="h-full">
		<CommingSoon />
	</div>
</template>

<script setup lang="ts">
	import CommingSoon from '~/components/misc/CommingSoon.vue';

	definePageMeta({
		name: 'parts-home',
		layout: 'console-layout',
	});
</script>
