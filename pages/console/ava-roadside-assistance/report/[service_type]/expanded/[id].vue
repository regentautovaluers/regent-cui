<template>
	<div class="console-layout-spacing flex flex-1 flex-col">
		<!-- top section with general information about the report -->
		<div class="rounded-lg border bg-white shadow-sm outline-none">
			<!-- general trip details and download button -->
			<div
				class="tablet:flex-row tablet:px-8 tablet:items-center tablet:space-y-0 flex min-h-24 flex-col justify-between space-y-2 px-2 py-2">
				<div class="flex text-sm">
					<div
						class="flex size-16 items-center justify-center rounded-2xl bg-blue-500 text-xl font-semibold text-white">
						<span>{{
							serviceReport.registration_no.substring(0, 3).toUpperCase()
						}}</span>
					</div>
					<div class="ml-5 flex-grow">
						<h1 class="font-semibold text-blue-600">
							{{ serviceReport.registration_no }}
						</h1>
						<div class="w-fit space-x-2">
							<span class="font-semibold text-gray-500"
								>{{ serviceReport.vehicle_make }}
								{{ serviceReport.vehicle_model }}</span
							>
							<span class="font-semibold text-gray-700">&middot;</span>
							<span class="font-semibold text-gray-500">{{
								serviceReport.checklist.color
							}}</span>
						</div>
						<h2 class="font-semibold text-blue-600">
							Tracking Id: {{ serviceReport.tracking_code }}
						</h2>
					</div>
				</div>
				<button
					class="h-12 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white uppercase hover:bg-blue-700 disabled:bg-gray-300"
					disabled>
					Download Report
				</button>
			</div>
			<hr />
			<div class="tablet:grid-cols-4 tablet:px-8 grid grid-cols-2 gap-4 px-2 py-2 text-sm">
				<div class="flex h-24 flex-col p-2">
					<span class="font-semibold text-gray-600">Vehicle Owner</span>
					<span class="text-gray-500">{{ serviceReport.user_name }}</span>
					<span class="font-semibold text-blue-600">{{ serviceReport.user_phone }}</span>
				</div>
				<div class="flex h-24 flex-col p-2">
					<span class="font-semibold text-gray-600">Dispatcher</span>
					<span class="text-gray-500">{{
						serviceReport.control_handler.full_names
					}}</span>
					<span class="font-semibold text-blue-600">{{
						serviceReport.control_handler.phonenumber
					}}</span>
				</div>
				<div class="flex h-24 flex-col p-2">
					<span class="font-semibold text-gray-600">Date & Time</span>
					<span class="text-gray-500">{{
						formatToDateTimePair(serviceReport.date_created)[0]
					}}</span>
					<span class="font-semibold text-blue-600"
						>{{ formatToDateTimePair(serviceReport.date_created)[1] }} -
						{{ formatToDateTimePair(serviceReport.completion_time)[1] }}</span
					>
				</div>
				<div class="flex h-24 flex-col p-2">
					<span class="font-semibold text-gray-600">Reason</span>
					<span class="text-gray-500">{{
						stringToTitleCase(serviceReport.service)
					}}</span>
				</div>
			</div>
		</div>

		<!-- responder details, trip detals and cost breakdown -->
		<div class="laptop:grid-cols-2 my-5 grid grid-cols-1 gap-4 rounded-lg">
			<div class="flex h-full flex-col space-y-4 rounded-lg">
				<div
					class="tablet:px-8 flex h-24 items-center space-x-4 rounded-lg border bg-white px-2 text-sm shadow-sm">
					<div
						class="flex size-16 items-center justify-center rounded-2xl bg-blue-500 text-xl font-semibold text-white">
						<span>{{
							serviceReport.driver_vehicle_registration_snapshot
								.substring(0, 3)
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
				<div
					class="tablet:px-8 flex-grow rounded-lg border bg-white px-2 py-4 text-sm shadow-sm outline-none">
					<h1 class="mb-2 font-semibold">Trip Details</h1>
					<h1 class="font-semibold text-gray-500">
						As logged by our system on
						{{ formatToDateTimePair(serviceReport.dispatch_time)[0] }}
					</h1>
					<div class="mt-5 grid grid-cols-2 gap-3">
						<div
							v-for="(detail, index) in tripDetailsFields"
							:key="index"
							class="h-16 rounded-md border bg-gray-100 p-3">
							<h1 class="font-semibold text-gray-700">
								{{ detail.label }}
							</h1>
							<span class="font-semibold text-gray-500">{{ detail.value }}</span>
						</div>
					</div>
					<div class="mt-5 space-y-6">
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
						<div class="flex items-center space-x-4">
							<div
								class="flex size-12 items-center justify-center rounded-full bg-pink-600">
								<DropOffLocationIcon classes="size-7 text-white" />
							</div>
							<div class="flex-grow">
								<span class="font-semibold text-gray-700">{{
									serviceReport.dropoff_location
								}}</span>
								<h1 class="text-gray-500">Towing Destination</h1>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div
				class="tablet:px-8 h-full rounded-lg border bg-white px-2 py-4 text-sm shadow-sm outline-none">
				<h1 class="mb-5 font-semibold">Cost Breakdown</h1>
				<span class="font-semibold text-gray-500">
					{{ serviceReport.registration_no }} had
					{{ serviceReport.current_free_distance }} Km of free towing remaining</span
				>
				<div
					class="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-gray-200"
					role="progressbar"
					aria-valuenow="1"
					aria-valuemin="0"
					aria-valuemax="100">
					<div
						class="flex flex-col justify-center overflow-hidden rounded-full bg-pink-600 text-center text-xs whitespace-nowrap text-white transition duration-500"
						:style="{ width: `${currentPercentage}%` }" />
				</div>
				<div
					v-for="(field, index) in costBreakdownFields"
					:key="index"
					class="my-2 flex items-center justify-between py-3 text-sm"
					:class="{
						'border-b': index !== costBreakdownFields.length - 1,
					}">
					<span class="font-semibold text-gray-500">{{ field.label }}: </span>
					<span class="font-semibold text-gray-700">{{ field.value }}</span>
				</div>
			</div>
		</div>

		<!-- map section -->
		<div class="relative my-5 h-168 overflow-clip rounded-lg border shadow-sm">
			<GoogleMap
				ref="mapRef"
				:api-key="googleMapsApiKey"
				:styles="googleMapStyle"
				style="width: 100%; height: 100%"
				:map-type-control="false"
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
				<InfoWindow
					v-if="route.params.service_type === 'towing'"
					:options="{
						position: coordinates[1],
						minWidth: 240,
					}">
					<div class="rounded-lg bg-pink-600 p-2 text-white">
						<h1 class="text-lg font-semibold">Towing Destination</h1>
					</div>
				</InfoWindow>
				<Polyline
					:options="{
						path: [...polylineCoords],
						geodesic: true,
						strokeColor: '#ec4899',
						strokeOpacity: 1.0,
						strokeWeight: 5,
					}" />
			</GoogleMap>

			<!-- Bottom statistics -->
			<div
				class="tablet:w-[95%] tablet:px-8 tablet:grid-cols-2 absolute bottom-8 left-1/2 grid w-full -translate-x-1/2 transform grid-cols-1 items-center justify-between gap-4 rounded-lg border bg-white px-2 py-4 shadow-sm">
				<div
					class="flex h-full max-h-full flex-col justify-center space-y-6 rounded-lg bg-gray-100 p-2 text-sm">
					<div class="flex items-center space-x-4">
						<div
							class="flex size-12 items-center justify-center rounded-full bg-blue-600">
							<PickupLocationIcon classes="size-7 text-white" />
						</div>
						<div class="flex-grow">
							<span class="font-semibold text-gray-700">{{
								serviceReport.pickup_location
							}}</span>
							<h1 class="text-gray-500">Pickup Point</h1>
						</div>
					</div>
					<div class="flex items-center space-x-4">
						<div
							class="flex size-12 items-center justify-center rounded-full bg-pink-600">
							<DropOffLocationIcon classes="size-7 text-white" />
						</div>
						<div class="flex-grow">
							<span class="font-semibold text-gray-700">{{
								serviceReport.dropoff_location
							}}</span>
							<h1 class="text-gray-500">Destination</h1>
						</div>
					</div>
				</div>
				<div
					class="fle x h-full max-h-full flex-col justify-start space-y-4 rounded-lg bg-gray-100 p-2 text-sm">
					<div class="flex items-center">
						<div class="size-4 rounded-full bg-blue-600" />
						<div class="ml-1 flex flex-grow items-center justify-between space-x-8">
							<h1 class="text-gray-500">Distance:</h1>
							<span class="text-blue-500">{{ serviceReport.distance }}KM</span>
						</div>
					</div>
					<div class="flex items-center">
						<div class="size-4 rounded-full bg-pink-600" />
						<div class="ml-1 flex flex-grow items-center justify-between space-x-18">
							<h1 class="text-gray-500">Payment:</h1>
							<span class="text-blue-500"
								>{{ serviceReport.cost + serviceReport.extra_charges }} Ksh</span
							>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- pre-towing report summary -->
		<div class="laptop:grid-cols-2 mt-8 grid h-fit grid-cols-1 gap-8 rounded-lg">
			<!-- Collected Data Section -->
			<div class="px-2">
				<h1 class="my-3 font-semibold text-gray-500">Pre-Towing Report Summary</h1>
				<div
					class="flex min-h-24 space-x-4 rounded-lg border bg-white px-8 py-4 shadow-sm outline-none">
					<div
						class="tablet:flex hidden h-fit w-20 items-center justify-center rounded-md border border-yellow-500 p-2">
						<EngineIcon
							classes="size-12"
							color="#eab308" />
					</div>
					<div class="flex-grow text-sm">
						<h1 class="font-semibold underline">Engine Compartment</h1>
						<ul>
							<li
								class="flex items-center space-x-4 py-1"
								v-for="(detail, index) in computedChecklistEngineDetails"
								:index="index">
								<svg
									class="me-2 size-4 shrink-0 text-gray-500"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									viewBox="0 0 20 20">
									<path
										d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
								</svg>
								<span class="text-gray-500">{{ detail }}</span>
							</li>
						</ul>
					</div>
				</div>
				<div
					class="mt-5 flex space-x-4 rounded-lg border bg-white px-8 py-4 shadow-sm outline-none">
					<div
						class="tablet:flex hidden h-fit w-20 items-center justify-center rounded-md border border-pink-500 p-2">
						<VehicleIcon
							classes="size-12"
							color="#ec4899" />
					</div>
					<div class="flex-grow text-sm">
						<h1 class="font-semibold underline">Exterior Vehicle Condition</h1>
						<ul>
							<li
								v-for="(detail, index) in computedChecklistExteriorDetails"
								:index="index"
								class="flex items-center space-x-4 py-1">
								<svg
									class="me-2 size-4 shrink-0 text-gray-500"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									viewBox="0 0 20 20">
									<path
										d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
								</svg>
								<span class="text-gray-500">{{ detail }}</span>
							</li>
						</ul>
					</div>
				</div>
				<div
					class="mt-5 flex space-x-4 rounded-lg border bg-white px-8 py-4 shadow-sm outline-none">
					<div
						class="tablet:flex hidden h-fit w-20 items-center justify-center rounded-md border border-green-500 p-2">
						<ExtrasIcon
							classes="size-12"
							color="#22c55e" />
					</div>
					<div class="flex-grow text-sm">
						<h1 class="font-semibold underline">Extra Vehicle Details</h1>
						<ul>
							<li
								class="flex items-center space-x-4 py-1"
								v-for="(detail, index) in computedChecklistExtraDetails"
								:index="index">
								<svg
									class="me-2 size-4 shrink-0 text-gray-500"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									viewBox="0 0 20 20">
									<path
										d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
								</svg>
								<span class="text-gray-500">{{ detail }}</span>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<!-- pre-towing pictures section -->
			<div class="laptop:h-full relative flex h-[43rem] flex-col space-y-4 rounded-lg">
				<h1
					class="absolute top-0 w-full rounded-t-md bg-gray-700 p-4 text-sm font-semibold text-white backdrop-opacity-80">
					Pre-Towing Pictures
					{{ serviceReport.registration_no }}
				</h1>
				<div
					class="mb-2 h-[80%] max-h-[80%] overflow-clip rounded-md border bg-white shadow-sm">
					<img
						:src="serviceImages[activePreTowingImage]"
						alt="Report Image"
						class="h-full w-full object-contain" />
				</div>
				<div class="flex h-[20%] space-x-2 overflow-x-auto">
					<button
						class="min-w-40 rounded-lg border bg-gray-300 shadow-sm"
						:class="
							activePreTowingImage === index
								? 'overflow-clip border-2 border-pink-600'
								: ''
						"
						v-for="(image, index) in serviceImages"
						:key="index"
						@click="activePreTowingImage = index">
						<img
							:src="image"
							class="h-full max-h-full w-full rounded-md object-cover"
							alt="Report Image" />
					</button>
				</div>
			</div>
		</div>

		<!-- vehicle spares data section -->
		<div class="mobile-lg:grid-cols-2 laptop:grid-cols-4 my-5 grid grid-cols-1 gap-4">
			<div
				class="flex h-24 items-center space-x-4 rounded-lg border bg-white px-8 py-2 shadow-sm">
				<BatteryIcon
					classes="size-8"
					:color="'#2563eb'" />
				<div class="flex h-full flex-grow flex-col justify-center text-sm">
					<h1 class="text-base font-semibold text-gray-500">Car Battery</h1>
					<span class="font-semibold text-gray-500">{{
						serviceReport.checklist.battery === 'yes' ? 'Present' : 'Not Present'
					}}</span>
				</div>
			</div>
			<div
				class="flex h-24 items-center space-x-4 rounded-lg border bg-white px-8 py-2 shadow-sm">
				<FirstAidKitIcon
					classes="size-9"
					:color="'#2563eb'" />
				<div class="flex h-full flex-grow flex-col justify-center text-sm">
					<h1 class="text-base font-semibold text-gray-500">First Aid Kit</h1>
					<span class="font-semibold text-gray-500">{{
						serviceReport.checklist.first_aid_kit === 'yes' ? 'Present' : 'Not Present'
					}}</span>
				</div>
			</div>
			<div
				class="flex h-24 items-center space-x-4 rounded-lg border bg-white px-8 py-2 shadow-sm">
				<ToolkitIcon
					classes="size-9"
					:color="'#2563eb'" />
				<div class="flex h-full flex-grow flex-col justify-center text-sm">
					<h1 class="text-base font-semibold text-gray-500">Toolkit</h1>

					<!-- TODO: Fix the wrapping issue here -->
					<span class="font-semibold text-gray-500">{{
						serviceReport.checklist.toolkit === 'yes' ? 'Present' : 'Not Present'
					}}</span>
				</div>
			</div>
			<div
				class="flex h-24 items-center space-x-4 rounded-lg border bg-white px-8 py-2 shadow-sm">
				<GaugeIcon
					classes="size-9"
					:color="'#2563eb'" />
				<div class="flex h-full flex-grow flex-col justify-center text-sm">
					<h1 class="text-base font-semibold text-gray-500">Milage</h1>
					<span class="font-semibold text-gray-500"
						>{{ serviceReport.checklist.start_mileage }}Km</span
					>
				</div>
			</div>
		</div>

		<!-- Final section with ratings -->
		<div class="tablet:grid-cols-4 mb-5 grid grid-cols-1 gap-4">
			<div
				class="flex h-24 flex-col items-start justify-center rounded-lg border bg-white px-8 py-2 text-sm shadow-sm">
				<h1 class="font-semibold text-gray-500">Vehicle Received By</h1>
				<h2 class="font-semibold text-gray-500">
					{{ serviceReport.received_by ?? 'N/A' }}
				</h2>
			</div>
			<div
				class="tablet:col-span-3 tablet:flex-row tablet:space-y-0 tablet:space-x-4 flex h-24 flex-grow flex-col space-y-4 rounded-lg">
				<div
					class="flex flex-1 items-center rounded-lg border bg-white px-8 py-2 text-sm shadow-sm outline-none">
					<!-- TODO: put location pin here -->
					<div class="ml-5 h-fit flex-grow">
						<h1 class="font-semibold text-gray-500">Drop Off Location</h1>
						<h2 class="font-semibold text-gray-500">
							{{ serviceReport.dropoff_location }}
						</h2>
						<span class="font-semibold text-blue-500">{{
							formatToDateTimePair(serviceReport.vehicle_drop_off_time)[0]
						}}</span>
					</div>
				</div>
				<div
					class="flex flex-1 items-center rounded-lg border bg-white px-8 py-2 shadow-sm outline-none">
					<AvatarIcon
						width="2em"
						height="2em" />
					<div class="ml-5 h-fit flex-grow text-sm">
						<h1 class="font-semibold text-gray-500">Client Rating</h1>
						<h2 class="font-semibold text-gray-500">
							{{ serviceReport.user_name }}
						</h2>
						<div class="font-semibold">
							<!-- Rating -->
							<div
								v-if="!computedRateStars"
								class="w-fit font-semibold text-gray-500">
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
	import { GoogleMap, InfoWindow, Polyline } from 'vue3-google-map';
	import { googleMapStyle } from '~/config/ava-google-map-config';
	import { useGoogleMapsConfig } from '~/composables/util/useGoogleMapsConfig';

	definePageMeta({
		name: 'ra-expanded-report',
		layout: 'console-layout',
	});

	type ChecklistItemStatus = {
		name: string;
		status: string;
	};

	const polylineCoords: Ref<LocationCoords[]> = ref([]);
	const activePreTowingImage: Ref<number> = ref(0);
	const runtimeConfig = useRuntimeConfig();
	const route = useRoute();
	const mapRef: Ref<any> = ref(null);
	const { googleMapsApiKey } = useGoogleMapsConfig();

	const { data: serviceReport } = (await useFetch(
		`/api/v1/control-unit/get-user-requests/${route.params.service_type}/${route.params.id}`,
		{
			baseURL: runtimeConfig.public.AVA_BASE_URL,
			method: 'GET',
			headers: {
				Accept: '',
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
			{
				lat: serviceReport.value.dropoff_cordinates.latitude ?? 0.0,
				lng: serviceReport.value.dropoff_cordinates.longitude ?? 0.0,
			},
		];
	});

	const currentPercentage: ComputedRef<number> = computed(
		() => (serviceReport.value.current_free_distance * 100) / 20,
	);

	const serviceImages: ComputedRef<any[]> = computed(() => {
		// return [
		// 	serviceReport.value.checklist.front_image,
		// 	serviceReport.value.checklist.rear_image,
		// 	serviceReport.value.checklist.left_side_image,
		// 	serviceReport.value.checklist.right_side_image,
		// 	...(serviceReport.value.checklist.impact_images ?? []),
		// ].filter((image) => {
		// 	image !== null;
		// });

		return [
			serviceReport.value.checklist.front_image,
			serviceReport.value.checklist.rear_image,
			serviceReport.value.checklist.left_side_image,
			serviceReport.value.checklist.right_side_image,
			...(serviceReport.value.checklist.impact_images ?? []),
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

	const costBreakdownFields: ComputedRef<any[]> = computed(() => {
		return [
			{
				label: 'Distance',
				value: `${serviceReport.value.distance}Km`,
			},
			{
				label: 'Had Free Towing Distance',
				value: `${serviceReport.value.current_free_distance}Km`,
			},
			{
				label: 'Billable Distance',
				value: `${serviceReport.value.billable_distance}Km`,
			},
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
				value: `${serviceReport.value.distance}Km`,
			},
			{
				label: 'Dispatch',
				value: `${formatToDateTimePair(serviceReport.value.dispatch_time)[1]}`,
			},
			{
				label: 'Arrival',
				value: `${formatToDateTimePair(serviceReport.value.arrival_time)[1]}`,
			},
			{
				label: 'Dropoff',
				value: `${formatToDateTimePair(serviceReport.value.vehicle_drop_off_time)[1]}`,
			},
		];
	});

	const computedChecklistExteriorDetails: ComputedRef<string[]> = computed(() => {
		const uniqueKeys: readonly string[] = [
			'side_mirrors',
			'headlight_lenses',
			'fog_spot_lights',
			'tail_light_lenses',
			'antenna',
			'wipers',
			'front_back_bumper',
			'front_back_registration_plates',
		];
		return checklistPropertiesTransformer(uniqueKeys, serviceReport.value.checklist);
	});

	const computedChecklistExtraDetails: ComputedRef<string[]> = computed(() => {
		const uniqueKeys: readonly string[] = [
			'jack',
			'toolkit',
			'wheel_spanner',
			'first_aid_kit',
			'tow_hooks',
			'warning_triangle',
		];
		return checklistPropertiesTransformer(uniqueKeys, serviceReport.value.checklist);
	});

	const computedChecklistEngineDetails: ComputedRef<string[]> = computed(() => {
		const uniqueKeys: readonly string[] = ['battery'];
		return checklistPropertiesTransformer(uniqueKeys, serviceReport.value.checklist);
	});

	const checklistPropertiesTransformer = (
		keys: readonly string[],
		sourceObject: any,
	): string[] => {
		const checklistItems: ChecklistItemStatus[] = keys.map((key) => {
			return {
				name: key,
				status: sourceObject[key],
			};
		});

		return checklistItems.map(
			(item) =>
				`${stringToTitleCase(item.name.replaceAll('_', ' '))}: Vehicle had ${
					item.status === 'yes'
						? stringToTitleCase(item.name.replaceAll('_', ' '))
						: 'no ' + stringToTitleCase(item.name.replaceAll('_', ' '))
				}`,
		);
	};

	onMounted(async () => {
		setTimeout(() => {
			const directionsService = new google.maps.DirectionsService();
			const directionsRequest = {
				origin: new google.maps.LatLng(coordinates.value[0].lat, coordinates.value[0].lng),
				destination: new google.maps.LatLng(
					coordinates.value[1].lat,
					coordinates.value[1].lng,
				),
				travelMode: google.maps.TravelMode.DRIVING,
				unitSystem: google.maps.UnitSystem.METRIC,
				drivingOptions: {
					departureTime: new Date(Date.now()),
					trafficModel: 'optimistic',
				},
			};

			directionsService.route(directionsRequest, (result, status) => {
				if (status === google.maps.DirectionsStatus.OK && result) {
					const route = result.routes[0];
					const leg = route.legs[0];
					const steps = leg.steps;

					// list of intermediate co-ordinates
					polylineCoords.value = steps.flatMap((step) =>
						step.path.map((latLng) => ({
							lat: latLng.lat(),
							lng: latLng.lng(),
						})),
					);
				} else {
					console.log('Failed to perform Geolocation');
				}
			});
		}, 1500);
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
