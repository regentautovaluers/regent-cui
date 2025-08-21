<template>
	<div
		class="laptop:p-4 laptop-lg:p-8 laptop:flex-1 grid grid-cols-1 gap-4 p-2 lg:grid-cols-[.5fr_.5fr]">
		<div class="border-opacity-50 min-h-96 overflow-clip rounded-lg border border-gray-500">
			<GoogleMap
				ref="mapRef"
				:api-key="googleMapsApiKey"
				:styles="googleMapStyle"
				style="width: 100%; height: 100%"
				:center="{ lat: coords.latitude, lng: coords.longitude }"
				:map-type-control="false"
				:zoom="12"
				:zoom-control="true"
				:fullscreen-control="false"
				:street-view-control="false">
				<!-- where logged in client is -->
				<CustomMarker
					:options="{
						position: { lat: coords.latitude, lng: coords.longitude },
						anchorPoint: 'BOTTOM_CENTER',
					}">
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
			<h1 class="mb-5 text-xl font-semibold antialiased">Request Towing</h1>
			<div class="mb-5 flex items-center text-gray-500">
				<button
					@click="currentRegForm = 0"
					class="relative w-1/2 pb-1">
					<span
						:class="
							currentRegForm === 0 &&
							'font-semibold text-blue-600 after:absolute after:-bottom-[2px] after:left-0 after:h-[2.5px] after:w-full after:bg-blue-600'
						"
						>Registered Client</span
					>
				</button>
				<button
					@click="currentRegForm = 1"
					class="relative w-1/2 pb-1">
					<span
						:class="
							currentRegForm === 1 &&
							'font-semibold text-blue-600 after:absolute after:-bottom-[2px] after:left-0 after:h-[2.5px] after:w-full after:bg-blue-600'
						"
						>Registered Client</span
					>
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
	import { type MapCoordsMarker } from '~/types';
	import { googleMapStyle, googleMapsApiKey } from '~/config/ava-google-map-config';
	import { useGeolocation } from '@vueuse/core';

	definePageMeta({
		name: 'ra-towing-request',
		layout: 'console-layout',
	});

	const { coords, error: geolocationError, isSupported: geolocationSupported } = useGeolocation();
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
