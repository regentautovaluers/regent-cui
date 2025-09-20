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
						<span class="text-gray-500">Last update: 2 Mins ago</span>
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
						:class="['font-semibold', filterPeriod == 'today' && 'bg-blue-100']"
						type="button"
						@click="setFilterPeriod('today')">
						Today
					</button>
					<button
						:class="['font-semibold', filterPeriod == 'this-week' && 'bg-blue-100']"
						type="button"
						@click="setFilterPeriod('this-week')">
						This Week
					</button>
					<button
						:class="['font-semibold', filterPeriod == 'last-30-days' && 'bg-blue-100']"
						type="button"
						@click="setFilterPeriod('last-30-days')">
						Last 30 Days
					</button>
					<button
						:class="['font-semibold', filterPeriod == 'last-3-months' && 'bg-blue-100']"
						type="button"
						@click="setFilterPeriod('last-3-months')">
						Last 3 Months
					</button>
					<button
						:class="['font-semibold', filterPeriod == 'custom' && 'bg-blue-100']"
						type="button"
						@click="setFilterPeriod('custom')">
						Custom Range
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
						{{ deviceHistory?.distance_sum ?? 'Unknown' }}
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
							deviceMovement.length == 0
								? 'Unknown'
								: deviceMovement.reduce(
										(acc, curr) => acc + curr.movement.length,
										0,
									)
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
		<div class="flex h-[45rem] items-center gap-10">
			<div
				class="flex h-full w-[25%] flex-col divide-y-2 rounded-lg border bg-white shadow-xs outline-none">
				<div class="h-[13%] p-5">
					<h1 class="font-bold text-gray-700">Nesting Area Prediction</h1>
					<h2 class="text-sm text-gray-500">
						Where were you most likely to find the vehicle?
					</h2>
				</div>
				<div class="thin-scrollbar h-[87%] max-h-[85%] space-y-5 overflow-y-auto p-5">
					<div
						class="h-[10.5rem] rounded-lg border border-green-100 bg-gray-100 p-5 outline-none"
						v-for="(e, idx) in nestingAreas"
						:key="idx">
						<div class="flex items-center justify-between">
							<div>
								<h1
									class="font-semibold text-gray-700"
									v-if="idx == 0">
									Most Likely
								</h1>
								<h1
									class="font-semibold text-gray-700"
									v-else-if="idx == 1">
									Medium Likely
								</h1>
								<h1
									class="font-semibold text-gray-700"
									v-else-if="idx == 2">
									Least Likely
								</h1>
								<h1
									class="font-semibold text-gray-700"
									v-else>
									Other Places
								</h1>
								<p class="text-sm text-gray-500">
									Kericho Road, Kahawa Sukari, 4th Avenue
								</p>
							</div>
							<div
								v-if="[0, 1, 2].includes(idx)"
								:class="[
									'flex w-[25%] justify-center rounded-full border p-1 text-xs outline-none',
									idx == 0 && 'border-green-400 bg-green-100 text-green-500',
									idx == 1 && 'border-yellow-400 bg-yellow-100 text-yellow-500',
									idx == 2 && 'border-red-400 bg-red-100 text-red-500',
								]">
								<span v-if="idx == 0">Very High</span>
								<span v-else-if="idx == 1">Medium</span>
								<span v-else-if="idx == 2">Low</span>
							</div>
						</div>
						<div class="mt-2 flex items-center justify-between">
							<div>
								<h1 class="inline-flex items-center space-x-1">
									<span
										class="icon-[material-symbols-light--nest-clock-farsight-analog-rounded] text-gray-700"></span>
									<span class="font-bold text-gray-700"
										>{{ Math.ceil(e.location_time_hours) }}hrs</span
									>
								</h1>
								<h2 class="text-sm text-gray-500">Time Spent</h2>
							</div>
							<div>
								<h1 class="inline-flex items-center space-x-1">
									<span
										class="icon-[material-symbols-light--pie-chart-outline] text-xl text-gray-700"></span>
									<span class="font-bold text-gray-700"
										>~{{ e.location_time_hours_fraction.toFixed(1) }}%</span
									>
								</h1>
								<h2 class="text-sm text-gray-500">Of Time</h2>
							</div>
							<div>
								<h1 class="inline-flex items-center space-x-1">
									<span
										class="icon-[material-symbols-light--pin-drop-outline] text-xl text-gray-700"></span>
									<span class="font-bold text-gray-700">{{ e.appearances }}</span>
								</h1>
								<h2 class="text-sm text-gray-500">Visits</h2>
							</div>
						</div>
					</div>
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
					<div class="grid h-15 grid-cols-4 place-content-center place-items-center">
						<div>
							<h2 class="text-sm text-gray-500">Duration</h2>
							<h1 class="font-bold text-gray-700">2hrs 15Min</h1>
						</div>
						<div>
							<h2 class="text-sm text-gray-500">Distance</h2>
							<h1 class="font-bold text-gray-700">87.3Km</h1>
						</div>
						<div>
							<h2 class="text-sm text-gray-500">Average Speed</h2>
							<h1 class="font-bold text-gray-700">38.9Km</h1>
						</div>
						<div>
							<h2 class="text-sm text-gray-500">Stops</h2>
							<h1 class="font-bold text-gray-700">3 Locations</h1>
						</div>
					</div>
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
							:street-view-control="true">
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
								<ol class="relative border-s border-green-500">
									<li class="ms-4">
										<div
											class="absolute -start-2.5 size-5 rounded-full border border-white bg-green-500"></div>
										<h1
											class="inline-flex space-x-3 text-sm leading-none text-gray-700">
											<span class="font-semibold">Start</span>
											<span>&VerticalBar;</span>
											<time class="font-semibold">{{
												m.startedAt.split(' ')[1].substring(0, 5)
											}}</time>
										</h1>
										<p class="text-sm font-normal text-gray-500">
											Kericho Road, Kahawa Sukari
										</p>
										<p class="mb-4 inline-flex items-center space-x-2 text-sm">
											<span class="text-gray-700">Driving Duration</span>
											<span class="text-2xl">&middot;</span>
											<span class="text-gray-500">{{
												m.drivingDuration
											}}</span>
										</p>
									</li>
								</ol>
								<ol
									class="relative border-s border-yellow-500"
									v-if="m.idlePeriods.length > 0"
									v-for="(i, idx) in m.idlePeriods"
									:key="idx">
									<li class="ms-4">
										<div
											class="absolute -start-2.5 size-5 rounded-full border border-white bg-yellow-500"></div>
										<h1
											class="inline-flex space-x-3 text-sm leading-none text-gray-700">
											<span class="font-semibold">Idle</span>
											<span>&VerticalBar;</span>
											<span class="inline-flex items-center space-x-1">
												<time class="font-semibold"
													>{{ i.startedAt.split(' ')[1].substring(0, 5) }}
												</time>
												<span> - </span>
												<time class="font-semibold"
													>{{ i.stoppedAt.split(' ')[1].substring(0, 5) }}
												</time>
												<span class="text-gray-500"
													>( {{ i.durationInMinutes }} min )</span
												>
											</span>
										</h1>

										<p class="mb-4 inline-flex items-center space-x-2 text-sm">
											<span class="text-gray-700">Idle Duration</span>
											<span class="text-2xl">&middot;</span>
											<span class="text-gray-500">{{
												m.totalIdleDuration
											}}</span>
										</p>
									</li>
								</ol>
								<ol class="relative border-s border-red-500">
									<li class="ms-4">
										<div
											class="absolute -start-2.5 size-5 rounded-full border border-white bg-red-500"></div>
										<h1
											class="inline-flex space-x-3 text-sm leading-none text-gray-700">
											<span class="font-semibold">Stop</span>
											<span>&VerticalBar;</span>
											<time class="font-semibold">{{
												m.stoppedAt.split(' ')[1].substring(0, 5)
											}}</time>
										</h1>
										<p class="text-sm font-normal text-gray-500">
											Kericho Road, Kahawa Sukari
										</p>
										<p class="mb-4 inline-flex items-center space-x-2 text-sm">
											<span class="text-gray-700">Stop Duration</span>
											<span class="text-2xl">&middot;</span>
											<span class="text-gray-500">1hrs 10 min</span>
										</p>
									</li>
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

		<!-- page actions -->
		<div
			class="divide-y-[2px] rounded-lg border border-gray-200 bg-white shadow-sm outline-none">
			<div class="h-24 p-5">
				<h1 class="text-xl font-bold text-gray-700">Export & Share</h1>
				<h2 class="text-sm text-gray-500">
					Download this report or share dashboard access to this report
				</h2>
			</div>
			<div class="grid h-28 grid-cols-3 place-content-center gap-10 px-5 py-2">
				<div class="flex h-20 items-center rounded-lg border p-5">
					<div class="flex-grow">
						<h1 class="font-semibold text-gray-700">PDF Report</h1>
						<h2 class="text-xs text-gray-500">
							Comprehensive reports with charts and analysis
						</h2>
					</div>
					<button
						class="inline-flex size-[3.2rem] items-center justify-center rounded-md border border-red-300 bg-red-100">
						<span
							class="icon-[material-symbols-light--book-2-outline] text-2xl text-red-600"></span>
					</button>
				</div>
				<div class="flex h-20 items-center rounded-lg border p-5">
					<div class="flex-grow">
						<h1 class="font-semibold text-gray-700">Screenshot Page</h1>
						<h2 class="text-xs text-gray-500">Capture a screenshot of this page</h2>
					</div>
					<button
						class="inline-flex size-[3.2rem] items-center justify-center rounded-md border border-red-300 bg-red-100">
						<span
							class="icon-[material-symbols-light--screenshot-tablet-rounded] text-2xl text-red-600"></span>
					</button>
				</div>
				<div class="flex h-20 items-center rounded-lg border p-5">
					<div class="flex-grow">
						<h1 class="font-semibold text-gray-700">Share Link</h1>
						<h2 class="text-xs text-gray-500">
							Generate a shareable link for this report
						</h2>
					</div>
					<button
						class="inline-flex size-[3.2rem] items-center justify-center rounded-md border border-blue-300 bg-blue-100">
						<span
							class="icon-[material-symbols-light--share] text-2xl text-blue-600"></span>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { type LocationCoords } from '~/types';
	import { GoogleMap, InfoWindow, Polyline } from 'vue3-google-map';
	import { googleMapStyle } from '~/config/ava-google-map-config';
	import { useGoogleMapsConfig } from '~/composables/useGoogleMapsConfig';
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
		setFilterPeriod,
	} = await useRegentTrackingDeviceHistory();
	const { googleMapsApiKey } = useGoogleMapsConfig();
</script>
