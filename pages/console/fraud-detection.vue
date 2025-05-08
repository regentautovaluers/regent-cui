<template>
	<div class="flex h-full flex-col">
		<div
			class="flex h-[4%] w-full items-center space-x-4 font-semibold text-gray-500 md:text-base lg:text-lg">
			<NuxtLink
				:to="{ name: 'fraud-detection-onboard-fraudsters' }"
				:class="[
					'border-b-2',
					doesRouteNameMatch('fraud-detection-onboard-fraudsters')
						? 'border-b-blue-600 text-blue-600'
						: 'border-b-inherit',
				]">
				<span>Onboard Fraudsters</span>
			</NuxtLink>
			<NuxtLink
				:to="{ name: 'fraud-detection-manage-list' }"
				:class="[
					'border-b-2',
					doesRouteNameMatch('fraud-detection-manage-list')
						? 'border-b-blue-600 text-blue-600'
						: 'border-b-inherit',
				]">
				<span>Manage List</span>
			</NuxtLink>
            <NuxtLink
				:to="{ name: 'fraud-detection-query-fraudsters' }"
				:class="[
					'border-b-2',
					doesRouteNameMatch('fraud-detection-query-fraudsters')
						? 'border-b-blue-600 text-blue-600'
						: 'border-b-inherit',
				]">
				<span>Query Our Fraud Database</span>
			</NuxtLink>
		</div>
		<div class="min-h-[96%] flex-grow">
			<NuxtPage />
		</div>
	</div>
</template>

<script setup lang="ts">
	const { doesRouteNameMatch } = useNavigationRoutes();
</script>
