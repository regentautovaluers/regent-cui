<template>
	<div class="console-layout-spacing flex flex-col space-y-10">
		<!-- top part with filters -->
		<div
			class="divide-y-[2px] rounded-lg border border-gray-200 bg-white shadow-sm outline-none">
			<div class="flex h-24 items-center justify-between p-5 text-sm">
				<div>
					<h1 class="text-xl font-bold text-gray-700">Route Visualization</h1>
					<h2 class="text-sm text-gray-500">Historical Movement & Nesting Analysis</h2>
				</div>
				<div class="flex w-1/3 items-center justify-end space-x-5">
					<div class="font-bold text-gray-600">{{ query.vehicle_reg }}</div>
					<span class="h-full text-gray-500">&VerticalBar;</span>
					<div class="inline-flex items-center space-x-2">
						<span
							class="icon-[material-symbols-light--nest-clock-farsight-analog-rounded] text-xl text-gray-500"></span>
						<span class="text-gray-500"
							>Last update:
							{{ deviceHistory?.device.traccar.ack_time ?? 'Unknown ' }}</span
						>
					</div>
				</div>
			</div>
			<div class="flex h-24 items-center justify-between p-5">
				<h1 class="inline-flex items-center space-x-2">
					<span
						class="icon-[material-symbols-light--calendar-clock-rounded] text-xl text-gray-700"></span>
					<span class="text-gray-700">Analysis Period</span>
				</h1>
				<div
					class="grid h-12 w-[45%] grid-cols-5 divide-x-[1.5px] overflow-clip rounded-lg border-[1px] text-xs text-gray-600">
					<button
						:class="[
							'inline-flex items-center justify-center space-x-2 font-semibold',
							filterPeriod == 'today' && 'bg-blue-100',
						]"
						type="button"
						@click="setFilterPeriod('today')">
						<span
							class="icon-[svg-spinners--ring-resize] text-lg text-gray-600"
							v-if="fetchingDeviceHistory && filterPeriod == 'today'"></span>
						<span>Today</span>
					</button>
					<button
						:class="[
							'inline-flex items-center justify-center space-x-2 font-semibold',
							filterPeriod == 'this-week' && 'bg-blue-100',
						]"
						type="button"
						@click="setFilterPeriod('this-week')">
						<span
							class="icon-[svg-spinners--ring-resize] text-lg text-gray-600"
							v-if="fetchingDeviceHistory && filterPeriod == 'this-week'"></span>
						<span>This Week</span>
					</button>
					<button
						:class="[
							'inline-flex items-center justify-center space-x-2 font-semibold',
							filterPeriod == 'last-30-days' && 'bg-blue-100',
						]"
						type="button"
						@click="setFilterPeriod('last-30-days')">
						<span
							class="icon-[svg-spinners--ring-resize] text-lg text-gray-600"
							v-if="fetchingDeviceHistory && filterPeriod == 'last-30-days'"></span>
						<span>Last 30 Days</span>
					</button>
					<button
						:class="[
							'inline-flex items-center justify-center space-x-2 font-semibold',
							filterPeriod == 'last-3-months' && 'bg-blue-100',
						]"
						type="button"
						@click="setFilterPeriod('last-3-months')">
						<span
							class="icon-[svg-spinners--ring-resize] text-lg text-gray-600"
							v-if="fetchingDeviceHistory && filterPeriod == 'last-3-months'"></span>
						<span>Last 3 Months</span>
					</button>
					<button
						:class="[
							'inline-flex items-center justify-center space-x-2 font-semibold',
							filterPeriod == 'custom' && 'bg-blue-100',
						]"
						type="button"
						@click="setFilterPeriod('custom')">
						<span
							class="icon-[svg-spinners--ring-resize] text-lg text-gray-600"
							v-if="fetchingDeviceHistory && filterPeriod == 'custom'"></span>
						<span>Custom</span>
					</button>
				</div>
			</div>
		</div>

		<!-- the stats -->
		<div class="grid h-28 grid-cols-3 gap-10">
			<div
				class="flex h-full items-center justify-center rounded-lg border bg-white p-5 shadow-xs outline-none">
				<div class="flex-grow">
					<h2 class="text-sm text-gray-500">Total Distance</h2>
					<h1 class="text-lg font-semibold text-gray-700">
						{{
							deviceMovement.length > 0
								? deviceMovement.reduce((acc, e) => (acc += e.cummTotalDistance), 0)
								: 'Unknown'
						}}
					</h1>
				</div>
				<button
					class="inline-flex size-[3.2rem] items-center justify-center rounded-md border border-blue-300 bg-blue-100">
					<span
						class="icon-[material-symbols-light--route-outline] text-2xl text-blue-600"></span>
				</button>
			</div>
			<div
				class="flex h-full items-center justify-center rounded-lg border bg-white p-5 shadow-xs outline-none">
				<div class="flex-grow">
					<h2 class="text-sm text-gray-500">Total Trips</h2>
					<h1 class="text-lg font-semibold text-gray-700">
						{{
							deviceMovement.length > 0
								? deviceMovement.reduce((acc, e) => (acc += e.totalTrips), 0)
								: 'Unknown'
						}}
					</h1>
				</div>
				<button
					class="inline-flex size-[3.2rem] items-center justify-center rounded-md border border-green-300 bg-green-100">
					<span
						class="icon-[material-symbols-light--pin-drop] text-2xl text-green-600"></span>
				</button>
			</div>
			<div
				class="flex h-full items-center justify-center rounded-lg border bg-white p-5 shadow-xs outline-none">
				<div class="flex-grow">
					<h2 class="text-sm text-gray-500">Stop Duration</h2>
					<h1 class="text-lg font-semibold text-gray-700">
						{{ deviceHistory?.stop_duration ?? 'Unknown' }}
					</h1>
				</div>
				<button
					class="inline-flex size-[3.2rem] items-center justify-center rounded-md border border-yellow-300 bg-yellow-100">
					<span
						class="icon-[material-symbols-light--clock-loader-20] text-2xl text-yellow-600"></span>
				</button>
			</div>
		</div>

		<!-- nesting area, history replay e.t.c -->
		<div class="flex h-[43rem] flex-grow items-center gap-10">
			<div
				class="flex h-full w-[25%] flex-col divide-y-2 rounded-lg border bg-white shadow-xs outline-none">
				<div class="h-[13%] p-5">
					<h1 class="font-bold text-gray-700">Nesting Area Prediction</h1>
					<h2 class="text-sm text-gray-500">
						Where were you most likely to find the vehicle?
					</h2>
				</div>
				<div class="thin-scrollbar h-[87%] max-h-[85%] space-y-5 overflow-y-auto p-5">
					<RegentTrackDeviceNestingAreaCard
						v-for="(e, idx) in nestingAreas"
						:key="idx"
						:entry-index="idx"
						:location-lat="e.representative_lat"
						:location-lng="e.representative_lng"
						:number-of-appearances="e.appearances"
						:time-at-location="e.location_time_hours"
						:time-at-location-fraction="e.location_time_hours_fraction">
					</RegentTrackDeviceNestingAreaCard>
				</div>
			</div>
			<div
				class="flex h-full w-[50%] flex-col divide-y-2 rounded-lg border bg-white shadow-xs outline-none">
				<div class="h-[13%] p-5">
					<h1 class="font-bold text-gray-700">Route Visualization</h1>
					<h2 class="text-sm text-gray-500">Selected trip route details</h2>
				</div>
				<div
					class="thin-scrollbar flex h-[87%] max-h-[85%] flex-col space-y-3 overflow-y-auto p-5">
					<div
						class="flex-grow overflow-clip rounded-lg border border-gray-300 outline-none">
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
							:center="{ lat: -1.2686925224944912, lng: 36.80951195575046 }">
							<InfoWindow
								v-if="positionOnMap"
								:options="{
									position: { lat: positionOnMap.lat, lng: positionOnMap.lng },
									minWidth: 350,
								}">
								<div
									:class="[
										'overflow-clip rounded-lg border bg-white text-white outline-none',
									]">
									<div class="border-b border-gray-200 p-3">
										<h1 class="font-bold text-gray-700">
											{{ query.vehicle_reg }}
										</h1>
									</div>
									<div class="grid grid-cols-[25%_75%] gap-y-4 px-2 py-3">
										<!-- location -->
										<h3 class="font-semibold text-gray-700">Location</h3>
										<p class="text-end text-gray-500">
											{{ positionOnMap.location }}
										</p>

										<!-- Longitude -->
										<h3 class="font-semibold text-gray-700">Longitude</h3>
										<p class="text-end text-gray-500">
											{{ positionOnMap.lng }}
										</p>

										<!-- Latitude -->
										<h3 class="font-semibold text-gray-700">Latitude</h3>
										<p class="text-end text-gray-500">
											{{ positionOnMap.lat }}
										</p>

										<!-- Latitude -->
										<h3 class="font-semibold text-gray-700">Latitude</h3>
										<p class="text-end text-gray-500">
											{{ positionOnMap.lat }}
										</p>

										<!-- time -->
										<h3 class="font-semibold text-gray-700">Time</h3>
										<p class="text-end text-gray-500">
											{{ positionOnMap.time }}
										</p>

										<!-- event -->
										<h3 class="font-semibold text-gray-700">Event</h3>
										<p class="text-end text-gray-500">
											{{ positionOnMap.event }}
										</p>
									</div>
								</div>
							</InfoWindow>
							<Polyline
								:options="{
									path: polylineCoords,
									geodesic: true,
									strokeColor: '#ec4899',
									strokeOpacity: 1.0,
									strokeWeight: 5,
								}" />
						</GoogleMap>
					</div>
				</div>
			</div>
			<div
				class="h-full w-[25%] divide-y-2 rounded-lg border bg-white shadow-xs outline-none">
				<div class="h-[13%] p-5">
					<h1 class="font-bold text-gray-700">Trip History</h1>
					<h2 class="text-sm text-gray-500">Click on a trip to view it on the map</h2>
				</div>
				<div class="thin-scrollbar h-[87%] max-h-[87%] space-y-5 overflow-y-auto p-5">
					<div
						class="h-fit divide-y-2 rounded-lg border outline-none"
						v-for="(e, idx) in deviceMovement"
						:key="idx">
						<div class="flex h-14 items-center p-5">
							<h1 class="text-sm font-bold">{{ e.date }}</h1>
						</div>
						<div class="p-5">
							<!-- start of timeline -->
							<template
								v-if="e.movement.length > 0"
								v-for="(m, idx) in e.movement"
								:key="idx">
								<!-- render the start: has a driving duration -->
								<ol class="relative border-s border-green-500">
									<RegentTrackingDeviceTripHistoryCard
										:event-type="'Start'"
										:driving-duration="m.drivingDuration"
										:event-started-at="m.startedAt"
										:event-lat="m.startAtLat"
										:event-lng="m.startAtLng"
										@entry-clicked="
											(location: string | null) => {
												setPolylineCoords(m.tripRoute);
												setPositionOnMap({
													lat: Number(m.startAtLat),
													lng: Number(m.startAtLng),
													event: 'start',
													time: m.startedAt,
													location,
												});
											}
										" />
								</ol>
								<!-- render the stop: has a stoping duration -->
								<ol class="relative border-s border-red-500">
									<RegentTrackingDeviceTripHistoryCard
										:event-type="'Stop'"
										:stop-duration="m.stopDuration"
										:event-started-at="m.stoppedAt"
										:event-lat="m.stoppedAtLat"
										:event-lng="m.stoppedAtLng"
										@entry-clicked="
											(location: string | null) => {
												setPolylineCoords(m.tripRoute);
												setPositionOnMap({
													lat: Number(m.stoppedAtLat),
													lng: Number(m.stoppedAtLng),
													event: 'stop',
													time: m.startedAt,
													location,
												});
											}
										" />
								</ol>
								<!-- end of timeline -->
							</template>
							<template v-else>
								<div class="rounded-lg border border-yellow-300 bg-yellow-100 p-2">
									<p class="text-sm text-yellow-500">
										No movement history available for this day.
									</p>
								</div>
							</template>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { GoogleMap, InfoWindow, Polyline } from 'vue3-google-map';
	import { googleMapStyle } from '~/config/ava-google-map-config';
	definePageMeta({
		name: 'regent-tracking-vehicle-history',
		layout: 'console-layout',
	});
	const { query } = useRoute();

	const {
		filterPeriod,
		deviceHistory,
		fetchingDeviceHistory,
		errorFetchingDeviceHistory,
		nestingAreas,
		deviceMovement,
		positionOnMap,
		polylineCoords,
		setFilterPeriod,
		setPositionOnMap,
		setPolylineCoords,
	} = useRegentTrackingDeviceHistory();
	const { googleMapsApiKey } = useGoogleMaps();
</script>

<style>
	/* Styling the InfoWindow content */
	.info-window {
		font-family: Arial, sans-serif;
		text-align: center;
		width: 250px;
	}
	.info-window img {
		width: 100%;
		height: auto;
		border-radius: 8px;
	}
	.info-window h3 {
		margin: 10px 0 5px;
		font-size: 18px;
		color: #333;
	}
	.info-window p {
		font-size: 14px;
		color: #666;
	}
</style>
