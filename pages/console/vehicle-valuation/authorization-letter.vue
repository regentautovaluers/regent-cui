<template>
	<div class="console-layout-spacing flex flex-col rounded-lg border border-gray-200 bg-white">
		<div class="flex w-full items-center space-x-8 border-b-2 p-6 text-gray-500">
			<NuxtLink
				:to="{ name: 'vehicle-valuation-create-authorization-letter' }"
				:class="[
					doesRouteNameMatch('vehicle-valuation-create-authorization-letter') &&
						'font-bold text-blue-600 underline decoration-[3px] underline-offset-31',
					'inline-flex items-center space-x-2',
				]">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2m5 11h-4v4h-2v-4H7v-2h4V7h2v4h4z" />
				</svg>
				<span>Create Letter</span>
			</NuxtLink>
			<NuxtLink
				:to="{ name: 'vehicle-valuation-view-authorization-letter' }"
				:class="[
					doesRouteNameMatch('vehicle-valuation-view-authorization-letter') &&
						'font-semibold text-blue-600 underline decoration-[3px] underline-offset-31',
					'inline-flex items-center space-x-2',
				]">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M8 9q-.425 0-.712-.288T7 8t.288-.712T8 7h12q.425 0 .713.288T21 8t-.288.713T20 9zm0 4q-.425 0-.712-.288T7 12t.288-.712T8 11h12q.425 0 .713.288T21 12t-.288.713T20 13zm0 4q-.425 0-.712-.288T7 16t.288-.712T8 15h12q.425 0 .713.288T21 16t-.288.713T20 17zM4 9q-.425 0-.712-.288T3 8t.288-.712T4 7t.713.288T5 8t-.288.713T4 9m0 4q-.425 0-.712-.288T3 12t.288-.712T4 11t.713.288T5 12t-.288.713T4 13m0 4q-.425 0-.712-.288T3 16t.288-.712T4 15t.713.288T5 16t-.288.713T4 17" />
				</svg>
				<span>Previous Letters</span>
			</NuxtLink>
		</div>
		<div class="laptop:p-5 laptop-lg:p-10 h-fit flex-grow p-2">
			<NuxtPage />
		</div>
	</div>
</template>

<script setup lang="ts">
	const { doesRouteNameMatch } = useNavigationRoutes();
</script>
