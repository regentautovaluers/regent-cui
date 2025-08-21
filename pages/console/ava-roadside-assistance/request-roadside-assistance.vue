<template>
	<!-- new UI -->
	<div class="console-layout-spacing rounded-lg border border-gray-200 bg-white">
		<!-- links strip -->
		<div class="hide-scrollbar space-x-4 overflow-x-scroll border-b p-5 whitespace-nowrap">
			<NuxtLink
				v-for="(e, idx) in routeEntries.filter((re) => re.shouldShow)"
				:key="idx"
				:to="{ name: e.to }"
				class="relative text-sm">
				<span
					:class="[
						doesRouteNameMatch(e.to) ||
						(e.to == 'collateral-verification-management' &&
							doesRoutePathInclude('/collateral-verification/management'))
							? 'font-semibold text-blue-600 after:absolute after:-bottom-[23px] after:left-0 after:h-[2.5px] after:w-full after:bg-blue-600'
							: 'text-gray-500',
					]">
					{{ e.name }}
				</span>
			</NuxtLink>
		</div>
		<NuxtPage />
	</div>
</template>
<script setup lang="ts">
	const { doesRouteNameMatch, doesRoutePathInclude } = useNavigationRoutes();

	definePageMeta({
		layout: 'console-layout',
	});

	const routeEntries = [
		{
			to: 'ra-towing-request',
			name: 'Request Towing',
			shouldShow: true,
		},
		{
			to: 'ra-fueldelivery-request',
			name: 'Request Fuel Delivery',
			shouldShow: true,
		},
		{
			to: 'ra-jumpstarting-request',
			name: 'Request Jumpstarting',
			shouldShow: true,
		},
		{
			to: 'ra-tyrechange-request',
			name: 'Request Tyre Change',
			shouldShow: true,
		},
	];
</script>
