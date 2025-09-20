<template>
	<div
		class="laptop:p-4 laptop-lg:p-8 laptop:flex-1 grid grid-cols-1 gap-4 p-2 lg:grid-cols-[.5fr_.5fr]">
		<div class="border-opacity-50 min-h-96 overflow-clip rounded-lg border border-gray-500">
			<GoogleMap
				ref="mapRef"
				:api-key="googleMapsApiKey"
				:styles="googleMapStyle"
				:center="{ lat: coords.latitude, lng: coords.longitude }"
				style="width: 100%; height: 100%"
				:map-type-control="false"
				:zoom="13"
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
			</GoogleMap>
		</div>
		<div>
			<h1 class="mb-5 text-xl font-semibold antialiased">Request Jumpstarting</h1>
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
				roadside-assistance-name="Jumpstarting"
				backend-r-a-name="Jumpstart"
				@populate-map-pin="
					(markerInfo: MapCoordsMarker) => {
						insertIntoExtraLocationMarkers(markerInfo);
					}
				" />
			<RequestRANonMember
				v-if="currentRegForm === 1"
				backend-r-a-name="Jumpstart"
				roadside-assistance-name="Jumpstarting"
				@populate-map-pin="
					(markerInfo: MapCoordsMarker) => {
						insertIntoExtraLocationMarkers(markerInfo);
					}
				" />
		</div>
	</div>
</template>

<script setup lang="ts">
	import { GoogleMap, CustomMarker } from 'vue3-google-map';
	import { type MapCoordsMarker } from '~/types';
	import { googleMapStyle } from '~/config/ava-google-map-config';
	import { useGeolocation } from '@vueuse/core';

	definePageMeta({
		name: 'ra-jumpstarting-request',
		layout: 'console-layout',
	});

	const { coords, error: geolocationError, isSupported: geolocationSupported } = useGeolocation();
	const currentRegForm: Ref<number> = ref(0);
	const extraLocationMarkers: Ref<MapCoordsMarker[]> = ref([]);
	const { googleMapsApiKey } = useGoogleMapsConfig();

	const insertIntoExtraLocationMarkers = (markerInfo: MapCoordsMarker) => {
		const index = extraLocationMarkers.value.findIndex((marker) => marker.id === markerInfo.id);
		if (index === -1) {
			extraLocationMarkers.value.push(markerInfo);
		} else {
			extraLocationMarkers.value.splice(index, 1, markerInfo);
		}
	};
</script>
