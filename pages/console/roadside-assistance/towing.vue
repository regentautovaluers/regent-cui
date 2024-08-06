<template>
	<div class="py-10 responsive-view grid grid-cols-1 lg:grid-cols-[.5fr,.5fr]">
		<div
			class="h-96 lg:h-full w-full border border-gray-500 border-opacity-50 rounded-md overflow-clip">
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
					:options="{
						position: center,
						minWidth: 240,
					}">
					<div class="bg-blue-600 rounded-lg p-2 text-white">
						<h1 class="font-semibold text-lg">Your Current Location</h1>
					</div>
				</InfoWindow>
				<InfoWindow
					v-for="(marker, index) in otherMarkers"
					:id="index"
					:options="{
						position: marker.coords,
						minWidth: 240,
					}">
					<div class="bg-blue-600 rounded-lg p-2 text-white">
						<h1 class="font-semibold text-lg">{{ marker.info }}</h1>
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
		</div>
		<div class="p-2 lg:p-5">
			<h1 class="mb-4 text-3xl antialiased font-semibold">Request Towing</h1>
			<div
				class="my-4 bg-yellow-100 border border-yellow-200 text-sm text-yellow-800 rounded-lg p-4"
				role="alert">
				If the map adjacent to this form has not loaded, kindly click
				<button @click="reloadPage">
					<span class="font-semibold">Reload</span>
				</button>
				to reload it before filling the form.
			</div>
			<div
				class="flex flex-col lg:flex-row space-y-3 lg:space-y-0 items-center justify-between">
				<div class="text-sm md:text-base lg:text-lg border-b-1 space-x-4 w- lg:w-fit">
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
				:towing-distance="towingDistance"
				client-service-type-name="Towing"
				backend-service-type-name="Tow"
				:optional-elements-rendered="['progressBar', 'dropoffLocation']"
				@append-info-marker="
					(markerData: informativeCoordsMarker) => {
						insertIntoOtherMarkers(markerData);
					}
				" />
			<RequestServiceForUnregMember
				v-else
				:towing-distance="towingDistance"
				client-service-type-name="Towing"
				backend-service-type-name="Tow"
				:optional-elements-rendered="['dropoffLocation']"
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
	import { GoogleMap, InfoWindow, Polyline } from 'vue3-google-map';

	definePageMeta({
		name: 'ava-towing',
		layout: 'in-app-layout',
	});

	const currentRegForm: Ref<number> = ref(0);
	const runtimeConfig = useRuntimeConfig();
	const googleMapsApiKey = runtimeConfig.app.GOOGLE_MAPS_APIKEY;
	const center: Ref<locationCoordsMarker> = ref({
		lat: 0.0,
		lng: 0.0,
	});
	const mapRef: Ref<any> = ref(null);
	const otherMarkers: Ref<informativeCoordsMarker[]> = ref([]);
	const polylineCoords: Ref<any[]> = ref([]);
	const { coords } = useGeolocation();
	const towingDistance: Ref<number> = ref(0);

	watch([() => mapRef.value?.ready], ([ready]) => {
		if (!ready) {
			return;
		} else {
			center.value.lat = coords.value.latitude;
			center.value.lng = coords.value.longitude;

			if (center.value.lat !== 0.0 && center.value.lng !== 0.0)
				mapRef.value?.map.panTo({
					lat: center.value.lat,
					lng: center.value.lng,
				});
		}
	});

	watch(otherMarkers.value, (newValue) => {
		if (newValue.length > 1) {
			const delimitingCoords: locationCoordsMarker[] = [
				otherMarkers.value[0].coords,
				otherMarkers.value[1].coords,
			];

			const directionsService = new google.maps.DirectionsService();
			const directionsRequest = {
				origin: new google.maps.LatLng(delimitingCoords[0].lat, delimitingCoords[0].lng),
				destination: new google.maps.LatLng(
					delimitingCoords[1].lat,
					delimitingCoords[1].lng,
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

					if (leg) {
						// set the towing distance
						towingDistance.value = Number(leg.distance.text.split(' ')[0]);
					}
				} else {
					console.log('Failed to perform Geolocation');
				}
			});
		}
	});

	const reloadPage = (): void => {
		location.reload();
	};

	const insertIntoOtherMarkers = (markerData: informativeCoordsMarker): void => {
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
	};
</script>

<style scoped>
	.gm-style-iw > button {
		display: none;
	}
</style>
