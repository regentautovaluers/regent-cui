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
							class="icon-[material-symbols-light--settings-outline-rounded] text-4xl text-slate-100"></span>
					</button>
					<div>
						<h1 class="text-xl font-semibold text-gray-800">Settings</h1>
						<h2 class="text-sm text-gray-500">
							Create Accounts, Manage Branches, and Modify Your Own Credentials
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

				<!-- <NuxtLink
					:to="{ name: '3rd-party-integrations' }"
					class="relative inline-flex items-end space-x-2">
					<span
						:class="[
							'icon-[material-symbols-light--code-blocks] size-6',
							doesRouteNameMatch('3rd-party-integrations')
								? 'text-yellow-600'
								: 'text-gray-500',
						]"></span>
					<span
						:class="[
							doesRouteNameMatch('3rd-party-integrations')
								? 'font-semibold text-yellow-600 after:absolute after:-bottom-[21px] after:left-0 after:h-[5px] after:w-full after:rounded-full after:bg-yellow-600'
								: 'text-gray-500',
						]">
						Valuation Integrations
					</span>
				</NuxtLink> -->
			</div>
		</div>
		<NuxtPage />
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'settings',
		layout: 'console-layout',
	});

	const { doesRouteNameMatch } = useNavigationRoutes();
	const { isPrincipalAdmin } = useAuth();
	const routeEntries = [
		{
			to: 'settings-my-account',
			name: 'My Account',
			shouldShow: true,
			icon: 'icon-[material-symbols-light--settings-account-box]',
		},
		{
			to: 'vehicle-valuation-manage-user',
			name: 'Manage Users',
			shouldShow: isPrincipalAdmin?.value,
			icon: 'icon-[material-symbols-light--manage-accounts]',
		},
		{
			to: 'corp-branches',
			name: 'Your Branches',
			shouldShow: isPrincipalAdmin?.value,
			icon: 'icon-[material-symbols-light--home-pin-rounded]',
		},
	];
</script>
