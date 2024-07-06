<template>
	<NuxtLink
		:to="{ name: componentProps.routeName }"
		class="flex space-x-3 hover:border-blue-500 items-center px-4 bg-white border-2 border-gray-200 shadow-sm rounded-lg h-20 w-1/5 min-w-1/5">
		<img
			:src="icon"
			alt="Service Icon"
			class="size-10" />
		<span class="tracking-wide text-gray-500 text-lg">{{
			componentProps.displayName === "Towing"
				? "Request Towing"
				: componentProps.displayName
		}}</span>
	</NuxtLink>
</template>

<script setup lang="ts">
	export interface ComponentProps {
		icon?: string;
		displayName: string;
		routeName: string;
	}

	const componentProps = defineProps<ComponentProps>();
</script>
