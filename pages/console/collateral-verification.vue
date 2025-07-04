<template>
	<div class="console-layout-spacing flex flex-col rounded-lg border border-gray-200 bg-white">
		<div class="flex w-full items-center space-x-8 border-b-2 p-6 text-gray-500">
			<NuxtLink
				:to="{ name: 'collateral-verification-onboard-fraudsters' }"
				:class="[
					doesRouteNameMatch('collateral-verification-onboard-fraudsters') &&
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
				<span>Onboard Defaulter</span>
			</NuxtLink>
			<NuxtLink
				:to="{ name: 'collateral-verification-manage-list' }"
				:class="[
					doesRouteNameMatch('collateral-verification-manage-list') &&
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
				<span>Manage Defaulter List</span>
			</NuxtLink>
			<NuxtLink
				:to="{ name: 'collateral-verification-query' }"
				:class="[
					doesRouteNameMatch('collateral-verification-query') &&
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
						d="M9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" />
				</svg>
				<span>Verify Collateral</span>
			</NuxtLink>
		</div>
		<div class="laptop:p-5 h-fit flex-grow p-2">
			<NuxtPage />
		</div>
	</div>
</template>
<script setup lang="ts">
	const { doesRouteNameMatch } = useNavigationRoutes();

	definePageMeta({
		layout: 'console-layout',
	});
</script>
