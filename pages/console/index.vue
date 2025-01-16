<template>
	<div class="flex min-h-full flex-col justify-between">
		<div class="flex flex-col items-center space-y-1 py-2">
			<button
				disabled
				class="inline-flex items-center space-x-2 rounded-full bg-blue-200/30 px-4 py-1 text-blue-600">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 16 16"
					class="text-color-inherit">
					<path
						fill="currentColor"
						d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z" />
				</svg>
				<span>Services</span>
			</button>
			<h1 class="text-3xl font-semibold">Popular Services</h1>
		</div>
		<div
			class="my-44 mt-4 flex items-center space-x-8 overflow-x-auto whitespace-nowrap py-2"
			style="
				::-webkit-scrollbar-thumb {
					border-radius: 10px;
				}

				/* Hide scrollbar for Chrome, Safari and Opera */
				::-webkit-scrollbar {
					display: none;
				}

				/* Hide scrollbar for IE, Edge and Firefox */
				.no-scrollbar {
					-ms-overflow-style: none; /* IE and Edge */
					scrollbar-width: none; /* Firefox */
				}
			">
			<!-- vehicle valuation -->
			<ServicesQuickLinks
				:title="'Vehicle Valuation'"
				:link="navigationRoutes[3].routeName"
				:service-description="regentServices[2].shortDescription">
				<VehicleValuationIcon
					color="white"
					classes="text-lg" />
			</ServicesQuickLinks>

			<!-- Roadside assistance -->
			<ServicesQuickLinks
				:title="'Roadside Assistance'"
				:link="navigationRoutes[2].routeName"
				:service-description="regentServices[0].shortDescription">
				<AssistanceIcon
					color="white"
					classes="text-lg" />
			</ServicesQuickLinks>

			<!-- emergency evacuation -->
			<ServicesQuickLinks
				:title="'Emergency Evacuation'"
				:link="navigationRoutes[2].routeName"
				:service-description="regentServices[1].shortDescription">
				<!-- TODO: Render the proper iconography here -->
				<AssistanceIcon
					color="white"
					classes="text-lg" />
			</ServicesQuickLinks>
		</div>

		<!-- the footer component -->
		<Footer />
	</div>
</template>

<script setup lang="ts">
	import { regentServices } from '~/data';

	definePageMeta({
		name: 'mobivaluer-home',
		layout: 'console-layout',
	});

	const { navigationRoutes } = useNavigationRoutes();
</script>
