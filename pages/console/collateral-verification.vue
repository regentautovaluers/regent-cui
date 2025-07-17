<template>
	<div
		class="console-layout-spacing grid flex-grow grid-cols-1 gap-10 lg:h-full lg:grid-cols-[.15fr_.85fr]">
		<div class="flex h-fit flex-col lg:h-full">
			<h1 class="mb-2 text-lg font-extrabold">Actions</h1>
			<div class="flex flex-grow flex-col space-y-2">
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
