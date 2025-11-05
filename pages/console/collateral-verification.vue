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
						(e.to == 'collateral-verification-payments-regular' &&
							doesRoutePathInclude('/collateral-verification/payments'))
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
	const { isPrincipalAdmin } = useAuth();
	const routeEntries: Ref<{ to: string; name: string; shouldShow: boolean }[]> = ref([
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
			to: 'collateral-verification-payments-regular',
			name: 'Payments',
			shouldShow: isPrincipalAdmin?.value ?? false,
		},
	]);

	definePageMeta({
		layout: 'console-layout',
	});
</script>
