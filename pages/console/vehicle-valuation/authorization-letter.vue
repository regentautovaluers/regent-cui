<template>
	<div class="console-layout-spacing">
		<!-- links strip -->
		<div
			class="hide-scrollbar mb-5 h-fit space-x-4 divide-y-2 overflow-x-scroll rounded-lg border-2 bg-white whitespace-nowrap">
			<div class="inline-flex h-28 w-full items-center justify-between p-5 outline-none">
				<div class="flex h-full items-center space-x-3">
					<button
						class="inline-flex h-[70%] w-[50px] items-center justify-center rounded-lg bg-blue-600 outline-none">
						<span
							class="icon-[material-symbols-light--fact-check-outline-rounded] text-4xl text-slate-100"></span>
					</button>
					<div>
						<h1 class="text-xl font-semibold text-gray-800">Authority Letters</h1>
						<h2 class="text-sm text-gray-500">
							Create And Access Previous Requests for Valuations
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
							'text-2xl',
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
	const { doesRouteNameMatch } = useNavigationRoutes();
	const routeEntries = [
		{
			to: 'vehicle-valuation-create-authorization-letter',
			name: 'Create Authorization Letter',
			shouldShow: true,
			icon: 'icon-[material-symbols-light--create-new-folder-rounded]',
		},
		{
			to: 'vehicle-valuation-view-authorization-letter',
			name: 'View Previous Requests',
			shouldShow: true,
			icon: 'icon-[material-symbols-light--format-list-bulleted]',
		},
	];
</script>
