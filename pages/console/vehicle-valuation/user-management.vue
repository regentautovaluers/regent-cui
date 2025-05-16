<template>
	<div
		class="console-layout-spacing grid flex-grow grid-cols-1 gap-10 lg:h-full lg:grid-cols-[.15fr,.85fr]">
		<div class="flex h-fit flex-col lg:h-full">
			<h1 class="mb-2 text-lg font-extrabold md:text-3xl">Actions</h1>
			<div class="flex flex-grow flex-col space-y-2">
				<NuxtLink
					:to="{ name: 'vehicle-valuation-manage-user' }"
					class="rounded-lg p-2 text-gray-500"
					:class="
						doesRouteNameMatch('vehicle-valuation-manage-user')
							? 'bg-gray-200 font-semibold'
							: 'hover:bg-gray-200'
					"
					>Manage Users</NuxtLink
				>
				<NuxtLink
					:to="{ name: 'vehicle-valuation-add-user' }"
					class="rounded-lg p-2 text-gray-500"
					:class="
						doesRouteNameMatch('vehicle-valuation-add-user')
							? 'bg-gray-200 font-semibold'
							: 'hover:bg-gray-200'
					"
					>Add New User</NuxtLink
				>
				<NuxtLink
					:to="{ name: 'corp-branches' }"
					class="rounded-lg p-2 text-gray-500"
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
		name: 'valuation-user-management',
		layout: 'console-layout',
	});

	const { doesRouteNameMatch } = useNavigationRoutes();
</script>
