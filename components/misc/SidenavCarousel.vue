<template>
	<div
		id="default-carousel"
		class="relative my-6 w-full rounded-lg border"
		data-carousel="slide">
		<!-- Carousel wrapper -->
		<div class="relative h-[23rem] overflow-hidden rounded-lg">
			<!-- Item 1 -->
			<div
				class="hidden duration-700 ease-in-out"
				data-carousel-item
				v-for="(slide, index) in slides"
				:key="index">
				<img
					:src="slide"
					class="object-fit size-full"
					alt="Sidenav Slide" />
			</div>
		</div>
		<!-- Slider indicators -->
		<div
			class="absolute left-1/2 top-3 z-30 flex -translate-x-1/2 space-x-3 rtl:space-x-reverse">
			<button
				v-for="index in slides"
				:key="index"
				type="button"
				class="h-3 w-3 rounded-full"
				aria-current="true"
				:aria-label="'Slide ' + index"
				:data-carousel-slide-to="index"></button>
		</div>
	</div>
</template>

<script setup lang="ts">
	const slides: readonly string[] = [
		'/images/slides/sidenav/1_04092024.jpg',
		'/images/slides/sidenav/2_04092024.jpg',
		'/images/slides/sidenav/3_04092024.jpg',
	];
</script>
