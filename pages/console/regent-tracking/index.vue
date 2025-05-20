<template>
	<div class="relative h-full overflow-clip border shadow-md">
		<GoogleMap
			ref="mapRef"
			:api-key="runtimeConfig.GOOGLE_MAPS_APIKEY"
			:styles="googleMapStyle"
			style="width: 100%; height: 100%"
			:map-type-control="false"
			:center="clientCoordinates"
			:zoom="13"
			:zoom-control="true"
			:fullscreen-control="false"
			:street-view-control="false">
			<!-- incident markers
			<CustomMarker
				v-for="(marker, index) in mapPinsIncidents"
				:key="index"
				:options="{
					position: {
						lat: marker.lat,
						lng: marker.lng,
					},
					anchorPoint: 'BOTTOM_CENTER',
				}">
				<div
					class="myloc-box flex h-12 w-fit items-center space-x-2 rounded-lg bg-pink-600 text-white">
					<span
						class="inline-flex h-full w-[40px] items-center justify-center rounded-md bg-white text-base font-semibold text-pink-600"
						>{{ marker.registration.split(' ')[0] }}</span
					>
					<h1 class="text-lg font-semibold">{{ marker.username }}</h1>
				</div>
			</CustomMarker> -->
		</GoogleMap>
	</div>
</template>

<script setup lang="ts">
	import { GoogleMap, CustomMarker } from 'vue3-google-map';
	import { googleMapStyle } from '~/config/tracking-google-map-config';

	definePageMeta({
		name: 'regent-tracking-home',
		layout: 'console-layout',
	});

	const runtimeConfig = useRuntimeConfig();
	const { clientCoordinates } = useClientGeolocation();
</script>
