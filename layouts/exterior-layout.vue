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
				<img
					src="/images/app-logo.png"
					class="tablet:h-16 h-14"
					alt="Flowbite Logo" />
			</div>
			<div class="tablet:px-16 laptop:px-24 flex-grow px-4 py-4">
				<slot></slot>
			</div>
			<div
				class="laptop:mb-10 flex flex-col items-center justify-center p-2 text-xs sm:text-sm">
				<h6>
					&copy; 2025. All Rights Reserved.
					<span class="font-semibold text-pink-500">Regent Auto Valuers</span>
				</h6>
			</div>
		</div>

		<!-- TODO: Add fixes for this cookie consent notice -->
		<!-- <div
			v-if="displayCookieConsent()"
			class="absolute bottom-2 left-1/2 z-50 h-56 w-[90%] -translate-x-[50%] rounded-lg border-2 border-blue-600 bg-white p-3 tablet:w-[55%] lg:w-1/4">
			<h1 class="py-2 text-laptop font-semibold">Cookie Consent</h1>
			<p class="text-gray-500">
				Hi. Welcome to Regent Valuer's Corporate Dashboard. This site uses cookies to
				maintain your sessions and track your activity across our services. Your cookies are
				not shared with third parties and can be removed at any time. By authenticating with
				this site, you agree to have us store cookies on your browser.
			</p>
		</div> -->
	</main>
</template>

<script setup lang="ts">
	const slides: string[] = [
		'/images/slides/landingpage/1.jpg',
		'/images/slides/landingpage/2.jpg',
		'/images/slides/landingpage/3.jpg',
		'/images/slides/landingpage/4.jpg',
	];
</script>
