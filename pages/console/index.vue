<template>
	<div class="py-10 responsive-view h-fit">
		<div>
			<h1 class="text-2xl md:text-3xl font-semibold">Our Services</h1>
			<h2 class="text-lg text-gray-500 lg:w-1/2">
				Welcome to our all-in-one vehicle services dashboard! Please choose the service you
				need to get started on your journey.
			</h2>
		</div>
		<div
			class="mt-10 flex items-center whitespace-nowrap space-x-10 py-4 overflow-x-auto"
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
			<NuxtLink
				class="inline-flex flex-col items-center space-y-2"
				:to="{ name: 'memberships-home' }">
				<div class="homepage-quicklinks">
					<MembershipsIcon
						color="white"
						classes="text-2xl" />
				</div>
				<span class="font-semibold text-gray-500">AVA Members</span></NuxtLink
			>
			<NuxtLink
				class="inline-flex flex-col items-center space-y-2"
				:to="{ name: 'ava-home' }">
				<div class="homepage-quicklinks">
					<AssistanceIcon
						color="white"
						classes="text-2xl" />
				</div>
				<span class="font-semibold text-gray-500">Roadside Assistance</span></NuxtLink
			>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'dashboard-home',
		layout: 'in-app-layout',
	});

	const availableMinifiedRoutes: any[] = [
		{
			imageLink: '/icons/home-dashboard-icons/vehicle-valuation.svg',
			toName: 'valuation-all-valuations',
			linkText: 'Vehicle Valuation',
		},
		{
			imageLink: '/icons/home-dashboard-icons/roadside-assistance.svg',
			toName: 'ava-home',
			linkText: 'Roadside Assistance',
		},
		{
			imageLink: '/icons/home-dashboard-icons/memberships.svg',
			toName: 'memberships-home',
			linkText: 'Memberships',
		},
	];
</script>
