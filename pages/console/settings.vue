<template>
	<div class="console-layout-spacing">
		<div class="mb-5 flex h-fit flex-col">
			<div
				class="laptop:w-fit hide-scrollbar mb-5 flex w-full items-center space-x-2 overflow-x-scroll rounded-full border-[1px] bg-white p-1">
				<NuxtLink
					:to="{ name: 'settings-my-account' }"
					class="h-10 rounded-full p-2 text-sm whitespace-nowrap text-gray-500"
					:class="
						doesRouteNameMatch('settings-my-account')
							? 'bg-gray-200'
							: 'hover:bg-gray-100'
					"
					>My Account</NuxtLink
				>
				<NuxtLink
					:to="{ name: 'vehicle-valuation-manage-user' }"
					class="h-10 rounded-full p-2 text-sm whitespace-nowrap text-gray-500"
					:class="
						doesRouteNameMatch('vehicle-valuation-manage-user')
							? 'bg-gray-200'
							: 'hover:bg-gray-100'
					"
					>Manage Users</NuxtLink
				>
				<NuxtLink
					:to="{ name: 'vehicle-valuation-add-user' }"
					class="h-10 rounded-full p-2 text-sm whitespace-nowrap text-gray-500"
					:class="
						doesRouteNameMatch('vehicle-valuation-add-user')
							? 'bg-gray-200'
							: 'hover:bg-gray-100'
					"
					>Add New User</NuxtLink
				>
				<NuxtLink
					:to="{ name: 'corp-branches' }"
					class="h-10 rounded-full p-2 text-sm whitespace-nowrap text-gray-500"
					:class="
						doesRouteNameMatch('corp-branches') ? 'bg-gray-200' : 'hover:bg-gray-100'
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
