<template>
	<li>
		<NuxtLink
			:to="{ name: componentProps.routeName }"
			class="flex items-center gap-x-3.5 py-4 rounded-s-2xl px-2.5 bg-gray-100 hover:bg-gray-100 font-semibold border-r-4 border-r-blue-600 text-gray-500"
			@click="emit('changeCurrentRouteName', componentProps.displayName)">
			<img
				:src="icon"
				alt="Route Icon" />
			{{ componentProps.displayName }}
		</NuxtLink>
	</li>
</template>

<script setup lang="ts">
	export interface ComponentProps {
		icon: string;
		displayName: string;
		routeName: string;
	}

	const componentProps = defineProps<ComponentProps>();
	const emit = defineEmits(["changeCurrentRouteName"]);
</script>
