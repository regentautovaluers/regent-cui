<template>
	<div class="grid h-full grid-cols-1 gap-4 lg:grid-cols-[.5fr,.5fr]">
		<div class="overflow-clip rounded-lg border border-gray-500 border-opacity-50">
			<GoogleMap
				ref="mapRef"
				:api-key="runtimeConfig.app.GOOGLE_MAPS_APIKEY"
				style="width: 100%; height: 100%"
				:center="clientCoordinates"
				:zoom="13"
				:zoom-control="true"
				:fullscreen-control="false"
				:street-view-control="false">
				<!-- where logged in client is -->
				<CustomMarker
					:options="{ position: clientCoordinates, anchorPoint: 'BOTTOM_CENTER' }">
					<div class="myloc-box w-fit rounded-lg bg-pink-600 p-2 text-white">
						<h1 class="text-lg font-semibold">Your Location</h1>
					</div>
				</CustomMarker>

				<!-- where client needing roadside assistance is -->
				<CustomMarker
					v-for="(marker, index) in extraLocationMarkers"
					:key="index"
					:options="{
						position: {
							lat: marker.lat,
							lng: marker.lng,
						},
					}">
					<div class="clientloc-box w-fit rounded-lg bg-pink-600 p-2 text-white">
						<h1 class="text-lg font-semibold">{{ marker.label }}</h1>
					</div>
				</CustomMarker>

				<Polyline
					:options="{
						path: [...polylineCoords],
						geodesic: true,
						strokeColor: '#ec4899',
						strokeOpacity: 1.0,
						strokeWeight: 5,
					}" />
			</GoogleMap>
		</div>
		<div>
			<h1 class="mb-4 text-3xl font-semibold antialiased">Request Towing</h1>
			<div
				class="flex flex-col items-center justify-between space-y-3 lg:flex-row lg:space-y-0">
				<div class="border-b-1 space-x-4 font-semibold text-gray-500 lg:w-fit lg:text-lg">
					<button
						@click="currentRegForm = 0"
						:class="[
							'border-b-2 pb-1',
							currentRegForm === 0
								? 'border-b-blue-600 text-blue-600'
								: 'border-b-inherit',
						]">
						<span>Registered Client</span>
					</button>
					<button
						@click="currentRegForm = 1"
						:class="[
							'border-b-2 pb-1',
							currentRegForm === 1
								? 'border-b-blue-600 text-blue-600'
								: 'border-b-inherit',
						]">
						<span>Unregistered Client</span>
					</button>
				</div>
			</div>

			<RequestRAMember
				v-if="currentRegForm === 0"
				:towing-distance="towingDistance"
				roadside-assistance-name="Towing"
				backend-r-a-name="Tow"
				@populate-map-pin="
					(markerInfo: MapCoordsMarker) => {
						insertIntoExtraLocationMarkers(markerInfo);
					}
				" />
			<RequestRANonMember
				v-if="currentRegForm === 1"
				:towing-distance="towingDistance"
				backend-r-a-name="Tow"
				roadside-assistance-name="Towing"
				@populate-map-pin="
					(markerInfo: MapCoordsMarker) => {
						insertIntoExtraLocationMarkers(markerInfo);
					}
				" />
		</div>
	</div>
</template>

<script setup lang="ts">
	import { GoogleMap, CustomMarker, Polyline } from 'vue3-google-map';
	import { type MapCoordsMarker } from '~/types';

	definePageMeta({
		name: 'ra-towing-request',
		layout: 'console-layout',
	});

	const { clientCoordinates } = useClientGeolocation();
	const runtimeConfig = useRuntimeConfig();
	const currentRegForm: Ref<number> = ref(0);
	const extraLocationMarkers: Ref<MapCoordsMarker[]> = ref([]);
	const polylineCoords: Ref<any[]> = ref([]);
	const towingDistance: Ref<number> = ref(0);

	const insertIntoExtraLocationMarkers = (markerInfo: MapCoordsMarker) => {
		const index = extraLocationMarkers.value.findIndex((marker) => marker.id === markerInfo.id);
		if (index === -1) {
			extraLocationMarkers.value.push(markerInfo);
		} else {
			extraLocationMarkers.value.splice(index, 1, markerInfo);
		}
	};

	watch(extraLocationMarkers.value, (newValue) => {
		if (newValue.length == 2) {
			const directionsService = new google.maps.DirectionsService();
			const directionsRequest = {
				origin: new google.maps.LatLng(newValue[0].lat, newValue[0].lng),
				destination: new google.maps.LatLng(newValue[1].lat, newValue[1].lng),
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

					if (leg && leg.distance) {
						// set the towing distance
						towingDistance.value = Number(leg.distance.text.split(' ')[0]);
					}
				} else {
					console.log('Failed to perform Geolocation');
				}
			});
		}
	});
</script>
