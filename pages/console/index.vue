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
		<!-- Recent valuations and trend chart -->
		<div class="rounded- mt-4 flex h-[23rem] flex-col gap-x-2 lg:flex-row">
			<div class="flex w-[80%] max-w-[80%] flex-col rounded-lg border-[0.3px] p-2 shadow-md">
				<div class="flex h-fit items-center justify-between">
					<div>
						<h1 class="text-xl font-bold md:text-2xl">Recent Valuations</h1>
						<h2 class="text-sm font-semibold text-gray-500">
							Quick Overview of Your Most Recent Valuations
						</h2>
					</div>
					<NuxtLink
						:to="{ name: 'vehicle-valuation-home' }"
						class="flex h-14 w-36 items-center justify-center rounded-lg bg-blue-600 px-2 font-semibold text-white hover:bg-blue-700">
						View More
					</NuxtLink>
				</div>
				<div
					class="relative mt-2 flex flex-grow space-x-2 overflow-hidden"
					ref="scrollEl"
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
					<RecentValuationChip
						v-for="i in 10"
						:key="i" />
					<!-- left button -->
					<button
						type="button"
						class="group absolute start-0 top-0 z-30 h-full cursor-pointer items-center justify-center pr-1 focus:outline-none"
						@click="x -= 312"
						:class="arrivedState.left ? 'disabled' : null">
						<span
							class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 outline-none ring-4 ring-gray-200">
							<svg
								class="h-4 w-4 text-blue-600 rtl:rotate-180"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 6 10">
								<path
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 1 1 5l4 4" />
							</svg>
							<span class="sr-only">Scroll Left</span>
						</span>
					</button>
					<!-- right button -->
					<button
						type="button"
						class="group absolute end-0 top-0 z-30 h-full -translate-y-0 cursor-pointer items-center justify-center pr-1 focus:outline-none"
						:class="arrivedState.right ? 'disabled' : null"
						@click="x += 312">
						<span
							class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 outline-none ring-4 ring-gray-200">
							<svg
								class="h-4 w-4 text-blue-600 rtl:rotate-180"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 6 10">
								<path
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="m1 9 4-4-4-4" />
							</svg>
							<span class="sr-only">Scroll Right</span>
						</span>
					</button>
				</div>
			</div>
			<div
				class="flex flex-grow items-center justify-center rounded-lg border-[0.3px] shadow-md">
				<h1>Under Construction</h1>
			</div>
		</div>

		<!-- Distributions and ads -->
		<div class="rounded- mt-4 flex h-[25rem] flex-col gap-x-2 lg:flex-row">
			<div
				class="flex w-[81%] max-w-[81%] flex-col place-content-center place-items-center rounded-lg border-[0.3px] p-2 shadow-md">
				<h1>Under Construction</h1>
			</div>
			<div class="flex-grow rounded-lg border-[0.3px] shadow-md">
				<InPageCarousel />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useScroll } from '@vueuse/core';

	definePageMeta({
		name: 'mobivaluer-home',
		layout: 'console-layout',
	});

	const { navigationRoutes } = useNavigationRoutes();
	const scrollEl = ref<HTMLElement | null>(null);
	const { x, arrivedState } = useScroll(scrollEl, {
		behavior: 'smooth',
	});
</script>
