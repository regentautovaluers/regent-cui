<template>
	<div
		class="console-layout-spacing grid flex-grow grid-cols-1 gap-10 lg:h-full lg:grid-cols-[.15fr_.85fr]">
		<div class="flex h-fit flex-col lg:h-full">
			<h1 class="mb-2 text-lg font-extrabold">Request</h1>
			<div class="flex flex-grow flex-col space-y-2">
				<NuxtLink
					:to="{ name: 'ra-towing-request' }"
					class="h-10 rounded-lg p-2 text-sm text-gray-500"
					:class="
						doesRouteNameMatch('ra-towing-request')
							? 'bg-gray-200 font-semibold'
							: 'hover:bg-gray-200'
					"
					>Vehicle Towing</NuxtLink
				>
				<NuxtLink
					:to="{ name: 'ra-fueldelivery-request' }"
					class="h-10 rounded-lg p-2 text-sm text-gray-500"
					:class="
						doesRouteNameMatch('ra-fueldelivery-request')
							? 'bg-gray-200 font-semibold'
							: 'hover:bg-gray-200'
					"
					>Fuel Delivery</NuxtLink
				>
				<NuxtLink
					:to="{ name: 'ra-jumpstarting-request' }"
					class="h-10 rounded-lg p-2 text-sm text-gray-500"
					:class="
						doesRouteNameMatch('ra-jumpstarting-request')
							? 'bg-gray-200 font-semibold'
							: 'hover:bg-gray-200'
					"
					>Jumpstarting</NuxtLink
				>
				<NuxtLink
					:to="{ name: 'ra-tyrechange-request' }"
					class="h-10 rounded-lg p-2 text-sm text-gray-500"
					:class="
						doesRouteNameMatch('ra-tyrechange-request')
							? 'bg-gray-200 font-semibold'
							: 'hover:bg-gray-200'
					"
					>Tyre Change</NuxtLink
				>
			</div>
		</div>
		<NuxtPage />
	</div>
</template>
<script setup lang="ts">
	const { doesRouteNameMatch } = useNavigationRoutes();

	definePageMeta({
		layout: 'console-layout',
	});
</script>
