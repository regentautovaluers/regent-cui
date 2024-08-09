<template>
	<div class="responsive-view grid grid-cols-1 lg:grid-cols-[.5fr,.5fr]">
		<div
			class="h-96 w-full overflow-clip rounded-md border border-gray-500 border-opacity-50 lg:h-[94.8%]">
			<GoogleMap
				ref="mapRef"
				:api-key="googleMapsApiKey"
				style="width: 100%; height: 100%"
				:center="center"
				:zoom="14"
				:zoom-control="false"
				:fullscreen-control="false"
				:street-view-control="false">
				<InfoWindow
					v-if="
						center.lat != Number.NEGATIVE_INFINITY &&
						center.lat != Number.NEGATIVE_INFINITY
					"
					minWidth="500"
					:options="{
						position: center,
					}">
					<div class="rounded-md bg-purple-600 p-2 text-white">
						<h1 class="text-lg font-semibold">You Are Here</h1>
					</div>
				</InfoWindow>
				<InfoWindow
					v-for="(marker, index) in otherMarkers"
					:ket="index"
					minWidth="500"
					:options="{
						position: marker.coords,
					}">
					<div class="rounded-md bg-purple-600 p-2 text-white">
						<h1 class="text-lg font-semibold">{{ marker.info }}</h1>
					</div>
				</InfoWindow>
			</GoogleMap>
		</div>
		<div class="p-2 lg:p-5">
			<h1 class="mb-4 text-3xl font-semibold antialiased">Request Jumpstarting</h1>
			<MapIssuesWarning />
			<div
				class="flex flex-col items-center justify-between space-y-3 lg:flex-row lg:space-y-0">
				<!-- TODO: fix issue with the border-b class to get rid of white space due to space-x-4 -->
				<div class="border-b-1 w- space-x-4 text-sm md:text-base lg:w-fit lg:text-lg">
					<button
						@click="() => (currentRegForm = 0)"
						:class="[
							'border-b-2 pb-1',
							currentRegForm === 0
								? 'border-b-blue-600 text-blue-600'
								: 'border-b-inherit',
						]">
						<span>Registered Client</span>
					</button>
					<button
						@click="() => (currentRegForm = 1)"
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
			<RequestServiceForRegMember
				v-if="currentRegForm === 0"
				client-service-type-name="Jumpstarting"
				backend-service-type-name="Jumpstart"
				:optional-elements-rendered="['vehicleClass']"
				@append-info-marker="
					(markerData: informativeCoordsMarker) => {
						insertIntoOtherMarkers(markerData);
					}
				" />
			<RequestServiceForUnregMember
				v-else
				client-service-type-name="Jumpstarting"
				backend-service-type-name="Jumpstart"
				:optional-elements-rendered="['vehicleClass']"
				@append-info-marker="
					(markerData: informativeCoordsMarker) => {
						insertIntoOtherMarkers(markerData);
					}
				" />
		</div>
	</div>
</template>

<script setup lang="ts">
	import { type locationCoordsMarker, type informativeCoordsMarker } from '~/types/types';
	import { useGeolocation } from '@vueuse/core';
	import { GoogleMap, InfoWindow } from 'vue3-google-map';

	definePageMeta({
		name: 'ava-jumpstarting',
		layout: 'in-app-layout',
	});
	const currentRegForm: Ref<number> = ref(0);
	const runtimeConfig = useRuntimeConfig();
	const googleMapsApiKey = runtimeConfig.app.GOOGLE_MAPS_APIKEY;
	const center: Ref<locationCoordsMarker> = ref({
		lat: Number.NEGATIVE_INFINITY,
		lng: Number.NEGATIVE_INFINITY,
	});
	const mapRef: Ref<any> = ref(null);
	const otherMarkers: Ref<informativeCoordsMarker[]> = ref([]);
	const { coords } = useGeolocation();

	watch([() => mapRef.value?.ready], ([ready]) => {
		if (!ready) {
			return;
		} else {
			center.value.lat = coords.value.latitude;
			center.value.lng = coords.value.longitude;

			if (
				center.value.lat !== Number.NEGATIVE_INFINITY &&
				center.value.lng !== Number.NEGATIVE_INFINITY
			)
				mapRef.value?.map.panTo({
					lat: center.value.lat,
					lng: center.value.lng,
				});
		}
	});

	function insertIntoOtherMarkers(markerData: informativeCoordsMarker): void {
		// If the array is empty, simply push the markerData object
		if (otherMarkers.value.length === 0) {
			otherMarkers.value.push(markerData);
		} else {
			// Find the index of the existing marker with the same id
			const existingMarkerIndex = otherMarkers.value.findIndex(
				(infoMarker: informativeCoordsMarker) => infoMarker.id === markerData.id,
			);

			// If an existing marker with the same id is found, replace it
			if (existingMarkerIndex !== -1) {
				otherMarkers.value[existingMarkerIndex] = markerData;
			} else {
				// If no existing marker with the same id is found, push the markerData object
				otherMarkers.value.push(markerData);
			}
		}

		// force the map to pan to this location
		mapRef.value?.map.panTo({
			lat: markerData.coords.lat,
			lng: markerData.coords.lng,
		});
	}
</script>
