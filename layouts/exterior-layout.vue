<template>
	<main class="laptop-lg:grid-cols-[60%_40%] relative grid h-screen grid-cols-1">
		<section class="hidden w-full xl:block">
			<!-- Carousel -->
			<ClientOnly>
				<ImageCarousel
					:images="[
						'/images/slides/landingpage/1.jpg',
						'/images/slides/landingpage/2.jpg',
						'/images/slides/landingpage/3.jpg',
						'/images/slides/landingpage/4.jpg',
					]"
					carousel-height="h-full"
					control-buttons-position="bottom-4" />
			</ClientOnly>
		</section>
		<div class="flex flex-col justify-between">
			<div class="flex h-fit items-center px-4 py-2 md:h-1/4 md:px-12 xl:px-20">
				<img
					src="/images/app-logo.png"
					class="tablet:h-20 h-16"
					alt="Flowbite Logo" />
			</div>
			<div class="flex-grow px-4 py-4 md:px-16 xl:px-24">
				<slot />
			</div>
			<div class="my-10 flex flex-col items-center justify-center p-2 text-xs sm:text-sm">
				<!-- uncomment this if you want to add language switcher -->
				<!-- <button
					id="dropdownTopButton"
					data-dropdown-toggle="dropdownTop"
					data-dropdown-placement="top"
					class="mb-2 me-3 inline-flex items-center rounded-full border px-5 py-2.5 text-center text-sm font-semibold text-gray-500 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
					type="button">
					{{ language }}
					<svg
						class="ms-3 h-2.5 w-2.5"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 10 6">
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5 5 1 1 5" />
					</svg>
				</button>
				
				<div
					id="dropdownTop"
					class="z-10 hidden w-44 divide-y divide-gray-100 rounded-lg bg-white shadow">
					<ul
						class="py-2 text-sm text-gray-500"
						aria-labelledby="dropdownTopButton">
						<li
							v-for="(lang, index) in availableLanguages"
							:key="index">
							<button
								class="block w-full px-4 py-2 text-center hover:bg-gray-100"
								@click.prevent="language = lang">
								{{ lang }}
							</button>
						</li>
					</ul>
				</div> -->
				<h6>
					&copy; 2024. All Rights Reserved.
					<span class="font-semibold text-pink-500">Regent Auto Valuers</span>
				</h6>
			</div>
		</div>

		<!-- TODO: Add fixes for this cookie consent notice -->
		<!-- <div
			v-if="displayCookieConsent()"
			class="absolute bottom-2 left-1/2 z-50 h-56 w-[90%] -translate-x-[50%] rounded-lg border-2 border-blue-600 bg-white p-3 md:w-[55%] lg:w-1/4">
			<h1 class="py-2 text-xl font-semibold">Cookie Consent</h1>
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
	const slides: readonly string[] = [
		'/images/slides/landingpage/1.jpg',
		'/images/slides/landingpage/2.jpg',
		'/images/slides/landingpage/3.jpg',
		'/images/slides/landingpage/4.jpg',
		'/images/slides/landingpage/5.jpg',
		'/images/slides/landingpage/6.jpg',
	];
</script>
