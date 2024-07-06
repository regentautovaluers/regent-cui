<template>
	<li>
		<NuxtLink
			:to="{ name: componentProps.routeName }"
			class="flex items-center gap-x-2 py-4 rounded-s-xl px-2.5 hover:bg-gray-100 font-semibold"
			:class="
				route.name === routeName
					? 'bg-gray-100 border-r-[6px] border-r-blue-600 text-blue-600'
					: 'text-gray-500'
			"
			@click="emit('changeCurrentRouteName', componentProps.displayName)">
			<slot />
			{{ componentProps.displayName }}
		</NuxtLink>
	</li>
</template>

<script setup lang="ts">
	export interface ComponentProps {
		displayName: string;
		routeName: string;
	}

	const componentProps = defineProps<ComponentProps>();
	const route = useRoute();
	const emit = defineEmits(["changeCurrentRouteName"]);
</script>
