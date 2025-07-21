<template>
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-[.5fr_.5fr]">
		<div class="border-opacity-50 overflow-clip rounded-lg border border-gray-500">
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
			<h1 class="mb-4 text-xl font-semibold">Request Jumpstarting</h1>

			<div class="space-x-4 border-b font-semibold text-gray-500 lg:w-fit">
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
	import { googleMapStyle, googleMapsApiKey } from '~/config/ava-google-map-config';
	import { useGeolocation } from '@vueuse/core';

	definePageMeta({
		name: 'ra-jumpstarting-request',
		layout: 'console-layout',
	});

	const { coords, error: geolocationError, isSupported: geolocationSupported } = useGeolocation();
	const currentRegForm: Ref<number> = ref(0);
	const extraLocationMarkers: Ref<MapCoordsMarker[]> = ref([]);

	const insertIntoExtraLocationMarkers = (markerInfo: MapCoordsMarker) => {
		const index = extraLocationMarkers.value.findIndex((marker) => marker.id === markerInfo.id);
		if (index === -1) {
			extraLocationMarkers.value.push(markerInfo);
		} else {
			extraLocationMarkers.value.splice(index, 1, markerInfo);
		}
	};
</script>
