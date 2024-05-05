<template>
	<div class="py-10 responsive-view h-fit">
		<h1 class="text-xl my-5 md:text-3xl font-semibold">Actions</h1>
		<div class="flex space-x-4">
			<div class="h-full flex flex-col space-y-1 w-1/6">
				<NuxtLink
					v-for="(link, index) in [
						{
							text: 'Add New User',
							to: 'valuation-users-add-user',
						},
						{
							text: 'Manage Users',
							to: 'valuation-manage-users',
						},
						{
							text: 'Update User Details',
							to: 'valuation-update-user-details',
						},
					]"
					:to="{ name: link.to }"
					class="p-2 hover:bg-gray-100 rounded-lg"
					:class="
						$route.name === link.to
							? 'text-blue-600 font-semibold'
							: null
					"
					:key="index"
					>{{ link.text }}</NuxtLink
				>
			</div>
			<div class="h-full flex-grow">
				<NuxtPage />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: "valuation-user-management",
		layout: "in-app-layout",
	});
</script>
