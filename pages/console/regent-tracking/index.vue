<template>
	<div class="relative flex-1 pt-[75px]">
		<div
			class="absolute left-5 flex h-[90%] w-[30rem] translate-y-5 flex-col border-[1px] bg-white shadow-md shadow-gray-300">
			<div class="p-5">
				<h1 class="font-semibold text-gray-600">{{ getPrincipal.corpName }} Fleet</h1>
				<h2
					class="mb-4 inline-flex h-10 w-full items-center justify-between text-sm text-gray-500">
					<span>{{ totalVehicles }} Total Vehicles</span>
					<span class="inline-flex items-center space-x-1">
						<span class="size-3 rounded-full bg-green-500"> </span>
						<span> Online </span>
					</span>
					<span class="inline-flex items-center space-x-1">
						<span class="size-3 rounded-full bg-yellow-500"> </span>
						<span> Offline </span>
					</span>
					<span class="inline-flex items-center space-x-1">
						<span class="size-3 rounded-full bg-red-500"> </span>
						<span> Expired </span>
					</span>
				</h2>
				<!-- filters -->
				<div>
					<form @submit.prevent="">
						<input
							type="text"
							name="search-devices"
							id="search-devices"
							class="mb-4 h-12 w-full rounded-lg bg-gray-100 text-sm text-gray-500 outline-none"
							placeholder="Start typing to search vehicles or drivers"
							v-model="searchString" />

						<div
							class="grid h-10 grid-cols-4 divide-x-[1.5px] overflow-clip rounded-lg border-[1px] text-xs text-gray-600">
							<button
								:class="[
									'font-semibold',
									deviceOnlineStatus == null && 'bg-blue-100',
								]"
								type="button"
								@click="setDeviceOnlineStatus(null)">
								All Vehicles
							</button>
							<button
								:class="[
									'font-semibold',
									deviceOnlineStatus == 'ack' && 'bg-blue-100',
								]"
								type="button"
								@click="setDeviceOnlineStatus('ack')">
								Online
							</button>
							<button
								:class="[
									'font-semibold',
									deviceOnlineStatus == 'offline' && 'bg-blue-100',
								]"
								type="button"
								@click="setDeviceOnlineStatus('offline')">
								Offline
							</button>
							<button
								:class="[
									'font-semibold',
									deviceOnlineStatus == 'expired' && 'bg-blue-100',
								]"
								type="button"
								@click="setDeviceOnlineStatus('expired')">
								Expired
							</button>
						</div>
					</form>
				</div>
			</div>
			<!-- when loading vehicles -->
			<div
				class="flex flex-grow items-center justify-center"
				v-if="fetchingClientVehicles">
				<h1>Loading...</h1>
			</div>

			<!-- The vehicle entries -->
			<div
				class="thin-scrollbar flex-grow overflow-y-auto p-5"
				v-else>
				<div
					v-for="(device, index) in computedVehicles"
					:key="index"
					class="mb-4 h-[12rem] rounded-lg border border-gray-200 p-5 shadow-sm outline-none">
					<div class="flex h-3/6 items-center justify-between">
						<div class="flex w-[100%] space-x-4">
							<button
								:class="[
									'inline-flex h-14 w-[17%] items-center justify-center rounded-lg shadow-md',
									`bg-${deriveColor(device.online)}-500`,
								]">
								<span
									class="icon-[material-symbols-light--delivery-truck-speed-outline-rounded] text-4xl text-slate-100"></span>
							</button>
							<div class="flex-grow">
								<h1 class="font-semibold text-gray-700 uppercase">
									{{ device.name }}
								</h1>
								<h2 class="text-sm text-gray-500">Mombasa Road, Nairobi</h2>
							</div>
						</div>
						<button
							class="inline-flex w-fit cursor-pointer justify-end rounded-lg border border-gray-200 bg-gray-100 p-1"
							type="button"
							@click="
								() => {
									setActiveDevice(device);
									alertsActiveDevice = device;
								}
							">
							<span
								class="icon-[material-symbols-light--double-arrow-rounded] text-2xl text-gray-600"></span>
						</button>
					</div>
					<div class="flex h-1/6 items-center space-x-3 text-sm text-gray-600">
						<span class="inline-flex items-center space-x-1">
							<span
								class="icon-[material-symbols-light--person-2-outline-rounded] text-2xl"></span
							><span>{{ device.driver_data.name ?? 'Driver name N/A' }}</span></span
						>
						<span>&vert;</span>
						<span class="inline-flex items-center space-x-3">
							<span
								class="icon-[material-symbols-light--nest-clock-farsight-analog-rounded] text-xl"></span
							><span>{{ device.time.toString().replace(' ', '-') }}</span>
						</span>
					</div>
					<div class="flex h-2/6 items-end justify-between">
						<div
							:class="[
								'flex h-10 w-24 items-center justify-center space-x-2 rounded-lg border text-sm outline-none',
								`bg-${deriveColor(device.online)}-100`,
								`border-${deriveColor(device.online)}-200`,
							]">
							<!-- tracker online -->
							<span
								v-if="['ack', 'engine', 'online'].includes(device.online)"
								:class="[
									'icon-[material-symbols-light--signal-wifi-4-bar] text-xl',
									`text-${deriveColor(device.online)}-600`,
								]"></span>
							<!-- tracker offline -->
							<span
								:class="[
									'icon-[material-symbols-light--signal-wifi-statusbar-not-connected] text-xl',
									`text-${deriveColor(device.online)}-600`,
								]"
								v-else-if="device.online == 'offline'"></span>

							<!-- expired subscription -->
							<span
								:class="[
									'icon-[material-symbols-light--signal-disconnected] text-xl',
									`text-${deriveColor(device.online)}-600`,
								]"
								v-else-if="device.online == 'expired'"></span>
							<span :class="['text-sm', `text-${deriveColor(device.online)}-600`]">{{
								device.online
							}}</span>
						</div>
						<span :class="['text-sm', `text-${deriveColor(device.online)}-600`]"
							>{{ device.speed }} {{ device.distance_unit_hour }}</span
						>
					</div>
				</div>
			</div>
		</div>

		<!-- the sidekick panel -->
		<Transition>
			<!-- TODO: Add in animations later  -->
			<div
				class="absolute left-0 flex h-[90%] max-h-[90%] w-[27rem] translate-x-[31.2rem] translate-y-5 flex-col border-[1px] bg-white shadow-md shadow-gray-300"
				v-if="activeDevice">
				<div class="p-5">
					<div class="flex items-center justify-between">
						<div>
							<h1 class="font-semibold text-gray-600">{{ activeDevice.name }}</h1>
							<h2 class="text-sm text-gray-500">Updated 1 minute ago</h2>
						</div>
						<button
							class="inline-flex size-11 items-center justify-center rounded-lg border-[1px]">
							<span
								class="icon-[material-symbols-light--close-small] text-3xl text-gray-600"></span>
						</button>
					</div>

					<!-- tracker status -->
					<div class="my-4 flex h-[68px] items-end justify-between">
						<div
							:class="[
								'flex h-10 w-24 items-center justify-center space-x-2 rounded-lg border text-sm outline-none',
								`bg-${deriveColor(activeDevice.online)}-100`,
								`border-${deriveColor(activeDevice.online)}-200`,
							]">
							<!-- tracker online -->
							<span
								v-if="['ack', 'engine', 'online'].includes(activeDevice.online)"
								:class="[
									'icon-[material-symbols-light--signal-wifi-4-bar] text-xl',
									`text-${deriveColor(activeDevice.online)}-600`,
								]"></span>
							<!-- tracker offline -->
							<span
								:class="[
									'icon-[material-symbols-light--signal-wifi-statusbar-not-connected] text-xl',
									`text-${deriveColor(activeDevice.online)}-600`,
								]"
								v-else-if="activeDevice.online == 'offline'"></span>

							<!-- expired subscription -->
							<span
								:class="[
									'icon-[material-symbols-light--signal-disconnected] text-xl',
									`text-${deriveColor(activeDevice.online)}-600`,
								]"
								v-else-if="activeDevice.online == 'expired'"></span>
							<span
								:class="['text-sm', `text-${deriveColor(activeDevice.online)}-600`]"
								>{{ activeDevice.online }}</span
							>
						</div>
						<span :class="['text-sm', `text-${deriveColor(activeDevice.online)}-600`]"
							>{{ activeDevice.speed }} {{ activeDevice.distance_unit_hour }}</span
						>
					</div>
					<!-- tab switcher -->
					<div
						class="grid h-10 grid-cols-3 divide-x-[1.5px] overflow-clip rounded-lg border-[1px] text-xs text-gray-600">
						<button
							:class="[
								'font-semibold',
								activeDeviceTab == 'details' && 'bg-blue-100',
							]"
							type="button"
							@click="setActiveDeviceTab('details')">
							Details
						</button>
						<button
							:class="[
								'inline-flex items-center justify-center space-x-2 font-semibold',
								activeDeviceTab == 'alerts' && 'bg-blue-100',
							]"
							type="button"
							@click="
								() => {
									executeFetchDeviceAlerts();
									setActiveDeviceTab('alerts');
								}
							">
							<span
								class="icon-[svg-spinners--ring-resize] text-lg text-gray-600"
								v-if="fetchingDeviceAlerts"></span>
							<span>Alerts</span>
						</button>
						<button
							:class="[
								'font-semibold',
								activeDeviceTab == 'history' && 'bg-blue-100',
							]"
							type="button"
							@click="setActiveDeviceTab('history')">
							History
						</button>
					</div>
				</div>

				<!-- switch view based on what tab is currently active  -->
				<div
					class="flex-grow space-y-5 p-5"
					v-if="activeDeviceTab == 'details'">
					<div
						class="flex h-fit flex-col rounded-lg border border-gray-200 p-4 shadow-sm outline-none">
						<h1 class="w-full font-bold text-gray-600">Vehicle Information</h1>
						<div class="my-5 h-20 rounded-lg border border-green-200 bg-green-50 p-3">
							<h1 class="text-sm font-semibold text-gray-500">Last Location</h1>
							<span class="text-sm text-gray-400"
								>Gataka Road, Nkaimurunya ward, Kajiado County</span
							>
						</div>
						<div class="space-y-5 text-sm">
							<!-- diver name -->
							<div class="grid grid-cols-[40%_60%] divide-x-1 divide-gray-400">
								<h1 class="inline-flex items-center space-x-3">
									<span
										class="icon-[material-symbols-light--person-2-outline-rounded] text-xl text-gray-500"></span>
									<span class="text-gray-500">Driver</span>
								</h1>
								<span class="text-end font-semibold text-gray-600">{{
									activeDevice.driver_data.name ?? 'Name N/A'
								}}</span>
							</div>

							<!-- diver name -->
							<div class="grid grid-cols-[40%_60%] divide-x-1 divide-gray-400">
								<h1 class="inline-flex items-center space-x-3">
									<span
										class="icon-[material-symbols-light--indeterminate-question-box] text-xl text-gray-500"></span>
									<span class="text-gray-500">Current Status</span>
								</h1>
								<span class="text-end font-semibold text-gray-600"
									>{{ activeDevice.online }}
								</span>
							</div>

							<!-- recent ping -->
							<div class="grid grid-cols-[40%_60%] divide-x-1 divide-gray-400">
								<h1 class="inline-flex items-center space-x-3">
									<span
										class="icon-[material-symbols-light--nest-clock-farsight-analog-rounded] text-lg text-gray-500"></span>
									<span class="text-gray-500">Recent Ping</span>
								</h1>
								<span class="text-end font-semibold text-gray-600">{{
									activeDevice.time.toString().replace(' ', ' | ')
								}}</span>
							</div>
						</div>
					</div>

					<div
						class="flex h-fit flex-col rounded-lg border border-gray-200 p-4 shadow-sm outline-none">
						<h1 class="mb-4 w-full text-sm font-bold text-gray-600">
							Vehicle Commands
						</h1>
						<div class="grid grid-cols-2 gap-4">
							<button
								class="inline-flex items-center justify-center space-x-3 rounded-lg bg-red-500 p-3 text-slate-100"
								type="button"
								@click="
									triggerDeviceCommand(
										'stop',
										activeDevice.id,
										'Engine Stop',
										'engineStop',
									)
								">
								<span
									class="icon-[svg-spinners--ring-resize]text-2xl text-slate-100"
									v-if="stopDeviceCommandLoading"></span>
								<span
									v-else
									class="icon-[material-symbols-light--stop-circle-rounded] text-2xl text-slate-100"></span>
								<span class="text-sm font-semibold">Stop Engine</span>
							</button>
							<button
								class="inline-flex items-center justify-center space-x-3 rounded-lg bg-green-500 p-3 text-sm font-semibold text-slate-100"
								type="button"
								@click="
									triggerDeviceCommand(
										'start',
										activeDevice.id,
										'Engine Resume',
										'engineResume',
									)
								">
								<span
									class="icon-[svg-spinners--ring-resize]text-2xl text-slate-100"
									v-if="startDeviceCommandLoading"></span>
								<span
									class="icon-[material-symbols-light--play-circle] text-2xl text-slate-100"
									v-else></span>
								<span class="text-sm font-semibold">Start Engine</span>
							</button>
						</div>
					</div>
				</div>
				<div
					class="thin-scrollbar relative flex-grow overflow-y-auto pt-24"
					v-else-if="activeDeviceTab == 'alerts'">
					<div class="absolute top-0 my-3 h-20 w-full bg-red-500 p-2"></div>
					<div
						v-for="(a, index) in alerts"
						:key="index"
						class="mx-5 mb-4 h-28 rounded-lg border border-gray-300 p-5 shadow-sm">
						<h1 class="font-bold text-gray-600">{{ a.type }}</h1>
						<p class="text-sm font-medium text-gray-500">
							{{ a.name }}
						</p>
						<p class="inline-flex items-center space-x-3 text-sm text-gray-400">
							<span>&iacute;</span>
							<span
								>{{ a.created_at.split(' ')[0] }} |
								{{ a.created_at.split(' ')[1] }}</span
							>
						</p>
					</div>
				</div>
				<div
					class="flex-grow space-y-5 p-5"
					v-else-if="activeDeviceTab == 'history'">
					<NuxtLink
						:to="{
							name: 'regent-tracking-vehicle-history',
							query: { device_id: activeDevice.id, vehicle_reg: activeDevice.name },
						}"
						class="out inline-flex h-12 w-full items-center justify-center space-x-1 rounded-lg bg-blue-500 outline-none">
						<span
							class="icon-[material-symbols-light--info-outline-rounded] text-xl text-slate-100"></span>
						<span class="text-sm text-slate-100">View Detailed History</span>
					</NuxtLink>
				</div>
			</div>
		</Transition>
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
	const { getPrincipal } = useAuth();

	const {
		totalVehicles,
		computedVehicles,
		searchString,
		deviceOnlineStatus,
		fetchingClientVehicles,
		errorFetchingClientVehicles,
		activeDevice,
		activeDeviceTab,
		deriveColor,
		setDeviceOnlineStatus,
		setActiveDevice,
		setActiveDeviceTab,
	} = await useRegentDeviceTracking();
	const { startDeviceCommandLoading, stopDeviceCommandLoading, triggerDeviceCommand } =
		useRegentTrackingDeviceUtils();

	const {
		alertsActiveDevice,
		dateFrom,
		dateTo,
		alerts,
		fetchingDeviceAlerts,
		errorFetchingDeviceAlerts,
		executeFetchDeviceAlerts,
	} = await useRegentTrackingDeviceAlerts();

	const {
		startTimestamp,
		deviceHistory,
		endTimestamp,
		getDeviceHistoryLoading,
		getDeviceHistory,
	} = useTrackedDeviceCommandsAndHistory();
	const { coords, error: geolocationError, isSupported: geolocationSupported } = useGeolocation();
</script>
