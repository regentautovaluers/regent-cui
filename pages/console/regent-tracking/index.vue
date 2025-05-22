<template>
	<div
		:class="[
			'ease-liner relative h-full overflow-clip border shadow-md transition-all duration-200',
			activeTrackedDevice ? 'console-layout-spacing flex' : 'block',
		]">
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
			<MarkerCluster>
				<CustomMarker
					v-for="(marker, index) in vehicles"
					:key="index"
					:options="{
						position: {
							lat: marker.location.lat,
							lng: marker.location.lng,
						},
						anchorPoint: 'BOTTOM_CENTER',
					}"
					@click="activeTrackedDevice = marker">
					<div
						class="myloc-box flex h-12 w-fit items-center space-x-2 rounded-lg bg-pink-600 text-white">
						<h1 class="text-lg font-semibold">{{ marker.vehicleReg }}</h1>
					</div>
				</CustomMarker>
			</MarkerCluster>
		</GoogleMap>
		<div
			class="relative flex h-full w-[30%] flex-col border-l-2 border-gray-500"
			v-if="activeTrackedDevice">
			<div class="border-b- flex h-[7%] items-center justify-between bg-gray-200 px-4">
				<h1 class="text-xl font-semibold uppercase text-gray-500">
					{{ activeTrackedDevice.vehicleReg }}
				</h1>
			</div>
			<button
				class="absolute -left-4 top-1/2 flex size-8 items-center justify-center rounded-full bg-white text-gray-500 shadow-md transition-colors hover:bg-gray-300"
				@click="activeTrackedDevice = null">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M9.293 18.707a1 1 0 0 1 0-1.414L14.586 12L9.293 6.707a1 1 0 0 1 1.414-1.414l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414 0" />
				</svg>
			</button>
			<div class="flex-grow space-y-2 p-2 text-gray-500">
				<div class="flex items-center justify-between border-b-[1px] border-gray-300 py-4">
					<span class="font-semibold">Stop Duration:</span>
					<span v-if="activeTrackedDevice.stopDuration">{{
						activeTrackedDevice.stopDuration
					}}</span>
					<span v-else>-</span>
				</div>
				<div class="flex items-center justify-between border-b-[1px] border-gray-300 py-4">
					<span class="font-semibold">Driver:</span>
					<span
						v-if="activeTrackedDevice.driver.name && activeTrackedDevice.driver.phone">
						{{ activeTrackedDevice.driver.name }} ({{
							activeTrackedDevice.driver.phone
						}})
					</span>
					<span v-else>-</span>
				</div>
				<div class="flex items-center justify-between border-b-[1px] border-gray-300 py-4">
					<span class="font-semibold">Sensors:</span>
					<span
						v-if="
							activeTrackedDevice.sensors != null &&
							activeTrackedDevice.sensors.length > 0
						"
						v-for="(sensor, index) in activeTrackedDevice.sensors"
						:key="index">
						{{ sensor.name }} ({{ sensor.value }})
					</span>
					<span v-else>-</span>
				</div>
				<div
					class="flex flex-col justify-center space-y-2 border-b-[1px] border-gray-300 py-4">
					<span class="font-semibold">Location:</span>
					<span>{{ activeTrackedDeviceLocation }}</span>
				</div>
				<div class="flex items-center justify-between border-b-[1px] border-gray-300 py-4">
					<span class="font-semibold">Position:</span>
					<span
						>{{ activeTrackedDevice.location.lat }},
						{{ activeTrackedDevice.location.lng }}</span
					>
				</div>
				<div class="flex items-center justify-between border-b-[1px] border-gray-300 py-4">
					<span class="font-semibold"
						>Last
						<a
							href="https://en.wikipedia.org/wiki/Ping_(networking_utility)#:~:text=ping%20is%20a%20computer%20network,most%20embedded%20network%20administration%20software."
							target="_blank"
							class="text-blue-500 underline underline-offset-2"
							>PING</a
						>
						:</span
					>
					<span>{{ activeTrackedDevice.lastPing }}</span>
				</div>
			</div>
		</div>

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
					class="absolute left-4 size-8 translate-y-3">
					<path
						fill="currentColor"
						d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0s.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14" />
				</svg>

				<input
					type="text"
					class="generic-input size-full rounded-2xl bg-gray-200 pl-14"
					placeholder="Enter Reg No of Tracked Vehicle..."
					v-model="searchRegNo" />
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

	const { clientCoordinates } = useClientGeolocation();
	const isRegentTrackLoginModalOpen: Ref<boolean> = ref(true);

	const {
		regentTrackingAuthToken,
		vehicles,
		searchRegNo,
		fetchTrackedVehicles,
		activeTrackedDevice,
		activeTrackedDeviceLocation,
	} = useRegentTracking();

	onMounted(() => {
		setInterval(() => {
			fetchTrackedVehicles();
		}, 30000);
	});
</script>
