<template>
	<div class="console-layout-spacing">
		<!-- top section with general information about the report -->
		<div class="h-52 rounded-lg border shadow-sm">
			<!-- general trip details and download button -->
			<div class="flex items-center justify-between px-8 py-3">
				<div class="flex">
					<div
						class="flex size-20 items-center justify-center rounded-2xl bg-blue-500 text-2xl font-semibold text-white">
						<span>{{ serviceReport.registration_no.split(' ')[0].toUpperCase() }}</span>
					</div>
					<div class="ml-5 flex-grow space-y-1">
						<h1 class="font-semibold text-blue-600">
							{{ serviceReport.registration_no }}
						</h1>
						<div class="w-fit space-x-2">
							<span class="font-semibold text-gray-500"
								>{{ serviceReport.vehicle_make }}
								{{ serviceReport.vehicle_model }}</span
							>
						</div>
						<h2 class="font-semibold text-blue-600">
							Tracking Id: {{ serviceReport.tracking_code }}
						</h2>
					</div>
				</div>
				<button
					class="h-14 rounded-xl bg-blue-600 px-4 py-2 font-semibold uppercase text-white hover:bg-blue-700 disabled:bg-gray-300"
					disabled>
					Download Report
				</button>
			</div>
			<hr />
			<div class="flex items-start justify-between px-8 py-3">
				<div class="flex flex-col space-y-1">
					<span class="font-semibold text-gray-600">Vehicle Owner</span>
					<span class="text-gray-500">{{ serviceReport.user_name }}</span>
					<span class="font-semibold text-blue-600">{{ serviceReport.user_phone }}</span>
				</div>
				<div class="flex flex-col space-y-1">
					<span class="font-semibold text-gray-600">Dispatcher</span>
					<span class="text-gray-500">{{
						serviceReport.control_handler.full_names
					}}</span>
					<span class="font-semibold text-blue-600">{{
						serviceReport.control_handler.phonenumber
					}}</span>
				</div>
				<div class="flex flex-col space-y-1">
					<span class="font-semibold text-gray-600">Date & Time</span>
					<span class="text-gray-500">{{
						formatToDateTimePair(serviceReport.date_created)[0]
					}}</span>
					<span class="font-semibold text-blue-600"
						>{{ formatToDateTimePair(serviceReport.date_created)[1] }} -
						{{ formatToDateTimePair(serviceReport.completion_time)[1] }}</span
					>
				</div>
				<div class="flex flex-col space-y-1">
					<span class="font-semibold text-gray-600">Reason</span>
					<span class="text-gray-500">{{
						stringToTitleCase(serviceReport.service)
					}}</span>
				</div>
			</div>
		</div>

		<!-- responder details, trip detals and cost breakdown -->
		<div class="mt-8 grid h-[28rem] grid-cols-2 gap-x-8 rounded-lg shadow-sm">
			<div class="flex h-full flex-col space-y-8 rounded-lg">
				<div class="flex h-[22%] items-center space-x-4 rounded-lg border px-8 shadow-sm">
					<div
						class="flex size-20 items-center justify-center rounded-2xl bg-blue-500 text-2xl font-semibold text-white">
						<span>{{
							serviceReport.driver_vehicle_registration_snapshot
								.split(' ')[0]
								.toUpperCase()
						}}</span>
					</div>
					<div class="flex-grow space-y-1">
						<h1 class="font-semibold text-gray-700">Responder</h1>
						<h2 class="font-semibold text-gray-500">
							{{ serviceReport.driver_name_snapshot }}
						</h2>
						<div class="w-fit space-x-2">
							<span
								class="rounded-xl bg-gray-200 p-1 px-2 text-sm font-semibold text-blue-600">
								{{ serviceReport.driver_vehicle_registration_snapshot }}
							</span>
							<span class="font-semibold text-gray-700">&middot;</span>
							<span class="font-semibold text-gray-500"
								>{{ serviceReport.driver_vehicle_make_snapshot }}
								{{ serviceReport.driver_vehicle_model_snapshot }}</span
							>
						</div>
					</div>
				</div>
				<div class="flex-grow rounded-lg border px-8 py-4 shadow-sm">
					<h1 class="mb-2 text-xl font-semibold">Trip Details</h1>
					<h1 class="font-semibold text-gray-500">
						As logged by our system on
						{{ formatToDateTimePair(serviceReport.dispatch_time)[0] }}
					</h1>
					<div class="mt-8 flex items-center space-x-4">
						<div
							v-for="(detail, index) in tripDetailsFields"
							:key="index"
							class="w-1/3 rounded-md border bg-gray-100 p-3">
							<h1 class="font-semibold text-gray-700">
								{{ detail.label }}
							</h1>
							<span class="font-semibold text-gray-500">{{ detail.value }}</span>
						</div>
					</div>
					<div class="mt-8 space-y-6">
						<div class="flex items-center space-x-4">
							<div
								class="flex size-12 items-center justify-center rounded-full bg-blue-600">
								<PickupLocationIcon classes="size-7 text-white" />
							</div>
							<div class="flex-grow">
								<span class="font-semibold text-gray-700">{{
									serviceReport.pickup_location
								}}</span>
								<h1 class="text-gray-500">Incident Location</h1>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="h-full rounded-lg border px-8 py-4 shadow-sm">
				<h1 class="mb-5 text-xl font-semibold">Cost Breakdown</h1>
				<div
					v-for="(field, index) in costBreakdownFields"
					:key="index"
					class="my-2 flex items-center justify-between py-3 text-lg"
					:class="{
						'border-b': index !== costBreakdownFields.length - 1,
					}">
					<span class="font-semibold text-gray-500">{{ field.label }}: </span>
					<span class="font-semibold text-gray-700">{{ field.value }}</span>
				</div>
			</div>
		</div>

		<!-- map section -->
		<div class="relative mt-12 h-[42rem] overflow-clip rounded-lg border shadow-sm">
			<GoogleMap
				ref="mapRef"
				:api-key="googleMapsApiKey"
				:styles="googleMapStyle"
				style="width: 100%; height: 100%"
				:center="{ lat: coordinates[0].lat, lng: coordinates[0].lng }"
				:zoom="12"
				:zoom-control="true"
				:fullscreen-control="false"
				:street-view-control="false">
				<InfoWindow
					:options="{
						position: coordinates[0],
						minWidth: 240,
					}">
					<div class="rounded-lg bg-pink-600 p-2 text-white">
						<h1 class="text-lg font-semibold">Incident Location</h1>
					</div>
				</InfoWindow>
			</GoogleMap>

			<!-- Bottom statistics -->
			<div
				class="absolute bottom-8 left-1/2 grid h-40 w-[65%] -translate-x-1/2 transform grid-cols-2 justify-items-stretch divide-x rounded-lg border bg-white px-8 py-4 shadow-sm">
				<div class="flex h-full max-h-full items-center">
					<div
						class="flex size-20 h-full w-[30%] items-center justify-center rounded-2xl bg-blue-500 text-xl font-semibold text-white">
						<span>{{ serviceReport.registration_no }}</span>
					</div>
					<div class="ml-5 flex-grow space-y-1">
						<h1 class="font-semibold text-gray-700">
							{{ serviceReport.user_name }}
						</h1>
						<div class="flex w-fit items-center space-x-2">
							<span
								class="rounded-xl bg-gray-200 p-1 px-2 text-sm font-semibold text-blue-600">
								KDG 880D
							</span>
							<span class="font-semibold text-gray-500"
								>{{ serviceReport.vehicle_make }}
								{{ serviceReport.vehicle_model }}</span
							>
						</div>
						<h2 class="whitespace-nowrap font-semibold text-gray-700">
							Tracking Id: {{ serviceReport.tracking_code }}
						</h2>
						<span class="font-semibold text-gray-500">
							{{ formatToDateTimePair(serviceReport.date_created)[0] }}
						</span>
					</div>
				</div>
				<div class="flex items-center space-y-4 pl-8">
					<div class="flex items-center space-x-4">
						<div
							class="flex size-12 items-center justify-center rounded-full bg-blue-600">
							<PickupLocationIcon classes="size-7 text-white" />
						</div>
						<div class="flex-grow">
							<span class="font-semibold text-gray-700">{{
								serviceReport.pickup_location
							}}</span>
							<h1 class="text-gray-500">Incident Location</h1>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Final section with ratings -->
		<div class="mt-10 flex space-x-8">
			<div class="flex h-32 w-1/3 items-center space-x-4 rounded-lg border px-8 py-2">
				<img
					src="https://images.unsplash.com/photo-1721048166150-3b2bb2ca3431?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
					alt="Responder Image"
					class="size-20 rounded-full object-cover shadow-sm" />
				<div class="ml-5 h-fit flex-grow">
					<h1 class="text-lg font-semibold text-gray-700">Request Handled By</h1>
					<h2 class="font-semibold text-gray-500">
						{{ serviceReport.driver_name_snapshot }}
					</h2>
				</div>
			</div>
			<div class="flex h-32 flex-grow space-x-8 rounded-lg">
				<div class="flex h-full w-1/2 items-center rounded-lg border px-8 py-2">
					<LocationPin />
					<div class="ml-5 h-fit flex-grow">
						<h1 class="text-lg font-semibold text-gray-700">Incident Location</h1>
						<h2 class="font-semibold text-gray-500">
							{{ serviceReport.pickup_location }}
						</h2>
						<span class="font-semibold text-blue-500">{{
							formatToDateTimePair(serviceReport.date_created)[0]
						}}</span>
					</div>
				</div>
				<div class="flex h-full w-1/2 items-center rounded-lg border px-8 py-2">
					<PersonIcon
						width="3em"
						height="3em" />
					<div class="ml-5 h-fit flex-grow">
						<h1 class="text-lg font-semibold text-gray-700">Client Rating</h1>
						<h2 class="font-semibold text-gray-500">
							{{ serviceReport.user_name }}
						</h2>
						<div class="font-semibold">
							<!-- Rating -->
							<div
								v-if="!computedRateStars"
								class="w-fit font-semibold">
								<span>Not Rated Yet</span>
							</div>
							<div
								v-else
								class="flex w-fit items-center space-x-1">
								<OneStarIcon
									v-for="star in computedRateStars"
									:key="star" />
								<ZeroStarIcon
									v-if="computedRateStars < 5"
									v-for="star in 5 - computedRateStars"
									:key="star" />

								<span class="text-gray-500"> ({{ computedRateStars }} Stars)</span>
							</div>
							<!-- End Rating -->
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { type LocationCoords } from '~/types';
	import { GoogleMap, InfoWindow } from 'vue3-google-map';
	import { googleMapStyle } from '~/data';

	definePageMeta({
		name: 'ra-minimized-report',
		layout: 'console-layout',
	});

	const runtimeConfig = useRuntimeConfig();
	const route = useRoute();
	const googleMapsApiKey = runtimeConfig.GOOGLE_MAPS_APIKEY;
	const mapRef: Ref<any> = ref(null);

	const { data: serviceReport } = (await useFetch(
		`/api/v1/control-unit/get-user-requests/${route.params.service_type}/${route.params.id}`,
		{
			baseURL: runtimeConfig.public.AVA_BASE_URL,
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
			server: true,
		},
	)) as any;

	const coordinates: ComputedRef<Array<LocationCoords>> = computed(() => {
		return [
			{
				lat: serviceReport.value.pickup_cordinates.latitude ?? 0.0,
				lng: serviceReport.value.pickup_cordinates.longitude ?? 0.0,
			},
		];
	});

	const costBreakdownFields: ComputedRef<any[]> = computed(() => {
		return [
			{
				label: 'Service Charge',
				value: `Ksh ${serviceReport.value.cost}`,
			},
			{
				label: 'Extra Charges',
				value: `Ksh ${serviceReport.value.extra_charges}`,
			},
			{
				label: 'Total',
				value: `Ksh ${serviceReport.value.cost + serviceReport.value.extra_charges}`,
			},
		];
	});

	const tripDetailsFields: ComputedRef<any[]> = computed(() => {
		return [
			{
				label: 'Distance',
				value: 'N/A',
			},
			{
				label: 'Dispatch',
				value: `${formatToDateTimePair(serviceReport.value.dispatch_time)[1]}`,
			},
			{
				label: 'Arrival',
				value: `${formatToDateTimePair(serviceReport.value.arrival_time)[1]}`,
			},
		];
	});

	const computedRateStars: ComputedRef<number | null> = computed(() => {
		const rawRate = serviceReport.value.driver_rating;
		return rawRate && Number.isInteger(rawRate)
			? Math.round(rawRate)
			: rawRate && rawRate % 1 !== 0 && rawRate > rawRate - 0.5
				? Math.ceil(rawRate)
				: rawRate
					? Math.round(rawRate)
					: null;
	});
</script>

<style lang="css">
	@media print {
		#top-nav {
			display: none !important;
		}

		@page {
			margin-left: 0.3in;
			margin-right: 0.3in;
			margin-top: 0;
			margin-bottom: 0;
		}
	}
</style>
