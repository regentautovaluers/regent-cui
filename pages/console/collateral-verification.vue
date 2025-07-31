<template>
	<div class="console-layout-spacing">
		<div
			class="laptop:w-fit hide-scrollbar mb-5 flex w-full items-center space-x-2 overflow-x-scroll rounded-full border-[1px] bg-white p-1">
			<NuxtLink
				:to="{ name: 'collateral-verification-onboard-fraudsters' }"
				class="h-10 rounded-full p-2 text-sm whitespace-nowrap text-gray-500"
				:class="
					doesRouteNameMatch('collateral-verification-onboard-fraudsters')
						? 'bg-gray-200'
						: 'hover:bg-gray-100'
				"
				>Onboard Defaulter</NuxtLink
			>
			<NuxtLink
				:to="{ name: 'collateral-verification-bulk-onboard-fraudsters' }"
				class="h-10 rounded-full p-2 text-sm whitespace-nowrap text-gray-500"
				:class="
					doesRouteNameMatch('collateral-verification-bulk-onboard-fraudsters')
						? 'bg-gray-200'
						: 'hover:bg-gray-100'
				"
				>Bulk Onboard Defaulter</NuxtLink
			>
			<NuxtLink
				:to="{ name: 'collateral-verification-manage-list' }"
				class="h-10 rounded-full p-2 text-sm whitespace-nowrap text-gray-500"
				:class="
					doesRouteNameMatch('collateral-verification-manage-list')
						? 'bg-gray-200'
						: 'hover:bg-gray-100'
				"
				>Your Defaulter List</NuxtLink
			>
			<NuxtLink
				:to="{ name: 'collateral-verification-query-collateral' }"
				class="h-10 rounded-full p-2 text-sm whitespace-nowrap text-gray-500"
				:class="
					doesRouteNameMatch('collateral-verification-query-collateral')
						? 'bg-gray-200'
						: 'hover:bg-gray-100'
				"
				>Verify Collateral</NuxtLink
			>
			<NuxtLink
				:to="{ name: 'collateral-iprs-check' }"
				class="h-10 rounded-full p-2 text-sm whitespace-nowrap text-gray-500"
				:class="
					doesRouteNameMatch('collateral-iprs-check')
						? 'bg-gray-200'
						: 'hover:bg-gray-100'
				"
				>IPRS Check</NuxtLink
			>
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
