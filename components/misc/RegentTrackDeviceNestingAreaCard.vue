<template>
	<div
		class="h-[10.5rem] rounded-lg border border-green-100 bg-gray-100 p-5 outline-none"
		ref="entryCard">
		<div class="flex items-center justify-between">
			<div>
				<h1
					class="font-semibold text-gray-700"
					v-if="entryIndex == 0">
					Most Likely
				</h1>
				<h1
					class="font-semibold text-gray-700"
					v-else-if="entryIndex == 1">
					Medium Likely
				</h1>
				<h1
					class="font-semibold text-gray-700"
					v-else-if="entryIndex == 2">
					Least Likely
				</h1>
				<h1
					class="font-semibold text-gray-700"
					v-else>
					Other Places
				</h1>
				<p class="text-sm text-gray-500">
					{{ !deviceLocation ? 'Scroll to view location!' : deviceLocation }}
				</p>
			</div>
			<div
				v-if="[0, 1, 2].includes(entryIndex)"
				:class="[
					'flex w-[25%] justify-center rounded-full border p-1 text-xs outline-none',
					entryIndex == 0 && 'border-green-400 bg-green-100 text-green-500',
					entryIndex == 1 && 'border-yellow-400 bg-yellow-100 text-yellow-500',
					entryIndex == 2 && 'border-red-400 bg-red-100 text-red-500',
				]">
				<span v-if="entryIndex == 0">Very High</span>
				<span v-else-if="entryIndex == 1">Medium</span>
				<span v-else-if="entryIndex == 2">Low</span>
			</div>
		</div>
		<div class="mt-2 flex items-center justify-between">
			<div>
				<h1 class="inline-flex items-center space-x-1">
					<span
						class="icon-[material-symbols-light--nest-clock-farsight-analog-rounded] text-gray-700"></span>
					<span class="font-bold text-gray-700">{{ Math.ceil(timeAtLocation) }}hrs</span>
				</h1>
				<h2 class="text-sm text-gray-500">Time Spent</h2>
			</div>
			<div>
				<h1 class="inline-flex items-center space-x-1">
					<span
						class="icon-[material-symbols-light--pie-chart-outline] text-xl text-gray-700"></span>
					<span class="font-bold text-gray-700"
						>~{{ timeAtLocationFraction.toFixed(1) }}%</span
					>
				</h1>
				<h2 class="text-sm text-gray-500">Of Time</h2>
			</div>
			<div>
				<h1 class="inline-flex items-center space-x-1">
					<span
						class="icon-[material-symbols-light--pin-drop-outline] text-xl text-gray-700"></span>
					<span class="font-bold text-gray-700">{{ numberOfAppearances }}</span>
				</h1>
				<h2 class="text-sm text-gray-500">Visits</h2>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useIntersectionObserver } from '@vueuse/core';
	import type { ShallowRef } from 'vue';

	const { entryIndex, timeAtLocation, timeAtLocationFraction, locationLat, locationLng } =
		defineProps<{
			entryIndex: number;
			timeAtLocation: number;
			timeAtLocationFraction: number;
			numberOfAppearances: number;
			locationLat: number;
			locationLng: number;
		}>();
	const deviceLocation: ShallowRef<string | null> = shallowRef(null);
	const { gecodeLocation } = useGoogleMaps();
	const entryCard = useTemplateRef<HTMLDivElement>('entryCard');
	const { stop } = useIntersectionObserver(
		entryCard,
		async ([entry]) => {
			if (entry.intersectionRatio >= 0.5 && !deviceLocation.value) {
				deviceLocation.value = 'Loading location...';
				try {
					deviceLocation.value = await gecodeLocation(locationLat, locationLng);
				} catch (_er) {
					deviceLocation.value = 'Failed to find location!';
				}

				stop(); // stop observing after the first observation
			}
		},
		{ threshold: 0.5 },
	);
</script>
