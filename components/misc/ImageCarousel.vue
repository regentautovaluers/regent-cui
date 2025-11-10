<template>
	<div
		:class="[
			'relative w-full max-w-full overflow-hidden border-[.5px] bg-white shadow-lg',
			props.carouselHeight,
		]">
		<div
			v-for="(image, index) in props.images"
			:key="index"
			:class="[
				'relative',
				{
					active: index === activeIndex,
					leaving: index === leavingIndex && index !== activeIndex,
				},
			]"
			class="carousel-item">
			<a
				v-if="props.links"
				:href="props.links[index].to"
				target="_blank"
				rel="noopener noreferrer"
				class="absolute bottom-4 w-[85%] translate-x-[18px] border-[.5px] bg-slate-100 p-3 text-center text-xs font-bold shadow-md"
				>{{ props.links[index].text }}</a
			>
			<img
				:src="image"
				:alt="`Image ${index + 1}`"
				class="h-full w-full object-cover" />
		</div>

		<div
			:class="[
				'absolute left-1/2 z-10 flex -translate-x-1/2 transform space-x-2',
				props.controlButtonsPosition,
			]">
			<button
				v-for="(_image, index) in images"
				:key="`btn-${index}`"
				@click="goToSlide(index)"
				:class="{
					'bg-pink-600': index === activeIndex,
					'bg-slate-100': index !== activeIndex,
				}"
				class="carousel-btn h-3 w-3 rounded-full transition-colors duration-300 hover:bg-slate-400"></button>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted, onUnmounted, watch } from 'vue';

	// Define props for the component
	const props = defineProps({
		images: { required: true, type: Array<String> },
		links: {
			required: false,
			type: { text: String, to: String },
		},
		carouselHeight: { required: true, type: String },
		controlButtonsPosition: { required: true, type: String },
	});

	// Reactive state
	const activeIndex = ref<number>(0);
	const leavingIndex = ref<number | null>(null); // Index of the slide that's animating out
	let intervalId: number | null = null; // Use `let` for reassignment

	// Transition duration from CSS (in milliseconds)
	const TRANSITION_DURATION = 5000;

	/**
	 * Updates the active slide and manages the leaving slide for animation.
	 * @param index The index of the slide to show.
	 */
	const goToSlide = (index: number) => {
		if (index === activeIndex.value) return; // Prevent unnecessary updates if already on this slide

		// Set the current active slide as the one that will be leaving
		leavingIndex.value = activeIndex.value;
		// Update the active slide
		activeIndex.value = index;

		// Clear the leavingIndex after the animation duration
		// This prevents the 'leaving' class from lingering on an invisible element
		setTimeout(() => {
			if (leavingIndex.value === activeIndex.value) {
				// Ensure it's not the newly active slide
				leavingIndex.value = null;
			}
		}, TRANSITION_DURATION);

		resetInterval(); // Reset slideshow timer on manual navigation
	};

	/**
	 * Advances to the next slide, looping back to the start if at the end.
	 */
	const nextSlide = () => {
		const newIndex = (activeIndex.value + 1) % props.images.length;
		goToSlide(newIndex);
	};

	/**
	 * Starts the automatic slideshow.
	 */
	const startSlideshow = () => {
		if (intervalId) {
			clearInterval(intervalId);
		}
		// Type assertion for setInterval as it returns a Node.js Timeout or a number in browsers
		intervalId = setInterval(nextSlide, 3000) as unknown as number;
	};

	/**
	 * Clears and restarts the slideshow interval.
	 * Useful when a user manually navigates to a slide.
	 */
	const resetInterval = () => {
		startSlideshow();
	};

	// Lifecycle hooks
	onMounted(() => {
		// Start the slideshow when the component is mounted
		startSlideshow();
	});

	onUnmounted(() => {
		// Clear the interval when the component is unmounted to prevent memory leaks
		if (intervalId) {
			clearInterval(intervalId);
		}
	});

	// Watch for changes in the images prop (optional, but good practice if images can change dynamically)
	watch(
		() => props.images,
		(newImages) => {
			// Reset carousel if images change
			activeIndex.value = 0;
			leavingIndex.value = null;
			resetInterval();
			if (newImages.length === 0) {
				if (intervalId) clearInterval(intervalId);
				intervalId = null;
			}
		},
		{ immediate: true },
	); // immediate: true ensures it runs on initial mount too if images are provided
</script>

<style lang="css" scoped>
	.carousel-item {
		height: 100%;
		display: block; /* Keep block for positioning */
		position: absolute; /* Absolute for layering */
		top: 0;
		left: 0;
		width: 100%;
		opacity: 0;
		transform: translateX(100%); /* Start off-screen to the right */
		transition:
			transform 0.7s ease-out,
			opacity 0.7s ease-out; /* Smooth transition */
	}
	.carousel-item.active {
		opacity: 1;
		transform: translateX(0); /* Slide into view */
		z-index: 10; /* Bring active slide to front */
	}
	.carousel-item.leaving {
		transform: translateX(-100%); /* Slide out to the left */
		opacity: 0;
		z-index: 5; /* Keep it above inactive, but below active */
	}
</style>
