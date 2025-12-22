<template>
	<main class="laptop:grid-cols-[60%_40%] relative grid h-screen grid-cols-1">
		<section class="laptop:block hidden h-full w-full">
			<!-- Carousel -->
			<ClientOnly>
				<ImageCarousel
					:images="slides"
					carousel-height="h-full"
					control-buttons-position="bottom-4" />
			</ClientOnly>
		</section>
		<div class="flex h-full flex-col">
			<div class="tablet:h-1/4 tablet:px-12 laptop:px-20 flex h-fit items-center px-4 py-2">
				<!-- <img
					src="/images/tracking-logo.jpg"
					class="tablet:h-16 h-14"
					alt="Flowbite Logo" /> -->
			</div>
			<div class="tablet:px-16 laptop:px-24 flex-grow px-4 py-4">
				<slot></slot>
			</div>
			<div
				class="laptop:mb-10 flex flex-col items-center justify-center p-2 text-xs sm:text-sm">
				<h6>
					&copy; 2025. All Rights Reserved.
					<span class="font-semibold text-pink-500">Regent Tracking Company</span>
				</h6>
			</div>
		</div>
	</main>
</template>

<script setup lang="ts">
	const slides: string[] = [
		'/images/slides/regenttrack/1.png',
		'/images/slides/regenttrack/2.png',
		'/images/slides/regenttrack/3.png',
		'/images/slides/regenttrack/4.png',
	];
</script>
