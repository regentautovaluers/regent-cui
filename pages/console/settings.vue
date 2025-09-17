<template>
	<div class="console-layout-spacing rounded-lg border border-gray-200 bg-white">
		<div class="hide-scrollbar space-x-4 overflow-x-scroll border-b p-5 whitespace-nowrap">
			<NuxtLink
				v-for="(e, idx) in routeEntries.filter((re) => re.shouldShow)"
				:key="idx"
				:to="{ name: e.to }"
				class="relative text-sm">
				<span
					:class="[
						doesRouteNameMatch(e.to)
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
	definePageMeta({
		name: 'settings',
		layout: 'console-layout',
	});

	const { doesRouteNameMatch, doesRoutePathInclude } = useNavigationRoutes();
	const routeEntries = [
		{
			to: 'settings-my-account',
			name: 'My Account',
			shouldShow: true,
		},
		{
			to: 'vehicle-valuation-manage-user',
			name: 'User Management',
			shouldShow: true,
		},
		{
			to: 'vehicle-valuation-add-user',
			name: 'New Account',
			shouldShow: true,
		},
		{
			to: 'corp-branches',
			name: 'Your Branches',
			shouldShow: true,
		},
	];
</script>
