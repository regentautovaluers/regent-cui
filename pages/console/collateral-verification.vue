<template>
	<div class="console-layout-spacing">
		<div class="mb-5 flex h-fit flex-col">
			<div class="laptop:w-fit flex w-full items-center space-x-2 rounded-lg border-[1px] bg-white">
				<NuxtLink
					:to="{ name: 'collateral-verification-onboard-fraudsters' }"
					class="h-10 rounded-lg p-2 text-sm text-gray-500"
					:class="
						doesRouteNameMatch('collateral-verification-onboard-fraudsters')
							? 'bg-gray-200 font-semibold'
							: 'hover:bg-gray-200'
					"
					>Onboard Defaulter</NuxtLink
				>
				<NuxtLink
					:to="{ name: 'collateral-verification-manage-list' }"
					class="h-10 rounded-lg p-2 text-sm text-gray-500"
					:class="
						doesRouteNameMatch('collateral-verification-manage-list')
							? 'bg-gray-200 font-semibold'
							: 'hover:bg-gray-200'
					"
					>Your Defaulter List</NuxtLink
				>
				<NuxtLink
					:to="{ name: 'collateral-verification-query-collateral' }"
					class="h-10 rounded-lg p-2 text-sm text-gray-500"
					:class="
						doesRouteNameMatch('collateral-verification-query-collateral')
							? 'bg-gray-200 font-semibold'
							: 'hover:bg-gray-200'
					"
					>Verify Collateral</NuxtLink
				>
				<NuxtLink
					:to="{ name: 'collateral-iprs-check' }"
					class="h-10 rounded-lg p-2 text-sm text-gray-500"
					:class="
						doesRouteNameMatch('collateral-iprs-check')
							? 'bg-gray-200 font-semibold'
							: 'hover:bg-gray-200'
					"
					>IPRS Check</NuxtLink
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
