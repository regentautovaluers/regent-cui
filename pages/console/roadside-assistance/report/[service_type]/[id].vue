<template>
	<div class="py-10 responsive-view">
		<!-- top section with general information about the report -->
		<div class="rounded-lg border shadow-sm h-52 mx-2 lg:mx-16">
			<!-- general trip details and download button -->
			<div class="flex items-center justify-between py-3 px-8">
				<div class="flex">
					<img
						:src="serviceReport.checklist.front_image"
						alt="Responder Image"
						class="rounded-2xl size-20 object-cover shadow-sm" />
					<div class="flex-grow space-y-1 ml-5">
						<h1 class="font-semibold text-blue-600">
							{{ serviceReport.registration_no }}
						</h1>
						<div class="w-fit space-x-2">
							<span class="text-gray-500 font-semibold"
								>{{ serviceReport.vehicle_make }}
								{{ serviceReport.vehicle_model }}</span
							>
							<span class="text-gray-700 font-semibold">&middot;</span>
							<span class="text-gray-500 font-semibold">{{
								serviceReport.checklist.color
							}}</span>
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
							class="rounded-md border bg-gray-100 w-1/4 p-3">
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
						<div class="flex items-center space-x-4">
							<div
								class="size-12 flex items-center justify-center bg-pink-600 rounded-full">
								<DropOffLocationIcon :classes="['size-7']" />
							</div>
							<div class="flex-grow">
								<span class="text-gray-700 font-semibold">{{
									serviceReport.dropoff_location
								}}</span>
								<h1 class="text-gray-500">Towing Destination</h1>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="h-full border rounded-lg py-4 px-8 shadow-sm">
				<h1 class="font-semibold text-xl mb-8">Cost Breakdown</h1>
				<span class="text-gray-500 font-semibold">
					{{ serviceReport.registration_no }} had
					{{ serviceReport.current_free_distance }} Km of free towing remaining</span
				>
				<div
					class="flex w-full h-3 bg-gray-200 rounded-full overflow-hidden mt-3"
					role="progressbar"
					aria-valuenow="1"
					aria-valuemin="0"
					aria-valuemax="100">
					<div
						class="flex flex-col justify-center rounded-full overflow-hidden bg-pink-600 text-xs text-white text-center whitespace-nowrap transition duration-500"
						:style="{ width: `${currentPercentage}%` }" />
				</div>
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
			class="h-[42rem] border rounded-lg shadow-sm mt-24 mx-2 lg:mx-16 relative overflow-clip">
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
				<InfoWindow
					v-if="route.params.service_type === 'towing'"
					:options="{
						position: coordinates[1],
						minWidth: 240,
					}">
					<div class="bg-pink-600 rounded-lg p-2 text-white">
						<h1 class="font-semibold text-lg">Towing Destination</h1>
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
				class="absolute bottom-8 w-[90%] left-1/2 transform -translate-x-1/2 bg-white px-8 py-4 rounded-lg h-40 border shadow-sm flex items-center justify-between">
				<div class="w-1/3 h-full max-h-full flex items-center">
					<img
						src="/images/towing-image.jpg"
						alt="Service Image"
						class="h-full w-[40%] object-cover rounded-lg" />

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
				<div class="w-1/3 h-full max-h-full space-y-6 flex flex-col justify-center">
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
					<div class="flex items-center space-x-4">
						<div
							class="size-12 flex items-center justify-center bg-pink-600 rounded-full">
							<DropOffLocationIcon :classes="['size-7']" />
						</div>
						<div class="flex-grow">
							<span class="text-gray-700 font-semibold">{{
								serviceReport.dropoff_location
							}}</span>
							<h1 class="text-gray-500">Towing Destination</h1>
						</div>
					</div>
				</div>
				<div class="h-full max-h-full space-y-4 flex flex-col justify-start">
					<div class="flex items-center">
						<div class="size-4 bg-blue-600 rounded-full" />
						<div class="flex-grow flex justify-between items-center space-x-8 ml-1">
							<h1 class="text-gray-500">Distance:</h1>
							<span class="text-blue-500">{{ serviceReport.distance }}KM</span>
						</div>
					</div>
					<div class="flex items-center">
						<div class="size-4 bg-pink-600 rounded-full" />
						<div class="flex-grow flex justify-between items-center space-x-18 ml-1">
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
		<div class="grid grid-cols-2 gap-x-8 h-fit rounded-lg shadow-sm mt-8 mx-2 lg:mx-16">
			<!-- Collected Data Section -->
			<div class="h-[35rem] max-h-[35rem] border rounded-lg py-4 px-8 overflow-y-scroll">
				<h1 class="font-semibold text-xl mb-5">Pre-Towing Report Summary</h1>
				<div class="flex items-start space-x-4">
					<div
						class="w-[12%] border border-yellow-500 rounded-md p-2 flex justify-center items-center">
						<EngineIcon
							:classes="['size-12']"
							color="#eab308" />
					</div>
					<div>
						<h1 class="underline text-lg font-semibold">Engine Compartment</h1>
						<div
							class="flex items-center space-x-4 py-1"
							v-for="(detail, index) in computedChecklistEngineDetails"
							:index="index">
							<div class="size-5 min-h-5 min-w-5 bg-gray-300 rounded-md" />
							<span class="text-gray-500 font-semibold">{{ detail }}</span>
						</div>
					</div>
				</div>
				<div class="flex items-start space-x-4 mt-5">
					<div
						class="w-[12%] border border-pink-500 rounded-md p-2 flex justify-center items-center">
						<VehicleIcon
							:classes="['size-12']"
							color="#ec4899" />
					</div>
					<div>
						<h1 class="underline text-lg font-semibold">Exterior Vehicle Condition</h1>
						<div
							class="flex items-center space-x-4 py-1"
							v-for="(detail, index) in computedChecklistExteriorDetails"
							:index="index">
							<div class="size-5 min-h-5 min-w-5 bg-gray-300 rounded-md" />
							<span class="text-gray-500 font-semibold">{{ detail }}</span>
						</div>
					</div>
				</div>
				<div class="flex items-start space-x-4 mt-5">
					<div
						class="w-[12%] border border-green-500 rounded-md p-2 flex justify-center items-center">
						<ExtrasIcon
							:classes="['size-12']"
							color="#22c55e" />
					</div>
					<div>
						<h1 class="underline text-lg font-semibold">Extra Vehicle Details</h1>
						<div
							class="flex items-center space-x-4 py-1"
							v-for="(detail, index) in computedChecklistExtraDetails"
							:index="index">
							<div class="size-5 min-h-5 min-w-5 bg-gray-300 rounded-md" />
							<span class="text-gray-500 font-semibold">{{ detail }}</span>
						</div>
					</div>
				</div>
			</div>

			<!-- pre-towing pictures section -->
			<div class="h-[35rem] max-h-[35rem] rounded-lg relative">
				<div class="mb-2 h-[80%] max-h-[80%] border rounded-md overflow-clip">
					<img
						:src="serviceImages[activePreTowingImage]"
						alt="Report Image"
						class="w-full h-full object-contain" />
				</div>
				<div class="flex overflow-auto h-[20%] space-x-2">
					<button
						class="rounded-lg bg-yellow-500 min-w-40 border"
						:class="
							activePreTowingImage === index
								? 'border-pink-600 border-2 overflow-clip'
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
				<div class="absolute top-0 bg-gray-700 w-full p-4 bg-opacity-80 rounded-t-md">
					<h1 class="text-white font-semibold">
						Pre-Towing Pictures
						{{ serviceReport.registration_no }}
					</h1>
				</div>
			</div>
		</div>

		<!-- vehicle spares data section -->
		<div class="mt-10 mx-2 lg:mx-16 flex space-x-8">
			<div class="w-1/4 border px-8 py-2 flex items-center h-20 space-x-4 rounded-lg">
				<BatteryIcon
					:classes="['size-12']"
					:color="'#2563eb'" />
				<div class="h-full flex-grow space-y-2">
					<h1 class="text-lg text-gray-700 font-semibold">Car Battery</h1>
					<span class="text-gray-500 font-semibold">{{
						serviceReport.checklist.battery === 'yes'
							? 'Battery Present'
							: 'Battery Not Present'
					}}</span>
				</div>
			</div>
			<div class="w-1/4 border px-8 py-2 flex items-center h-20 space-x-4 rounded-lg">
				<FirstAidKitIcon
					:classes="['size-12']"
					:color="'#2563eb'" />
				<div class="h-full flex-grow space-y-2">
					<h1 class="text-lg text-gray-700 font-semibold">First Aid Kit</h1>
					<span class="text-gray-500 font-semibold">{{
						serviceReport.checklist.first_aid_kit === 'yes'
							? 'Kit Present'
							: 'Kit Not Present'
					}}</span>
				</div>
			</div>
			<div class="w-1/4 border px-8 py-2 flex items-center h-20 space-x-4 rounded-lg">
				<ToolkitIcon
					:classes="['size-12']"
					:color="'#2563eb'" />
				<div class="h-full flex-grow space-y-2">
					<h1 class="text-lg text-gray-700 font-semibold">Toolkit</h1>

					<!-- TODO: Fix the wrapping issue here -->
					<span class="text-gray-500 font-semibold">{{
						serviceReport.checklist.toolkit === 'yes'
							? 'Toolkit Present'
							: 'Toolkit Not Present'
					}}</span>
				</div>
			</div>
			<div class="w-1/4 border px-8 py-2 flex items-center h-20 space-x-4 rounded-lg">
				<GaugeIcon
					:classes="['size-12']"
					:color="'#2563eb'" />
				<div class="h-full flex-grow space-y-2">
					<h1 class="text-lg text-gray-700 font-semibold">Milage Pre-Tow</h1>
					<span class="text-gray-500 font-semibold"
						>{{ serviceReport.checklist.start_mileage }}Km</span
					>
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
					<h1 class="font-semibold text-lg text-gray-700">Vehicle Received By</h1>
					<h2 class="font-semibold text-gray-500">Asap Rocky Omondi</h2>
				</div>
			</div>
			<div class="flex-grow flex h-32 space-x-8 rounded-lg">
				<div class="w-1/2 flex items-center h-full px-8 py-2 border rounded-lg">
					<LocationPin />
					<div class="flex-grow ml-5 h-fit">
						<h1 class="font-semibold text-lg text-gray-700">Drop Off Location</h1>
						<h2 class="font-semibold text-gray-500">
							{{ serviceReport.dropoff_location }}
						</h2>
						<span class="text-blue-500 font-semibold">{{
							formatToDateTimePair(serviceReport.vehicle_drop_off_time)[0]
						}}</span>
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
	import { GoogleMap, InfoWindow, Polyline } from 'vue3-google-map';

	definePageMeta({
		name: 'roadside-assistance-reports',
		layout: 'in-app-layout',
	});

	type ChecklistItemStatus = {
		name: string;
		status: string;
	};

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
			{
				lat: serviceReport.value.dropoff_cordinates.latitude ?? 0.0,
				lng: serviceReport.value.dropoff_cordinates.longitude ?? 0.0,
			},
		];
	});
	const polylineCoords: Ref<locationCoordsMarker[]> = ref([]);

	const serviceImages: ComputedRef<any[]> = computed(() => [
		serviceReport.value.checklist.front_image,
		serviceReport.value.checklist.rear_image,
		serviceReport.value.checklist.left_side_image,
		serviceReport.value.checklist.right_side_image,
		...(serviceReport.value.checklist.impact_images ?? []),
	]);

	const activePreTowingImage: Ref<number> = ref(0);

	const currentPercentage: ComputedRef<number> = computed(
		() => (serviceReport.current_free_distance * 100) / 20,
	);

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
				`${capitalizeFirstLetterOfEachWord(item.name.replaceAll('_', ' '))}: Vehicle had ${
					item.status === 'yes'
						? capitalizeFirstLetterOfEachWord(item.name.replaceAll('_', ' '))
						: 'no ' + capitalizeFirstLetterOfEachWord(item.name.replaceAll('_', ' '))
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

<style lang="css" scoped>
	.progressbar {
		width: v-bind(currentPercentage);
	}
</style>
