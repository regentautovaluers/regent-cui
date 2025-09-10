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
							class="grid h-10 grid-cols-4 divide-x-[1.5px] rounded-lg border-[1px] text-xs text-gray-600">
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
							class="inline-flex w-fit justify-end rounded-lg border border-green-200 bg-green-100 p-1"
							type="button">
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
		deriveColor,
		setDeviceOnlineStatus,
	} = await useRegentDeviceTracking();

	const {
		startTimestamp,
		deviceHistory,
		endTimestamp,
		getDeviceHistoryLoading,
		getDeviceHistory,
	} = useTrackedDeviceCommandsAndHistory();
	const { coords, error: geolocationError, isSupported: geolocationSupported } = useGeolocation();
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
