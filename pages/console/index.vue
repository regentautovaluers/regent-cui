<template>
	<div class="flex flex-col justify-between">
		<div class="my-24 flex flex-col items-center">
			<h1 class="text-xl uppercase text-gray-500">Hello, {{ getPrincipal.username }}</h1>
			<h2
				class="my-3 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-center text-7xl font-semibold text-transparent">
				<span>Say Hi to AVA,</span><br /><span>Our Virtual Assistant</span>
			</h2>
			<!-- TODO: Remove this button later -->
			<button
				disabled
				class="inline-flex items-center space-x-2 rounded-full bg-blue-200/30 px-4 py-1 text-blue-600">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24">
					<path
						fill="currentColor"
						fill-rule="evenodd"
						d="M3.211 19.7Q3.773 21 5.12 21h13.76q1.348 0 1.909-1.3t-.37-2.367L15.465 11V5h1.668a.92.92 0 0 0 .69-.283A1 1 0 0 0 18.096 4a1 1 0 0 0-.273-.717a.92.92 0 0 0-.69-.283H6.867a.92.92 0 0 0-.69.283A1 1 0 0 0 5.905 4q0 .434.273.717a.92.92 0 0 0 .69.283h1.668v6L3.58 17.333q-.93 1.066-.369 2.367m4.457-4.423h8.664l-2.792-3.544V5h-3.08v6.733z"
						clip-rule="evenodd" />
				</svg>
				<span>Experimental</span>
			</button>
			<p class="my-4 text-center text-lg text-gray-500">
				Hi there! I am AVA, Regent's Smart Virtual Assistant. <br />
				How can I help you today?
			</p>

			<!-- form to trigger the AI chat modal -->
			<div class="mt-10 w-[45%]">
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
			<h1 class="text-3xl font-semibold">Our Services</h1>
		</div>
		<div
			class="mb-44 flex h-fit items-center justify-center space-x-8 overflow-x-auto whitespace-nowrap py-2">
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
				<EmergencyRescueIcon
					color="white"
					classes="text-lg" />
			</ServicesQuickLinks>
		</div>

		<!-- the footer component -->
		<Footer />
	</div>
</template>

<script setup lang="ts">
	import { regentServices } from '~/config/regent-services';

	definePageMeta({
		name: 'mobivaluer-home',
		layout: 'console-layout',
	});

	const { navigationRoutes } = useNavigationRoutes();
	const { getPrincipal } = useAuth();
</script>
