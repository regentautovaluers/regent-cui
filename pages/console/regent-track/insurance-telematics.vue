<template>
	<!-- new UI -->
	<div class="console-layout-spacing">
		<!-- links strip -->
		<div
			class="hide-scrollbar mb-5 h-fit space-x-4 divide-y-2 overflow-x-scroll rounded-lg border-2 bg-white whitespace-nowrap">
			<div class="inline-flex h-28 w-full items-center justify-between p-5 outline-none">
				<div class="flex h-full items-center space-x-3">
					<button
						class="inline-flex h-[70%] w-[50px] items-center justify-center rounded-lg bg-blue-500 outline-none">
						<span
							class="icon-[material-symbols-light--shield-outline] text-4xl text-slate-100"></span>
					</button>
					<div>
						<h1 class="text-xl font-semibold text-gray-800">Insurance Telematics</h1>
						<h2 class="text-sm text-gray-500">
							Driver Behaviour Analysis & Risk Assessment
						</h2>
					</div>
				</div>
				<button
					class="inline-flex h-12 w-40 items-center justify-center space-x-1 rounded-md bg-blue-500 text-sm text-slate-100 transition-colors duration-200 ease-in-out outline-none hover:bg-blue-600"
					type="button">
					<span
						:class="[
							'text-xl',
							loadingReportExport
								? 'icon-[svg-spinners--ring-resize]'
								: 'icon-[material-symbols-light--sim-card-download-outline]',
						]"></span>
					<span>Download Report</span>
				</button>
			</div>
			<div
				class="hide-scrollbar h-20 space-x-10 overflow-x-scroll px-5 pt-5 whitespace-nowrap">
				<NuxtLink
					v-for="(e, idx) in routeEntries.filter((re) => re.shouldShow)"
					:key="idx"
					:to="{ name: e.to }"
					class="relative inline-flex items-end space-x-2">
					<span
						:class="[
							'text-3xl',
							e.icon,
							doesRouteNameMatch(e.to) ? 'text-blue-600' : 'text-gray-500',
						]"></span>
					<span
						:class="[
							doesRouteNameMatch(e.to)
								? 'font-semibold text-blue-600 after:absolute after:-bottom-[31px] after:left-0 after:h-[5px] after:w-full after:rounded-full after:bg-blue-600'
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
	const loadingReportExport: Ref<boolean> = ref(false);
	const { doesRouteNameMatch } = useNavigationRoutes();

	const routeEntries = [
		{
			to: 'insurance-telematics-all-vehicles',
			name: 'All Vehicles',
			shouldShow: true,
			icon: 'icon-[material-symbols-light--delivery-truck-speed-outline]',
		},
		{
			to: 'insurance-telematics-accidents-analysis',
			name: 'Accidents',
			shouldShow: true,
			icon: 'icon-[material-symbols-light--warning-outline-rounded]',
		},
		{
			to: 'insurance-telematics-panic-alerts',
			name: 'Panic Alerts',
			shouldShow: true,
			icon: 'icon-[material-symbols-light--bolt-outline-rounded]',
		},
	];
</script>
