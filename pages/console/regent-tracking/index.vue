<template>
	<div class="console-layout-spacing h-full min-h-full">
		<div
			class="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800"
			role="alert"
			v-show="!regentTrackingAuthToken">
			<div class="flex items-center">
				<svg
					class="me-2 h-4 w-4 shrink-0"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 20 20">
					<path
						d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
				</svg>
				<span class="sr-only">Info</span>
				<h3 class="text-sm font-medium">Authentication Request</h3>
			</div>

			<p class="mt-2 mb-4 text-sm">
				Kindly provide your tracking credentials so that we can proceed to show you your
				tracked assets. Have an issue? Contact Us
			</p>
			<div class="flex">
				<button
					type="button"
					class="rounded-lg border border-yellow-800 bg-transparent px-3 py-1.5 text-center text-sm font-medium text-yellow-800 hover:bg-yellow-900 hover:text-white focus:ring-4 focus:ring-yellow-300 focus:outline-none"
					data-modal-target="regent-track-login-modal"
					data-modal-toggle="regent-track-login-modal">
					Login
				</button>
			</div>
		</div>

		<div
			:class="[
				'ease-liner relative h-full overflow-clip border shadow-md transition-all duration-200',
				activeTrackedDevice ? 'console-layout-spacing flex' : 'block',
			]">
			<GoogleMap
				ref="mapRef"
				:api-key="googleMapsApiKey"
				:styles="googleMapStyle"
				style="width: 100%; height: 100%"
				:map-type-control="false"
				:center="{ lat: coords.latitude, lng: coords.longitude }"
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
						@click="activeTrackedDevice = marker"
						:style="`--marker-color: ${mapColorToTailwindEquivalent(marker.pinColor).hex}`">
						<div
							:class="[
								'myloc-box flex h-12 w-fit items-center space-x-2 rounded-lg text-white',
							]"
							style="background-color: var(--marker-color)">
							<h1 class="text-lg font-semibold">{{ marker.vehicleReg }}</h1>
						</div>
					</CustomMarker>
				</MarkerCluster>

				<Polyline
					:options="{
						path: deviceHistory,
						geodesic: true,
						strokeColor: '#ec4899',
						strokeOpacity: 1.0,
						strokeWeight: 5,
					}" />
			</GoogleMap>
			<div
				class="relative flex h-full w-[30%] flex-col overflow-y-auto border-l-2 border-gray-500"
				v-if="activeTrackedDevice">
				<div
					class="border-b- flex h-[7%] min-h-[7%] items-center justify-between bg-gray-100 px-4">
					<h1 class="inline-flex items-center space-x-2 text-gray-500 uppercase">
						<span class="text-xl font-semibold">{{
							activeTrackedDevice.vehicleReg
						}}</span
						><span>|</span
						><span class="text-xl font-semibold">{{
							activeTrackedDevice.trackerStatus
						}}</span>
					</h1>
				</div>
				<button
					class="absolute bottom-4 left-4 inline-flex size-fit items-center justify-center space-x-1 rounded-full bg-white p-2 text-gray-500 shadow-md transition-colors hover:bg-gray-300"
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
					<span>Close</span>
				</button>

				<!-- device details -->
				<div class="mx-2 py-4">
					<h2 id="accordion-collapse-heading-1">
						<button
							type="button"
							class="flex w-full items-center justify-between gap-3 rounded-lg border border-gray-200 p-5 font-medium text-gray-500 hover:bg-gray-100"
							@click="deviceDetailsAccordionOpenned = !deviceDetailsAccordionOpenned">
							<span>Device Details</span>
							<svg
								data-accordion-icon
								:class="[
									'h-3 w-3 shrink-0 transition-all duration-200 ease-linear',
									deviceDetailsAccordionOpenned ? 'rotate-0' : 'rotate-180',
								]"
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
					</h2>
					<div :class="['p-5', deviceDetailsAccordionOpenned ? 'block' : 'hidden']">
						<div
							class="flex items-center justify-between border-b border-gray-300 py-4">
							<span class="font-semibold">Stop Duration:</span>
							<span v-if="activeTrackedDevice.stopDuration">{{
								activeTrackedDevice.stopDuration
							}}</span>
							<span v-else>-</span>
						</div>
						<div
							class="flex items-center justify-between border-b border-gray-300 py-4">
							<span class="font-semibold">Driver:</span>
							<span
								v-if="
									activeTrackedDevice.driver.name &&
									activeTrackedDevice.driver.phone
								">
								{{ activeTrackedDevice.driver.name }} ({{
									activeTrackedDevice.driver.phone
								}})
							</span>
							<span v-else>-</span>
						</div>
						<div
							class="flex items-center justify-between border-b border-gray-300 py-4">
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
							class="flex flex-col justify-center space-y-2 border-b border-gray-300 py-4">
							<span class="font-semibold">Location:</span>
							<span>{{ activeTrackedDeviceLocation }}</span>
						</div>
						<div
							class="flex items-center justify-between border-b border-gray-300 py-4">
							<span class="font-semibold">Position:</span>
							<span
								>{{ activeTrackedDevice.location.lat }},
								{{ activeTrackedDevice.location.lng }}</span
							>
						</div>
						<div
							class="flex items-center justify-between border-b border-gray-300 py-4">
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

				<!-- trigger device commands -->
				<div class="mx-2 py-4">
					<h2 id="accordion-collapse-heading-1">
						<button
							type="button"
							class="flex w-full items-center justify-between gap-3 rounded-lg border border-gray-200 p-5 font-medium text-gray-500 hover:bg-gray-100"
							@click="eventAccordionOpenned = !eventAccordionOpenned">
							<span>Trigger Commands</span>
							<svg
								data-accordion-icon
								:class="[
									'h-3 w-3 shrink-0 transition-all duration-200 ease-linear',
									eventAccordionOpenned ? 'rotate-0' : 'rotate-180',
								]"
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
					</h2>
					<div :class="['p-5', eventAccordionOpenned ? 'block' : 'hidden']">
						<TriggerTrackingDeviceEvent :device-id="Number(activeTrackedDevice.id)" />
					</div>
				</div>

				<!-- get device history -->
				<div class="mx-2 py-4">
					<h2 id="accordion-collapse-heading-1">
						<button
							type="button"
							class="flex w-full items-center justify-between gap-3 rounded-lg border border-gray-200 p-5 font-medium text-gray-500 hover:bg-gray-100"
							@click="historyAccordionOpenned = !historyAccordionOpenned">
							<span>Device History</span>
							<svg
								data-accordion-icon
								:class="[
									'h-3 w-3 shrink-0 transition-all duration-200 ease-linear',
									historyAccordionOpenned ? 'rotate-0' : 'rotate-180',
								]"
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
					</h2>
					<div :class="['p-5', historyAccordionOpenned ? 'block' : 'hidden']">
						<form @submit.prevent="getDeviceHistory(Number(activeTrackedDevice.id))">
							<!-- Starting date Field -->
							<div>
								<label
									for="cover-period-starts"
									class="generic-input-label"
									>Choose Start Date-Time</label
								>
								<input
									type="datetime-local"
									id="cover-period-starts"
									class="generic-input"
									placeholder="Enter Customer Name as Seen In Their National ID"
									required
									v-model="startTimestamp" />
							</div>

							<!-- Ending date Field -->
							<div>
								<label
									for="cover-period-ends"
									class="generic-input-label"
									>Choose End Date-Time</label
								>
								<input
									type="datetime-local"
									id="cover-period-ends"
									class="generic-input"
									placeholder="Enter Customer Name as Seen In Their National ID"
									required
									v-model="endTimestamp" />
							</div>

							<!-- submit button -->
							<button
								type="submit"
								:class="[
									'generic-form-submit mt-3 w-full',
									getDeviceHistoryLoading && 'skeleton skeleton-animated',
								]">
								{{ getDeviceHistoryLoading ? 'Please Wait...' : 'Retrieve' }}
							</button>
						</form>
					</div>
				</div>
			</div>

			<!-- Login modal -->
			<ParentModal
				modal-id="regent-track-login-modal"
				modal-title="Regent Tracking Login"
				modal-placement="center-center">
				<form @submit.prevent="attemptLogin">
					<div class="flex flex-col">
						<label class="generic-input-label generic-input-required-label"
							>Email</label
						>
						<div class="flex flex-grow">
							<input
								type="email"
								id="email"
								class="generic-input"
								placeholder="johndoe@corpemail.com"
								required
								v-model="email" />
						</div>
					</div>
					<div class="mt-3 flex flex-col">
						<label class="generic-input-label generic-input-required-label"
							>Phone Number</label
						>
						<div class="flex flex-grow">
							<input
								type="password"
								id="password"
								class="generic-input"
								placeholder="e.g. gnurly-squirel"
								required
								v-model="password" />
						</div>
					</div>
					<!-- submit button -->
					<button
						type="submit"
						:class="[
							'generic-form-submit mt-3',
							loginAttemptLoading && 'skeleton skeleton-animated',
						]">
						{{ loginAttemptLoading ? 'Please Wait...' : 'Login' }}
					</button>
					<p
						class="text-center text-sm font-bold text-gray-500"
						v-if="regentTrackingAuthToken">
						Successful login! Close this by clicking 'X' above.
					</p>
				</form>
			</ParentModal>

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
	</div>
</template>

<script setup lang="ts">
	import { GoogleMap, CustomMarker, MarkerCluster, Polyline } from 'vue3-google-map';
	import { googleMapStyle, googleMapsApiKey } from '~/config/ava-google-map-config';
	import { useGeolocation } from '@vueuse/core';

	definePageMeta({
		name: 'regent-tracking-home',
		layout: 'console-layout',
	});
	const eventAccordionOpenned: Ref<boolean> = ref(false);
	const historyAccordionOpenned: Ref<boolean> = ref(false);
	const deviceDetailsAccordionOpenned: Ref<boolean> = ref(false);

	watch(
		[
			() => eventAccordionOpenned.value,
			() => historyAccordionOpenned.value,
			() => deviceDetailsAccordionOpenned.value,
		],
		([
			eventAccordionOpennedVal,
			historyAccordionOpennedVal,
			deviceDetailsAccordionOpennedVal,
		]) => {
			if (eventAccordionOpennedVal) {
				historyAccordionOpenned.value = false;
				deviceDetailsAccordionOpenned.value = false;
			} else if (historyAccordionOpennedVal) {
				eventAccordionOpenned.value = false;
				deviceDetailsAccordionOpenned.value = false;
			} else if (deviceDetailsAccordionOpennedVal) {
				eventAccordionOpenned.value = false;
				historyAccordionOpenned.value = false;
			}
		},
		{ deep: true },
	);

	const {
		regentTrackingAuthToken,
		vehicles,
		searchRegNo,
		activeTrackedDevice,
		activeTrackedDeviceLocation,
		email,
		password,
		loginAttemptLoading,
		attemptLogin,
	} = useRegentTracking();

	const {
		startTimestamp,
		deviceHistory,
		endTimestamp,
		getDeviceHistoryLoading,
		getDeviceHistory,
	} = useTrackedDeviceCommandsAndHistory();
	const { coords, error: geolocationError, isSupported: geolocationSupported } = useGeolocation();

	const mapColorToTailwindEquivalent = (
		color: 'green' | 'blue' | 'red' | 'yellow' | 'black',
	): { human_readable: string; hex: string } => {
		switch (color) {
			case 'green':
				return { human_readable: 'bg-green-500', hex: '#00c951' };
			case 'blue':
				return { human_readable: 'bg-blue-500', hex: '#2b7fff' };
			case 'red':
				return { human_readable: 'bg-red-500', hex: '#fb2c36' };
			case 'yellow':
				return { human_readable: 'bg-yellow-500', hex: '#efb100' };
			case 'black':
				return { human_readable: 'bg-black', hex: '#000000' };
		}
	};
</script>

<style lang="css" scoped>
	.myloc-box::after {
		content: '';
		position: absolute;
		bottom: -20px;
		left: 50%;
		transform: translateX(-50%);
		border: 10px solid transparent;
		border-top-color: var(--marker-color);
	}
</style>
