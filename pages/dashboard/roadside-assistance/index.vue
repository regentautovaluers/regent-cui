<template>
	<div class="h-full">
		<div class="flex items-center space-x-6 overflow-x-auto">
			<AngularNavigationCardA
				v-for="(route, index) in applicationRoutes[2].children?.slice(
					0,
					5
				)"
				:key="index"
				:display-name="route.displayName"
				:route-name="route.routeName"
				icon="test" />
		</div>
	</div>
</template>

<script setup lang="ts">
	import applicationRoutes from "~/types/routes";

	definePageMeta({
		name: "ava-home",
		layout: "in-app-layout",
	});
</script>
