<template>
	<div class="console-layout-spacing">
		<h1 class="text-lg font-bold text-gray-500">Collateral Verification</h1>
		<h2 class="text-xs text-gray-500">
			A quick and easy way to verify documents and vehicle loan collateral here. Contribute to
			the largest collateral recording system in the country.
		</h2>
		<div
			class="hide-scrollbar laptop:space-x-4 my-4 space-x-2 overflow-x-scroll border-b-[.5px] whitespace-nowrap">
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
							? 'font-semibold text-blue-600 after:absolute after:-bottom-[.5px] after:left-0 after:h-[2px] after:w-full after:bg-blue-600'
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
	const { isPrincipalAdmin } = useAuth();
	const routeEntries = [
		{
			to: 'collateral-verification-home',
			name: 'Homepage',
			shouldShow: true,
		},
		{
			to: 'collateral-verification-onboard-fraudsters',
			name: 'Onboard Defaulter',
			shouldShow: true,
		},
		{
			to: 'collateral-verification-bulk-onboard-fraudsters',
			name: 'Bulk Onboarding',
			shouldShow: true,
		},
		{
			to: 'collateral-verification-manage-list',
			name: 'Your Defaulter List',
			shouldShow: true,
		},
		{
			to: 'collateral-verification-query-collateral',
			name: 'Collateral Verification',
			shouldShow: true,
		},
		{
			to: 'collateral-iprs-check',
			name: 'IPRS Verification',
			shouldShow: true,
		},
		{
			to: 'collateral-verification-view-invoices',
			name: 'Invoices',
			shouldShow: isPrincipalAdmin(),
		},
	];

	definePageMeta({
		layout: 'console-layout',
	});
</script>
