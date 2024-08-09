<template>
	<li>
		<NuxtLink
			:to="{ name: componentProps.routeName }"
			class="group flex items-center gap-x-2 rounded-s-xl px-2.5 py-4 font-semibold hover:bg-gray-100 hover:text-blue-600"
			:class="
				route.name === routeName
					? 'border-r-[6px] border-r-blue-600 bg-gray-100 text-blue-600'
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
	const emit = defineEmits(['changeCurrentRouteName']);
</script>
