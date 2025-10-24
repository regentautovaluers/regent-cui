<template>
	<li
		class="ms-4 cursor-pointer rounded-lg outline-none hover:bg-gray-100 p-2"
		ref="entry"
		@click="$emit('entryClicked')">
		<div
			:class="[
				'absolute -start-2.5 size-5 rounded-full border border-white',
				eventType == 'Start' && 'bg-green-500',
				eventType == 'Idle' && 'bg-yellow-500',
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
		<p class="mb-4 inline-flex items-center space-x-2 text-sm">
			<span class="text-gray-700">{{ vehicleEventType }} Duration</span>
			<span class="text-2xl">&middot;</span>
			<span class="text-gray-500">{{ eventDuration }}</span>
		</p>
	</li>
</template>

<script setup lang="ts">
	import { useIntersectionObserver } from '@vueuse/core';
	import type { ShallowRef } from 'vue';

	const { eventType, vehicleEventType, eventDuration, eventStartedAt, eventLat, eventLng } =
		defineProps<{
			eventType: 'Start' | 'Idle' | 'Stop';
			vehicleEventType: 'Driving' | 'Stop' | 'Idle';
			eventDuration: string | null;
			eventStartedAt: string;
			eventLat?: number;
			eventLng?: number;
		}>();
	const events = defineEmits(['entryClicked']);
	const location: ShallowRef<string | null> = shallowRef(null);
	const entry = useTemplateRef<HTMLElement>('entry');
	const { gecodeLocation } = useGoogleMaps();
	const { stop } = useIntersectionObserver(
		entry,
		async ([entry]) => {
			if (eventLat && eventLng) {
				if (entry.intersectionRatio >= 0.5 && !location.value) {
					location.value = 'Loading location...';
					try {
						location.value = await gecodeLocation(eventLat, eventLng);
					} catch (_er) {
						location.value = 'Failed to find location!';
					}

					stop(); // stop observing after the first observation
				}
			}
		},
		{ threshold: 0.5 },
	);
</script>
