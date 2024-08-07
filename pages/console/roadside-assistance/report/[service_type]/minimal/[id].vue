<template>
	<div class="py-10 responsive-view">
		<!-- top section with general information about the report -->
		<div class="rounded-lg border shadow-sm h-52 mx-2 lg:mx-16">
			<!-- general trip details and download button -->
			<div class="flex items-center justify-between py-3 px-8">
				<div class="flex">
					<div
						class="rounded-2xl size-20 bg-blue-500 flex items-center justify-center text-2xl font-semibold text-white">
						<span>{{ serviceReport.registration_no.split(' ')[0].toUpperCase() }}</span>
					</div>
					<div class="flex-grow space-y-1 ml-5">
						<h1 class="font-semibold text-blue-600">
							{{ serviceReport.registration_no }}
						</h1>
						<div class="w-fit space-x-2">
							<span class="text-gray-500 font-semibold"
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
					class="bg-blue-600 hover:bg-blue-700 text-white font-semibold uppercase px-4 py-2 rounded-xl h-14 disabled:bg-gray-300"
					disabled>
					Download Report
				</button>
			</div>
			<hr />
			<div class="flex items-start justify-between py-3 px-8">
				<div class="flex flex-col space-y-1">
					<span class="font-semibold text-gray-600">Vehicle Owner</span>
					<span class="text-gray-500">{{ serviceReport.user_name }}</span>
					<span class="text-blue-600 font-semibold">{{ serviceReport.user_phone }}</span>
				</div>
				<div class="flex flex-col space-y-1">
					<span class="font-semibold text-gray-600">Dispatcher</span>
					<span class="text-gray-500">{{
						serviceReport.control_handler.full_names
					}}</span>
					<span class="text-blue-600 font-semibold">{{
						serviceReport.control_handler.phonenumber
					}}</span>
				</div>
				<div class="flex flex-col space-y-1">
					<span class="font-semibold text-gray-600">Date & Time</span>
					<span class="text-gray-500">{{
						formatToDateTimePair(serviceReport.date_created)[0]
					}}</span>
					<span class="text-blue-600 font-semibold"
						>{{ formatToDateTimePair(serviceReport.date_created)[1] }} -
						{{ formatToDateTimePair(serviceReport.completion_time)[1] }}</span
					>
				</div>
				<div class="flex flex-col space-y-1">
					<span class="font-semibold text-gray-600">Reason</span>
					<span class="text-gray-500">{{
						capitalizeFirstLetter(serviceReport.service)
					}}</span>
				</div>
			</div>
		</div>

		<!-- responder details, trip detals and cost breakdown -->
		<div class="grid grid-cols-2 gap-x-8 h-[28rem] rounded-lg shadow-sm mt-8 mx-2 lg:mx-16">
			<div class="h-full rounded-lg flex flex-col space-y-8">
				<div class="border rounded-lg shadow-sm h-[22%] flex items-center space-x-4 px-8">
					<img
						src="https://images.unsplash.com/photo-1721048166150-3b2bb2ca3431?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
						alt="Responder Image"
						class="rounded-full size-20 object-cover shadow-sm" />
					<div class="flex-grow space-y-1">
						<h1 class="font-semibold text-gray-700">Responder</h1>
						<h2 class="font-semibold text-gray-500">
							{{ serviceReport.driver_name_snapshot }}
						</h2>
						<div class="w-fit space-x-2">
							<span
								class="text-blue-600 font-semibold bg-gray-200 rounded-xl px-2 p-1 text-sm">
								{{ serviceReport.driver_vehicle_registration_snapshot }}
							</span>
							<span class="text-gray-700 font-semibold">&middot;</span>
							<span class="text-gray-500 font-semibold"
								>{{ serviceReport.driver_vehicle_make_snapshot }}
								{{ serviceReport.driver_vehicle_model_snapshot }}</span
							>
						</div>
					</div>
				</div>
				<div class="flex-grow border rounded-lg py-4 px-8 shadow-sm">
					<h1 class="font-semibold text-xl mb-2">Trip Details</h1>
					<h1 class="font-semibold text-gray-500">
						As logged by our system on
						{{ formatToDateTimePair(serviceReport.dispatch_time)[0] }}
					</h1>
					<div class="flex items-center space-x-4 mt-8">
						<div
							v-for="(detail, index) in tripDetailsFields"
							:key="index"
							class="rounded-md border bg-gray-100 w-1/3 p-3">
							<h1 class="font-semibold text-gray-700">
								{{ detail.label }}
							</h1>
							<span class="font-semibold text-gray-500">{{ detail.value }}</span>
						</div>
					</div>
					<div class="mt-8 space-y-6">
						<div class="flex items-center space-x-4">
							<div
								class="size-12 flex items-center justify-center bg-blue-600 rounded-full">
								<PickupLocationIcon :classes="['size-7']" />
							</div>
							<div class="flex-grow">
								<span class="text-gray-700 font-semibold">{{
									serviceReport.pickup_location
								}}</span>
								<h1 class="text-gray-500">Incident Location</h1>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="h-full border rounded-lg py-4 px-8 shadow-sm">
				<h1 class="font-semibold text-xl mb-5">Cost Breakdown</h1>
				<div
					v-for="(field, index) in costBreakdownFields"
					:key="index"
					class="py-3 my-2 flex items-center justify-between text-lg"
					:class="{
						'border-b': index !== costBreakdownFields.length - 1,
					}">
					<span class="text-gray-500 font-semibold">{{ field.label }}: </span>
					<span class="text-gray-700 font-semibold">{{ field.value }}</span>
				</div>
			</div>
		</div>

		<!-- map section -->
		<div
			class="h-[42rem] border rounded-lg shadow-sm mt-12 mx-2 lg:mx-16 relative overflow-clip">
			<GoogleMap
				ref="mapRef"
				:api-key="googleMapsApiKey"
				style="width: 100%; height: 100%"
				:center="{ lat: coordinates[0].lat, lng: coordinates[0].lng }"
				:zoom="13">
				<InfoWindow
					:options="{
						position: coordinates[0],
						minWidth: 240,
					}">
					<div class="bg-pink-600 rounded-lg p-2 text-white">
						<h1 class="font-semibold text-lg">Incident Location</h1>
					</div>
				</InfoWindow>
			</GoogleMap>

			<!-- Bottom statistics -->
			<div
				class="absolute bottom-8 w-[65%] left-1/2 transform -translate-x-1/2 bg-white px-8 py-4 rounded-lg h-40 border shadow-sm grid grid-cols-2 justify-items-stretch divide-x">
				<div class="h-full max-h-full flex items-center">
					<div
						class="rounded-2xl w-[30%] h-full size-20 bg-blue-500 flex items-center justify-center text-xl font-semibold text-white">
						<span>{{ serviceReport.registration_no }}</span>
					</div>
					<div class="flex-grow space-y-1 ml-5">
						<h1 class="font-semibold text-gray-700">
							{{ serviceReport.user_name }}
						</h1>
						<div class="w-fit space-x-2 flex items-center">
							<span
								class="text-blue-600 font-semibold bg-gray-200 rounded-xl px-2 p-1 text-sm">
								KDG 880D
							</span>
							<span class="text-gray-500 font-semibold"
								>{{ serviceReport.vehicle_make }}
								{{ serviceReport.vehicle_model }}</span
							>
						</div>
						<h2 class="font-semibold text-gray-700 whitespace-nowrap">
							Tracking Id: {{ serviceReport.tracking_code }}
						</h2>
						<span class="text-gray-500 font-semibold">
							{{ formatToDateTimePair(serviceReport.date_created)[0] }}
						</span>
					</div>
				</div>
				<div class="space-y-4 pl-8 flex items-center">
					<div class="flex items-center space-x-4">
						<div
							class="size-12 flex items-center justify-center bg-blue-600 rounded-full">
							<PickupLocationIcon :classes="['size-7']" />
						</div>
						<div class="flex-grow">
							<span class="text-gray-700 font-semibold">{{
								serviceReport.pickup_location
							}}</span>
							<h1 class="text-gray-500">Incident Location</h1>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Final section with ratings -->
		<div class="mt-10 mx-2 lg:mx-16 flex space-x-8">
			<div class="w-1/3 border px-8 py-2 flex items-center h-32 space-x-4 rounded-lg">
				<img
					src="https://images.unsplash.com/photo-1721048166150-3b2bb2ca3431?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
					alt="Responder Image"
					class="rounded-full size-20 object-cover shadow-sm" />
				<div class="flex-grow ml-5 h-fit">
					<h1 class="font-semibold text-lg text-gray-700">Request Handled By</h1>
					<h2 class="font-semibold text-gray-500">
						{{ serviceReport.driver_name_snapshot }}
					</h2>
				</div>
			</div>
			<div class="flex-grow flex h-32 space-x-8 rounded-lg">
				<div class="w-1/2 flex items-center h-full px-8 py-2 border rounded-lg">
					<LocationPin />
					<div class="flex-grow ml-5 h-fit">
						<h1 class="font-semibold text-lg text-gray-700">Incident Location</h1>
						<h2 class="font-semibold text-gray-500">
							{{ serviceReport.pickup_location }}
						</h2>
					</div>
				</div>
				<div class="w-1/2 flex items-center h-full px-8 py-2 border rounded-lg">
					<PersonIcon
						width="3em"
						height="3em" />
					<div class="flex-grow ml-5 h-fit">
						<h1 class="font-semibold text-lg text-gray-700">Client Rating</h1>
						<h2 class="font-semibold text-gray-500">
							{{ serviceReport.user_name }}
						</h2>
						<div class="text-blue-500 font-semibold">
							<!-- Rating -->
							<div class="flex items-center space-x-1">
								<OneStarIcon />
								<OneStarIcon />
								<OneStarIcon />
								<ZeroStarIcon />
								<ZeroStarIcon />
								<span class="text-gray-500">(3.0)</span>
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
	import { type locationCoordsMarker } from '~/types/types';
	import { GoogleMap, InfoWindow } from 'vue3-google-map';

	definePageMeta({
		name: 'roadside-assistance-minimal-reports',
		layout: 'in-app-layout',
	});

	const runtimeConfig = useRuntimeConfig();
	const route = useRoute();
	const googleMapsApiKey = runtimeConfig.app.GOOGLE_MAPS_APIKEY;
	const mapRef: Ref<any> = ref(null);

	const { data: serviceReport } = useFetch(
		`/api/v1/control-unit/get-user-requests/${route.params.service_type}/${route.params.id}`,
		{
			baseURL: runtimeConfig.public.AVA_BASE_URL,
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
			server: true,
			lazy: true,
		},
	) as any;

	const coordinates: ComputedRef<Array<locationCoordsMarker>> = computed(() => {
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
		];
	});
</script>
