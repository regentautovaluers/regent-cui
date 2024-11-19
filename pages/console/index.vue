<template>
	<div class="h-full">
		<div class="space-y-3 py-2 text-center md:text-start">
			<h1 class="text-xl font-bold md:text-3xl">Our Services</h1>
			<p class="text-base md:max-w-[80%] md:text-lg lg:max-w-[70%] xl:max-w-[65%]">
				Welcome to our all-in-one vehicle services dashboard! Please choose the service you
				need to get started on your journey.
			</p>
		</div>
		<div
			class="mt-4 flex items-center space-x-8 overflow-x-auto whitespace-nowrap py-2"
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
				:to="{ name: navigationRoutes[3].routeName }">
				<div class="homepage-quicklinks">
					<VehicleValuationIcon
						color="white"
						classes="text-xl" />
				</div>
				<span class="font-semibold text-gray-500">{{
					navigationRoutes[3].screenName
				}}</span></NuxtLink
			>
			<NuxtLink
				class="inline-flex flex-col items-center space-y-2"
				:to="{ name: navigationRoutes[1].routeName }">
				<div class="homepage-quicklinks">
					<MembershipsIcon
						color="white"
						classes="text-xl" />
				</div>
				<span class="font-semibold text-gray-500">{{
					navigationRoutes[1].screenName
				}}</span></NuxtLink
			>
			<NuxtLink
				class="inline-flex flex-col items-center space-y-2"
				:to="{ name: navigationRoutes[2].routeName }">
				<div class="homepage-quicklinks">
					<AssistanceIcon
						color="white"
						classes="text-xl" />
				</div>
				<span class="font-semibold text-gray-500">{{
					navigationRoutes[2].screenName
				}}</span></NuxtLink
			>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'mobivaluer-home',
		layout: 'console-layout',
	});

	const { navigationRoutes } = useNavigationRoutes();
	const scrollEl = ref<HTMLElement | null>(null);
</script>
