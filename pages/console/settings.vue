<template>
	<div class="console-layout-spacing">
		<div class="mb-5 flex h-fit flex-col">
			<div
				class="laptop:w-fit flex w-full items-center space-x-2 rounded-lg border-[1px] bg-white">
				<NuxtLink
					:to="{ name: 'settings-my-account' }"
					class="rounded-lg p-2 text-sm text-gray-500"
					:class="
						doesRouteNameMatch('settings-my-account')
							? 'bg-gray-200 font-semibold'
							: 'hover:bg-gray-200'
					"
					>My Account</NuxtLink
				>
				<NuxtLink
					:to="{ name: 'vehicle-valuation-manage-user' }"
					class="rounded-lg p-2 text-sm text-gray-500"
					:class="
						doesRouteNameMatch('vehicle-valuation-manage-user')
							? 'bg-gray-200 font-semibold'
							: 'hover:bg-gray-200'
					"
					>Manage Users</NuxtLink
				>
				<NuxtLink
					:to="{ name: 'vehicle-valuation-add-user' }"
					class="rounded-lg p-2 text-sm text-gray-500"
					:class="
						doesRouteNameMatch('vehicle-valuation-add-user')
							? 'bg-gray-200 font-semibold'
							: 'hover:bg-gray-200'
					"
					>Add New User</NuxtLink
				>
				<NuxtLink
					:to="{ name: 'corp-branches' }"
					class="rounded-lg p-2 text-sm text-gray-500"
					:class="
						doesRouteNameMatch('corp-branches')
							? 'bg-gray-200 font-semibold'
							: 'hover:bg-gray-200'
					"
					>Corporate Branches</NuxtLink
				>
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
</script>
