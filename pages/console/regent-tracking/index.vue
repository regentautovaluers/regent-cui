<template>
	<div class="relative h-full overflow-clip border shadow-md">
		<GoogleMap
			ref="mapRef"
			api-key="AIzaSyDMGtdKrUaAiV_xXpNv4Ktshpe-NbDUpjY"
			:styles="googleMapStyle"
			style="width: 100%; height: 100%"
			:map-type-control="false"
			:center="clientCoordinates"
			:zoom="8"
			:zoom-control="true"
			:fullscreen-control="false"
			:street-view-control="false">
			<MarkerCluster @click="console.log('cluster clicked...')">
				<CustomMarker
					v-for="(marker, index) in trackedVehicles"
					:key="index"
					:options="{
						position: {
							lat: marker.location.lat,
							lng: marker.location.lng,
						},
						anchorPoint: 'BOTTOM_CENTER',
					}">
					<div
						class="myloc-box flex h-12 w-fit items-center space-x-2 rounded-lg bg-pink-600 text-white">
						<span
							class="inline-flex h-full w-[40px] items-center justify-center rounded-md bg-white text-base font-semibold text-pink-600"></span>
						<h1 class="text-lg font-semibold">{{ marker.vehicleReg }}</h1>
					</div>
				</CustomMarker>
			</MarkerCluster>
		</GoogleMap>

		<!-- Login modal -->
		<template v-if="!regentTrackingAuthToken">
			<ParentModal
				modal-id="regent-track-login-modal"
				modal-title="Regent Tracking Login"
				v-if="isRegentTrackLoginModalOpen"
				@close-modal="isRegentTrackLoginModalOpen = false">
				<RegentTrackingLogin />
			</ParentModal>
		</template>

		<!-- search box teleported to the navbar -->
		<Teleport to="#custom-search-box">
			<form
				@submit.prevent=""
				class="relative h-full w-1/2 text-gray-500">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="1em"
					height="1em"
					viewBox="0 0 24 24"
					class="absolute left-4 size-8 translate-y-4">
					<path
						fill="currentColor"
						d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0s.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14" />
				</svg>

				<input
					type="text"
					class="generic-input size-full rounded-2xl bg-gray-200 pl-14"
					placeholder="Search Tracked Vehicles by Reg No" />
			</form>
		</Teleport>
	</div>
</template>

<script setup lang="ts">
	import { GoogleMap, CustomMarker, MarkerCluster } from 'vue3-google-map';
	import { googleMapStyle } from '~/config/tracking-google-map-config';

	definePageMeta({
		name: 'regent-tracking-home',
		layout: 'console-layout',
	});

	const runtimeConfig = useRuntimeConfig();
	const { clientCoordinates } = useClientGeolocation();
	const isRegentTrackLoginModalOpen: Ref<boolean> = ref(true);
	const {
		regentTrackingAuthToken,
		fetchTrackedVehiclesStatus,
		fetchTrackedVehicles,
		trackedVehicles,
	} = useRegentTracking();
	console.log('GMAPS API KEY: ', process.env.GOOGLE_MAPS_API_KEY);
</script>
