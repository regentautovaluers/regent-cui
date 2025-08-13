<template>
	<div
		class="laptop:grid-cols-[22%_78%] grid h-full min-h-full grid-cols-1 rounded-md bg-white shadow-sm">
		<div
			class="laptop-lg:border-b-0 laptop-lg:border-r-[1px] laptop:h-full laptop:space-y-4 laptop:space-x-0 laptop:flex-col hide-scrollbar my-2 flex h-fit space-x-4 overflow-x-scroll border-b-[1px] p-4">
			<NuxtLink
				:to="{ name: 'collateral-verification-manage-balances' }"
				class="laptop:w-full flex h-14 w-60 items-center justify-between gap-3 rounded-lg border border-gray-200 p-4 text-sm font-medium text-gray-500">
				<span>Token Management</span>
			</NuxtLink>
			<NuxtLink
				:to="{ name: 'collateral-verification-search-history' }"
				class="laptop:w-full flex h-14 w-60 items-center justify-between gap-3 rounded-lg border border-gray-200 p-4 text-sm font-medium text-gray-500">
				<span>Search History</span>
			</NuxtLink>
		</div>
		<div class="h-full p-4">
			<NuxtPage />
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'collateral-verification-management',
		layout: 'console-layout',
	});
</script>
