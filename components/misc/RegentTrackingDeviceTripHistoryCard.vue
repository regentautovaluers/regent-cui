<template>
	<li
		:class="['ms-4 rounded-lg p-2 outline-none hover:bg-gray-100 transition-colors duration-200 ease-linear cursor-pointer']"
		ref="entry"
		@click="$emit('entryClicked', location)">
		<div
			:class="[
				'absolute -start-2.5 size-5 rounded-full border border-white',
				eventType == 'Start' && 'bg-green-500',
				eventType == 'Stop' && 'bg-red-500',
			]"></div>
		<h1 class="inline-flex space-x-3 text-sm leading-none text-gray-700">
			<span class="font-semibold">{{ eventType }}</span>
			<span>&VerticalBar;</span>
			<time class="font-semibold">{{ eventStartedAt.split(' ')[1].substring(0, 5) }}</time>
		</h1>
		<p class="text-sm font-normal text-gray-500">
			{{ !location ? 'Scroll to view location!' : location }}
		</p>
		<p
			v-if="eventType == 'Start'"
			class="mb-4 inline-flex items-center space-x-2 text-sm">
			<span class="text-gray-700">Driving Duration</span>
			<span class="text-2xl">&middot;</span>
			<span class="text-gray-500">{{ drivingDuration?.replace(/\s*\d+s$/, '') }}</span>
		</p>
		<p
			v-else-if="eventType == 'Stop'"
			class="mb-4 inline-flex items-center space-x-2 text-sm">
			<span class="text-gray-700">Stop Duration</span>
			<span class="text-2xl">&middot;</span>
			<span class="text-gray-500">{{ stopDuration?.replace(/\s*\d+s$/, '') ?? '-' }}</span>
		</p>
	</li>
</template>

<script setup lang="ts">
	import { useIntersectionObserver } from '@vueuse/core';
	import type { ShallowRef } from 'vue';

	const { eventType, drivingDuration, stopDuration, eventStartedAt, eventLat, eventLng } =
		defineProps<{
			eventType: 'Start' | 'Stop';
			drivingDuration?: string | null;
			stopDuration?: string | null;
			eventStartedAt: string;
			eventLat: number | string;
			eventLng: number | string;
		}>();
	const events = defineEmits(['entryClicked']);
	const location: ShallowRef<string | null> = shallowRef(null);
	const entry = useTemplateRef<HTMLElement>('entry');
	const { gecodeLocation } = useGoogleMaps();
	const { stop } = useIntersectionObserver(
		entry,
		async ([entry]) => {
			if (entry.intersectionRatio >= 0.5 && !location.value) {
				location.value = 'Loading location...';
				try {
					location.value = await gecodeLocation(Number(eventLat), Number(eventLng));
				} catch (_er) {
					location.value = 'Failed to find location!';
				}

				stop(); // stop observing after the first observation
			}
		},
		{ threshold: 0.5 },
	);
</script>
