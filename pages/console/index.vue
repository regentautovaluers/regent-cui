<template>
	<div class="flex min-h-full flex-col justify-between">
		<div class="my-36 flex flex-col items-center">
			<h1 class="text-xl text-gray-500">Hello {{ getPrincipal.username }}</h1>
			<h2
				class="my-3 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-center text-7xl font-semibold text-transparent">
				<span>Meet Carina,</span><br /><span>Our Smart AI Assistant</span>
			</h2>
			<!-- TODO: Remove this button later -->
			<button
				disabled
				class="inline-flex items-center space-x-2 rounded-full bg-yellow-200/30 px-4 py-1 text-yellow-600">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M12.09 2.91C10.08.9 7.07.49 4.65 1.67l4.34 4.34l-3 3l-4.34-4.34C.48 7.1.89 10.09 2.9 12.1a6.51 6.51 0 0 0 6.89 1.48l9.82 9.82l3.71-3.71l-9.78-9.79c.92-2.34.44-5.1-1.45-6.99" />
				</svg>
				<span>Under Development</span>
			</button>
			<p class="my-4 text-center text-lg text-gray-500">
				Hi there! I am Carina, Regent's Smart AI Assistant. <br />
				How can I help you today?
			</p>

			<!-- form to trigger the AI chat modal -->
			<div class="mt-10">
				<AIChatForm />
			</div>
		</div>

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
			class="mb-44 flex items-center justify-center space-x-8 overflow-x-auto whitespace-nowrap py-2">
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
	const { getPrincipal } = useAuth();
</script>
