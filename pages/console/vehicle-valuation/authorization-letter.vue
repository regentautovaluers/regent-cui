<template>
	<div class="console-layout-padding flex h-full flex-col">
		<div
			class="flex h-[4%] w-full items-center space-x-4 font-semibold text-gray-500 md:text-base lg:text-lg">
			<NuxtLink
				:to="{ name: 'vehicle-valuation-create-authorization-letter' }"
				:class="[
					'border-b-2',
					doesRouteNameMatch('vehicle-valuation-create-authorization-letter')
						? 'border-b-blue-600 text-blue-600'
						: 'border-b-inherit',
				]">
				<span>Create Authorization Letter</span>
			</NuxtLink>
			<NuxtLink
				:to="{ name: 'vehicle-valuation-view-authorization-letter' }"
				:class="[
					'border-b-2',
					doesRouteNameMatch('vehicle-valuation-view-authorization-letter')
						? 'border-b-blue-600 text-blue-600'
						: 'border-b-inherit',
				]">
				<span>Previous Authorization Letters</span>
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
