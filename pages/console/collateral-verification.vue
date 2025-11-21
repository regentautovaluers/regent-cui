<template>
	<!-- new UI -->
	<div class="console-layout-spacing ">
		<!-- links strip -->
		<div
			class="hide-scrollbar mb-5 h-fit space-x-4 divide-y-2 overflow-x-scroll rounded-lg border-2 bg-white whitespace-nowrap">
			<div class="inline-flex h-28 w-full items-center justify-between p-5 outline-none">
				<div class="flex h-full items-center space-x-3">
					<button
						class="inline-flex h-[70%] w-[50px] items-center justify-center rounded-lg bg-blue-600 outline-none">
						<span
							class="icon-[material-symbols-light--document-search-rounded] text-4xl text-slate-100"></span>
					</button>
					<div>
						<h1 class="text-xl font-semibold text-gray-800">Collateral Verification Hub</h1>
						<h2 class="text-sm text-gray-500">
							Validate Client Details and Contribute to Our Vehicle Collateral Database
						</h2>
					</div>
				</div>
			</div>
			<div
				class="hide-scrollbar h-16 space-x-10 overflow-x-scroll px-5 pt-5 whitespace-nowrap">
				<NuxtLink
					v-for="(e, idx) in routeEntries.filter((re) => re.shouldShow)"
					:key="idx"
					:to="{ name: e.to }"
					class="relative inline-flex items-end space-x-2">
					<span
						:class="[
							'size-6',
							e.icon,
							doesRouteNameMatch(e.to) ? 'text-blue-600' : 'text-gray-500',
						]"></span>
					<span
						:class="[
							doesRouteNameMatch(e.to)
								? 'font-semibold text-blue-600 after:absolute after:-bottom-[21px] after:left-0 after:h-[5px] after:w-full after:rounded-full after:bg-blue-600'
								: 'text-gray-500',
						]">
						{{ e.name }}
					</span>
				</NuxtLink>
			</div>
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
			icon: 'icon-[material-symbols-light--home-rounded]',
		},
		{
			to: 'collateral-verification-onboard-fraudsters',
			name: 'Onboard Collateral',
			shouldShow: true,
			icon: 'icon-[material-symbols-light--assignment-add]',
		},
		{
			to: 'collateral-verification-bulk-onboard-fraudsters',
			name: 'Bulk Onboarding',
			shouldShow: true,
			icon: 'icon-[material-symbols-light--files]',
		},
		{
			to: 'collateral-verification-manage-list',
			name: 'Your Collateral List',
			shouldShow: true,
			icon: 'icon-[material-symbols-light--view-list]',
		},
		{
			to: 'collateral-verification-query-collateral',
			name: 'Collateral Verification',
			shouldShow: true,
			icon: 'icon-[material-symbols-light--document-search-rounded]',
		},
		{
			to: 'collateral-iprs-check',
			name: 'IPRS Verification',
			shouldShow: true,
			icon: 'icon-[material-symbols-light--database-search-rounded]',
		},
		{
			to: 'collateral-verification-payments-regular',
			name: 'Payments',
			shouldShow: isPrincipalAdmin.value,
			icon: 'icon-[material-symbols-light--money-bag]',
		},
	];

	definePageMeta({
		layout: 'console-layout',
	});
</script>
