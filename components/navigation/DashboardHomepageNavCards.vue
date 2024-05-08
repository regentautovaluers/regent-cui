<template>
	<NuxtLink
		:to="{ name: componentProps.toName }"
		class="inline-flex flex-col items-center space-y-2">
		<div
			class="p-3 bg-[#f6f9f2] border size-24 rounded-[2rem] flex items-center justify-center">
			<img
				:src="componentProps.imageLink"
				alt="Link Icon"
				class="size-16" />
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
