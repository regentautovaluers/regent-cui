<template>
	<div class="relative h-full overflow-clip rounded-lg border shadow-md">
		<!-- services switch -->
		<div
			class="absolute right-5 top-5 z-10 flex flex-col items-center justify-center text-xs sm:text-sm">
			<button
				id="dropdownBottomButton"
				data-dropdown-toggle="dropdownBottom"
				data-dropdown-placement="bottom"
				class="mb-2 me-3 inline-flex h-[54px] w-[155px] items-center justify-between rounded-lg border bg-blue-700 px-2 py-2.5 text-center text-lg font-semibold text-white hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
				type="button">
				<span>Service Type</span>
				<svg
					class="h-2.5 w-2.5 rotate-180"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 10 6">
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5 5 1 1 5" />
				</svg>
			</button>
			<!-- Dropdown menu -->
			<div
				id="dropdownBottom"
				class="z-10 hidden w-44 divide-y divide-gray-100 rounded-lg bg-white shadow">
				<ul
					class="py-2 text-gray-500"
					aria-labelledby="dropdownBottomButton">
					<li
						v-for="(service, index) in [
							'towing',
							'jumpstarting',
							'fueldelivery',
							'tyrechange',
						]"
						:key="index">
						<button
							class="block w-full px-4 py-2 text-center text-base hover:bg-gray-100"
							@click.prevent="activeService = service">
							{{ screenFormatRAServiceName(service) }}
						</button>
					</li>
				</ul>
			</div>
		</div>

		<GoogleMap
			ref="mapRef"
			:api-key="runtimeConfig.app.GOOGLE_MAPS_APIKEY"
			style="width: 100%; height: 100%"
			:center="clientCoordinates"
			:zoom="13"
			:zoom-control="true"
			:fullscreen-control="false"
			:street-view-control="false">
			<!-- where logged in client is -->
			<CustomMarker
				v-for="(marker, index) in mapPinsIncidents.filter(
					(m) => m.service === activeService,
				)"
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
			</CustomMarker>
		</GoogleMap>
	</div>
</template>

<script setup lang="ts">
	import { GoogleMap, CustomMarker } from 'vue3-google-map';

	definePageMeta({
		name: 'ra-visual-informer',
		layout: 'console-layout',
	});

	const runtimeConfig = useRuntimeConfig();
	const { clientCoordinates } = useClientGeolocation();
	const { mapPinsIncidents } = useRoadsideIncidents();
	const activeService: Ref<string> = ref('towing');
</script>
