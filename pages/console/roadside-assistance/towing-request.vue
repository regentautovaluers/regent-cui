<template>
	<div class="console-layout-spacing grid grid-cols-1 gap-4 lg:grid-cols-[.5fr_.5fr]">
		<div class="border-opacity-50 overflow-clip rounded-lg border border-gray-500">
			<GoogleMap
				ref="mapRef"
				:api-key="googleMapsApiKey"
				:styles="googleMapStyle"
				style="width: 100%; height: 100%"
				:center="{ lat: $clientLocation.lat, lng: $clientLocation.lng }"
				:map-type-control="false"
				:zoom="12"
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
			<h1 class="mb-4 text-xl font-semibold antialiased">Request Towing</h1>
			<div class="space-x-4 border-b font-semibold text-gray-500">
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
	import { type LocationCoords, type MapCoordsMarker } from '~/types';
	import { googleMapStyle } from '~/config/ava-google-map-config';
	import { useGoogleMapsConfig } from '~/composables/useGoogleMapsConfig';

	definePageMeta({
		name: 'ra-towing-request',
		layout: 'console-layout',
	});

	const route = useRoute();
	const { $clientLocation } = useNuxtApp();
	const currentRegForm: Ref<number> = ref(0);
	const clientCoordinates: Ref<LocationCoords> = ref({
		lat: Number(route.query.client_lat),
		lng: Number(route.query.client_lng),
	});
	const extraLocationMarkers: Ref<MapCoordsMarker[]> = ref([]);
	const polylineCoords: Ref<any[]> = ref([]);
	const towingDistance: Ref<number> = ref(0);
	const { googleMapsApiKey } = useGoogleMapsConfig();

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
