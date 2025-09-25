<template>
	<div class="mb-4 h-[12rem] rounded-lg border border-gray-200 p-5 shadow-sm outline-none">
		<div class="flex h-3/6 items-center justify-between">
			<div class="flex w-[100%] space-x-4">
				<button
					:class="[
						'inline-flex h-14 w-[16%] max-w-[16%] min-w-[16%] items-center justify-center rounded-lg shadow-md',
						`bg-${deriveColor(device.online)}-500`,
					]">
					<span
						class="icon-[material-symbols-light--delivery-truck-speed-outline-rounded] text-4xl text-slate-100"></span>
				</button>
				<div class="flex-grow">
					<h1 class="font-semibold text-gray-700 uppercase">
						{{ props.device.name }}
					</h1>
					<h2 class="text-sm text-gray-500">Open to see location.</h2>
				</div>
			</div>
			<button
				class="inline-flex w-fit cursor-pointer justify-end rounded-lg border border-gray-200 bg-gray-100 p-1"
				type="button"
				@click="() => emits('setActiveDevice', device)">
				<span
					class="icon-[material-symbols-light--double-arrow-rounded] text-2xl text-gray-600"></span>
			</button>
		</div>
		<div class="flex h-1/6 items-center space-x-3 text-sm text-gray-600">
			<span class="inline-flex items-center space-x-1">
				<span
					class="icon-[material-symbols-light--person-2-outline-rounded] text-2xl"></span
				><span>{{ props.device.driver_data.name ?? 'Name N/A' }}</span></span
			>
			<span>&vert;</span>
			<span class="inline-flex items-center space-x-3">
				<span
					class="icon-[material-symbols-light--nest-clock-farsight-analog-rounded] text-xl"></span
				><span>{{ props.device.time.toString().replace(' ', '-') }}</span>
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
</template>

<script setup lang="ts">
	import { type TrackedVehicles } from '~/types/regent-tracking/tracked-vehicles';

	const props = defineProps({
		device: {
			required: true,
			type: Object as () => TrackedVehicles,
		},
	});
	const emits = defineEmits(['setActiveDevice']);
</script>
