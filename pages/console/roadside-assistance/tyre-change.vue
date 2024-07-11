<template>
	<div
		class="py-10 responsive-view grid grid-cols-1 lg:grid-cols-[.5fr,.5fr]">
		<div
			class="h-96 lg:h-full w-full border border-gray-500 border-opacity-50 rounded-md overflow-clip">
			<GoogleMap
				ref="mapRef"
				:api-key="googleMapsApiKey"
				style="width: 100%; height: 100%"
				:center="center"
				:zoom="14">
				<InfoWindow
					v-if="
						center.lat != Number.NEGATIVE_INFINITY &&
						center.lat != Number.NEGATIVE_INFINITY
					"
					minWidth="500"
					:options="{
						position: center,
					}">
					<div class="bg-purple-600 rounded-md p-2 text-white">
						<h1 class="font-semibold text-lg">You Are Here</h1>
					</div>
				</InfoWindow>
				<InfoWindow
					v-for="(marker, index) in otherMarkers"
					:ket="index"
					minWidth="500"
					:options="{
						position: marker.coords,
					}">
					<div class="bg-purple-600 rounded-md p-2 text-white">
						<h1 class="font-semibold text-lg">{{ marker.info }}</h1>
					</div>
				</InfoWindow>
			</GoogleMap>
		</div>
		<div class="p-2 lg:p-5">
			<h1 class="mb-4 text-3xl antialiased font-semibold">
				Request Tyre Change
			</h1>
			<div
				class="my-4 bg-yellow-100 border border-yellow-200 text-sm text-yellow-800 rounded-lg p-4 dark:bg-yellow-800/10 dark:border-yellow-900 dark:text-yellow-500"
				role="alert">
				If the map adjacent to this form has not loaded properly, kindly
				click
				<button @click="reloadPage">
					<span class="font-semibold">Reload</span>
				</button>
				to reload it before filling the form.
			</div>
			<div
				class="flex flex-col lg:flex-row space-y-3 lg:space-y-0 items-center justify-between">
				<!-- TODO: fix issue with the border-b class to get rid of white space due to space-x-4 -->
				<div
					class="text-sm md:text-base lg:text-lg border-b-1 space-x-4 w- lg:w-fit">
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
				client-service-type-name="Tyre Change"
				backend-service-type-name="Tyre"
				:optional-elements-rendered="['tyreMetadata']"
				@append-info-marker="
					(markerData: informativeCoordsMarker) => {
						insertIntoOtherMarkers(markerData);
					}
				" />
			<RequestServiceForUnregMember
				v-else
				client-service-type-name="Tyre Change"
				backend-service-type-name="Tyre"
				:optional-elements-rendered="['tyreMetadata']"
				@append-info-marker="
					(markerData: informativeCoordsMarker) => {
						insertIntoOtherMarkers(markerData);
					}
				" />
		</div>
	</div>
</template>

<script setup lang="ts">
	import {
		type locationCoordsMarker,
		type informativeCoordsMarker,
	} from "~/types/types";
	import { useGeolocation } from "@vueuse/core";
	import { GoogleMap, InfoWindow } from "vue3-google-map";

	definePageMeta({
		name: "ava-tyre-change",
		layout: "in-app-layout",
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

			console.log("You are at: ", JSON.stringify(center.value, null, 2));
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

	function reloadPage() {
		location.reload();
	}

	function insertIntoOtherMarkers(markerData: informativeCoordsMarker): void {
		// If the array is empty, simply push the markerData object
		if (otherMarkers.value.length === 0) {
			otherMarkers.value.push(markerData);
		} else {
			// Find the index of the existing marker with the same id
			const existingMarkerIndex = otherMarkers.value.findIndex(
				(infoMarker: informativeCoordsMarker) =>
					infoMarker.id === markerData.id
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
