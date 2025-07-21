<template>
	<div class="console-layout-spacing">
		<div class="flex h-fit flex-col mb-5">
			<div class="laptop:w-fit flex w-full items-center space-x-2 rounded-lg border-[1px]">
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
