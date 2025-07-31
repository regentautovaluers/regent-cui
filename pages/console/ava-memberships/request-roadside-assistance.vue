<template>
	<div class="console-layout-spacing">
		<div class="mb-5 flex h-fit flex-col">
			<div
				class="laptop:w-fit hide-scrollbar mb-5 flex w-full items-center space-x-2 overflow-x-scroll rounded-full border-[1px] bg-white p-1">
				<NuxtLink
					:to="{ name: 'ra-towing-request' }"
					class="h-10 rounded-full p-2 text-sm whitespace-nowrap text-gray-500"
					:class="
						doesRouteNameMatch('ra-towing-request')
							? 'bg-gray-200'
							: 'hover:bg-gray-100'
					"
					>Vehicle Towing</NuxtLink
				>
				<NuxtLink
					:to="{ name: 'ra-fueldelivery-request' }"
					class="h-10 rounded-full p-2 text-sm whitespace-nowrap text-gray-500"
					:class="
						doesRouteNameMatch('ra-fueldelivery-request')
							? 'bg-gray-200'
							: 'hover:bg-gray-100'
					"
					>Fuel Delivery</NuxtLink
				>
				<NuxtLink
					:to="{ name: 'ra-jumpstarting-request' }"
					class="h-10 rounded-full p-2 text-sm whitespace-nowrap text-gray-500"
					:class="
						doesRouteNameMatch('ra-jumpstarting-request')
							? 'bg-gray-200'
							: 'hover:bg-gray-100'
					"
					>Jumpstarting</NuxtLink
				>
				<NuxtLink
					:to="{ name: 'ra-tyrechange-request' }"
					class="h-10 rounded-full p-2 text-sm whitespace-nowrap text-gray-500"
					:class="
						doesRouteNameMatch('ra-tyrechange-request')
							? 'bg-gray-200'
							: 'hover:bg-gray-100'
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
