<template>
	<div class="console-layout-spacing grid grid-cols-1 gap-4 lg:grid-cols-[.5fr_.5fr]">
		<div class="border-opacity-50 overflow-clip rounded-lg border border-gray-500">
			<GoogleMap
				ref="mapRef"
				:api-key="googleMapsApiKey"
				:styles="googleMapStyle"
				style="width: 100%; height: 100%"
				:map-type-control="false"
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
			</GoogleMap>
		</div>
		<div>
			<h1 class="mb-4 text-xl font-semibold antialiased">Request Tyrechange</h1>

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
				roadside-assistance-name="Tyre Change"
				backend-r-a-name="Tyre"
				@populate-map-pin="
					(markerInfo: MapCoordsMarker) => {
						insertIntoExtraLocationMarkers(markerInfo);
					}
				" />
			<RequestRANonMember
				v-if="currentRegForm === 1"
				backend-r-a-name="Tyre"
				roadside-assistance-name="Tyre Change"
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
	import { type LocationCoords, type MapCoordsMarker } from '~/types';
	import { googleMapStyle } from '~/config/ava-google-map-config';
	import { useGoogleMapsConfig } from '~/composables/useGoogleMapsConfig';

	definePageMeta({
		name: 'ra-tyrechange-request',
		layout: 'console-layout',
	});

	const route = useRoute();
	const runtimeConfig = useRuntimeConfig();
	const currentRegForm: Ref<number> = ref(0);
	const clientCoordinates: Ref<LocationCoords> = ref({
		lat: Number(route.query.client_lat),
		lng: Number(route.query.client_lng),
	});
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
