<template>
	<div class="space-y-5">
		<!-- preliminary info -->
		<div class="grid h-fit grid-cols-2 gap-2 rounded-lg bg-gray-200/80 p-4 outline-none">
			<div class="col-span-2">
				<h1 class="font-bold text-gray-700">Vehicle Information</h1>
			</div>
			<div class="flex h-12 items-center space-x-3">
				<h2 class="inline-flex items-center space-x-1">
					<span
						class="icon-[material-symbols-light--barcode-scanner] text-xl text-gray-700"></span>
					<span class="text-sm text-gray-500">Registration</span>
				</h2>
				<span class="text-gray-400">&VerticalBar;</span>
				<h3 class="text-sm font-semibold text-gray-700">{{ regNo }}</h3>
			</div>
			<div class="flex h-12 items-center space-x-3">
				<h2 class="inline-flex items-center space-x-1">
					<span
						class="icon-[material-symbols-light--settings-phone] text-xl text-gray-700"></span>
					<span class="text-sm text-gray-500">Phone</span>
				</h2>
				<span class="text-gray-400">&VerticalBar;</span>
				<h3 class="text-sm font-semibold text-gray-700">{{ clientPhone }}</h3>
			</div>
			<div class="flex h-12 items-center space-x-3">
				<h2 class="inline-flex items-center space-x-1">
					<span
						class="icon-[material-symbols-light--person] text-xl text-gray-700"></span>
					<span class="text-sm text-gray-500">Client Name</span>
				</h2>
				<span class="text-gray-400">&VerticalBar;</span>
				<h3 class="text-sm font-semibold text-gray-700">{{ clientName }}</h3>
			</div>
			<div class="flex h-12 items-center space-x-3">
				<h2 class="inline-flex items-center space-x-1">
					<span
						class="icon-[material-symbols-light--electric-bolt-outline] text-xl text-gray-700"></span>
					<span class="text-sm text-gray-500">Incident Severity</span>
				</h2>
				<span class="text-gray-400">&VerticalBar;</span>
				<h3 class="text-sm font-semibold text-gray-700">
					<span
						:class="[
							'text-sm font-semibold',
							!latestAccident || (!latestAccident?.impactForce && 'text-gray-500'),
							latestAccident?.impactForce &&
								latestAccident?.impactForce > 8 &&
								'text-red-500',
							latestAccident?.impactForce &&
								latestAccident?.impactForce >= 4 &&
								latestAccident?.impactForce &&
								latestAccident?.impactForce <= 8 &&
								'text-yellow-500',
							latestAccident?.impactForce &&
								latestAccident?.impactForce < 4 &&
								'text-green-500',
						]">
						{{ latestAccident?.impactForce ?? '-' }} :
						{{ latestAccident?.severity ?? '-' }}</span
					>
				</h3>
			</div>
		</div>

		<!-- detailed analysis -->
		<div class="h-fit rounded-lg">
			<!-- detailed analysis -->
			<div class="tablet:grid-cols-2 laptop:gap-5 grid grid-cols-1 gap-4">
				<!--incident analysis  -->
				<div class="h-[16.5rem] rounded-lg border-2 p-4 outline-none">
					<h1 class="mb-2 font-semibold text-gray-700">Incident Analysis</h1>
					<div class="my-3 space-y-2">
						<div
							class="inline-flex h-14 w-full items-center justify-between rounded-lg bg-blue-200 px-3 outline-none">
							<div class="flex items-center space-x-2">
								<span
									class="icon-[material-symbols-light--speed-outline-rounded] text-2xl text-blue-500"></span>
								<h2 class="text-sm font-semibold text-blue-600">
									Speed Before Crash
								</h2>
							</div>
							<span class="text-blue-600">
								{{
									`${latestAccident?.speedBeforeCrash} ${latestAccident?.speedUnits}`
								}}
							</span>
						</div>
						<div
							class="inline-flex h-14 w-full items-center justify-between rounded-lg bg-yellow-200 px-3 outline-none">
							<div class="flex items-center space-x-2">
								<span
									class="icon-[material-symbols-light--stop-circle] text-2xl text-yellow-500"></span>
								<h2 class="text-sm font-semibold text-yellow-600">
									Harsh Braking Before Crash
								</h2>
							</div>
							<span class="text-yellow-600">
								{{ latestAccident?.harshBrakingBeforeCrash ? 'Yes' : 'No' }}
							</span>
						</div>
						<div
							class="inline-flex h-14 w-full items-center justify-between rounded-lg bg-purple-200 px-3 outline-none">
							<div class="flex items-center space-x-2">
								<span
									class="icon-[material-symbols-light--electric-bolt] text-2xl text-purple-500"></span>
								<h2 class="text-sm font-semibold text-purple-600">Impact Force</h2>
							</div>
							<span class="text-purple-600">
								{{ latestAccident?.impactForce }}G
							</span>
						</div>
					</div>
				</div>

				<!--weather report  -->
				<div class="h-[16.5rem] rounded-lg border-2 p-4 outline-none">
					<h1 class="mb-2 font-semibold text-gray-700">Environmental Condition</h1>
					<div class="my-3 space-y-2">
						<div
							class="inline-flex h-14 w-full items-center justify-between rounded-lg bg-green-200 px-3 outline-none">
							<div class="flex items-center space-x-2">
								<span
									class="icon-[material-symbols-light--thermostat-rounded] text-2xl text-green-500"></span>
								<h2 class="text-sm font-semibold text-green-600">Temperature</h2>
							</div>
							<span class="text-green-600">
								{{ '-' }}
							</span>
						</div>
						<div
							class="inline-flex h-14 w-full items-center justify-between rounded-lg bg-green-200 px-3 outline-none">
							<div class="flex items-center space-x-2">
								<span
									class="icon-[material-symbols-light--weather-hail-rounded] text-2xl text-green-500"></span>
								<h2 class="text-sm font-semibold text-green-600">Precipitation</h2>
							</div>
							<span class="text-green-600">
								{{ '-' }}
							</span>
						</div>
						<div
							class="inline-flex h-14 w-full items-center justify-between rounded-lg bg-green-200 px-3 outline-none">
							<div class="flex items-center space-x-2">
								<span
									class="icon-[material-symbols-light--wind-power] text-2xl text-green-500"></span>
								<h2 class="text-sm font-semibold text-green-600">Wind Speed</h2>
							</div>
							<span class="text-green-600">
								{{ '-' }}
							</span>
						</div>
					</div>
				</div>

				<!-- incident report  -->
				<div
					class="laptop-lg:col-span-2 flex h-[19rem] flex-col rounded-lg border-2 p-4 outline-none">
					<h1 class="font-semibold text-gray-700">Crash Location</h1>
					<h2 class="mb-2 text-sm text-gray-500">
						{{ latestAccident?.geoCodeLocation ?? '-' }}
					</h2>
					<div class="mb-2 flex-grow space-y-2 rounded-lg outline-none">
						<GoogleMap
							ref="mapRef"
							:api-key="googleMapsApiKey"
							:styles="googleMapStyle"
							style="width: 100%; height: 100%"
							:map-type-control="false"
							:zoom="12"
							:zoom-control="true"
							:fullscreen-control="false"
							:street-view-control="true"
							:center="{
								lat: latestAccident?.coords?.lat,
								lng: latestAccident?.coords?.lng,
							}"
							><InfoWindow
								v-if="latestAccident?.coords"
								:options="{
									position: {
										lat: latestAccident?.coords?.lat,
										lng: latestAccident?.coords?.lng,
									},
									minWidth: 350,
								}">
								<div
									:class="[
										'overflow-clip rounded-lg border bg-white text-white outline-none',
									]">
									<div class="border-b border-gray-200 p-3">
										<h1 class="font-bold text-gray-700">
											{{ regNo }}
										</h1>
									</div>
									<div class="grid grid-cols-[25%_75%] gap-y-4 px-2 py-3">
										<!-- location -->
										<h3 class="font-semibold text-gray-700">Location</h3>
										<p class="text-end text-gray-500">
											{{ latestAccident?.geoCodeLocation }}
										</p>

										<!-- Longitude -->
										<h3 class="font-semibold text-gray-700">Longitude</h3>
										<p class="text-end text-gray-500">
											{{ latestAccident?.coords?.lng }}
										</p>

										<!-- Latitude -->
										<h3 class="font-semibold text-gray-700">Latitude</h3>
										<p class="text-end text-gray-500">
											{{ latestAccident?.coords?.lat }}
										</p>

										
									</div>
								</div>
							</InfoWindow></GoogleMap
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { type AccidentAnalytics } from '~/types/insurance-telematics/accident-record';
	import { googleMapStyle } from '~/config/ava-google-map-config';

	const { id, regNo, clientPhone, clientName, latestAccident } = defineProps<{
		id: number;
		regNo: String;
		clientPhone: String;
		clientName: String;
		latestAccident?: AccidentAnalytics;
	}>();
	const { googleMapsApiKey } = useGoogleMaps();
</script>
