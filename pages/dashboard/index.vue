<template>
	<div class="py-10 responsive-view h-fit">
		<div>
			<h1 class="text-2xl md:text-3xl font-semibold">Our Services</h1>
			<h2 class="text-lg text-gray-500">
				Welcome to our all-in-one vehicle services dashboard! Please
				choose the service you need to get started on your journey.
			</h2>
		</div>
		<div class="my-20 flex items-center whitespace-nowrap space-x-10">
			<DashboardHomepageNavCards
				v-for="(link, index) in availableMinifiedRoutes"
				:key="index"
				:image-link="link.imageLink"
				:to-name="link.toName"
				:link-text="link.linkText" />
		</div>
		
		<!-- <div class="my-20 flex">
			<div class="w-3/4 min-h-80 shadow-lg border rounded-xl p-4">
				<div class="flex items-center justify-between">
					<div>
						<h1 class="text-xl md:text-2xl font-semibold">
							Recent Vehicle Valuations
						</h1>
						<h2 class="text-lg text-gray-500">
							Quick Overview of Your Most Recent Valuations
						</h2>
					</div>
					<NuxtLink
						:to="{ name: 'valuation-all-valuations' }"
						class="p-4 bg-blue-600 text-white rounded-3xl font-semibold">
						View More
					</NuxtLink>
				</div>
				<div
					class="flex flex-col items-center justify-center p-2"
					v-if="fetchCompleteErrorOrEmpty">
					<LoadingIndicator :bar-length="`w-[30%]`" />
					<span class="text-gray-500 text-lg font-semibold"
						>Loading Your Data.</span
					>
				</div>
				<div class="p-2">
					<swiper
						ref="{swiperRef}"
						:slidesPerView="4"
						:centeredSlides="false"
						:spaceBetween="1"
						:navigation="true"
						:modules="modules">
						<swiper-slide
							v-for="(
								record, index
							) in firstTenComputedValuations"
							:key="index">
							<RecentValuationsMinimal
								:vehicle-id="record.vehicle_id"
								:vehicle-reg-no="record.vehicleRegNumber"
								:client-name="toTitleCase(record.customer_name)"
								:vehicle-make="
									capitalizeFirstLetterOfEachWord(
										record.vehicleMake
									)
								"
								:vehicle-model="
									capitalizeFirstLetterOfEachWord(
										record.vehicleModel
									)
								" />
						</swiper-slide>
					</swiper>
				</div>
			</div>
		</div> -->
	</div>
</template>

<script setup lang="ts">
	import { Swiper, SwiperSlide } from "swiper/vue";
	import "swiper/css";
	import "swiper/css/pagination";
	import "swiper/css/navigation";
	import { Pagination, Navigation } from "swiper/modules";
	import type { SwiperModule } from "swiper/types";

	definePageMeta({
		name: "dashboard-home",
		layout: "in-app-layout",
	});

	// const modules: SwiperModule[] = [Pagination, Navigation];
	// const {
	// 	fetchRecentValuations,
	// 	fetchCompleteErrorOrEmpty,
	// 	firstTenComputedValuations,
	// } = useValuations();
	// 
	const availableMinifiedRoutes: any[] = [
		{
			imageLink: "/icons/home-dashboard-icons/vehicle-valuation.svg",
			toName: "valuation-all-valuations",
			linkText: "Vehicle Valuation",
		},
		{
			imageLink: "/icons/home-dashboard-icons/roadside-assistance.svg",
			toName: "ava-home",
			linkText: "Roadside Assistance",
		},
		{
			imageLink: "/icons/home-dashboard-icons/memberships.svg",
			toName: "memberships-home",
			linkText: "Memberships",
		},
	];

	// onMounted(async () => await fetchRecentValuations());
</script>

<style>
	.swiper {
		width: fit-content;
		height: fit-content;
	}

	.swiper {
		width: 100%;
		height: fit-content;
	}

	.append-buttons {
		text-align: center;
		margin-top: 20px;
	}

	.swiper-button-next,
	.swiper-button-prev {
		color: rgb(37 99 235); /* Change the color of the buttons */
		background-color: white;
		
		padding: 2px;
	}
</style>
