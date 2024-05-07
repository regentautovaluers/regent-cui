<template>
	<NuxtLink
		:to="{ name: componentProps.toName }"
		class="inline-flex flex-col items-center space-y-4">
		<div class="p-3 bg-blue-600 size-24 rounded-[2rem] flex items-center">
			<img
				:src="componentProps.imageLink"
				alt="Link Icon"
				class="size-20" />
		</div>
		<span class="font-semibold text-gray-500">{{
			componentProps.linkText
		}}</span></NuxtLink
	>
</template>

<script setup lang="ts">
	const componentProps = defineProps<{
		imageLink: string;
		toName: string;
		linkText: string;
	}>();
</script>
