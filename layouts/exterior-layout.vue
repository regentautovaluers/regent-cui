<template>
	<main class="flex h-screen">
		<section class="hidden w-[60%] lg:flex">
			<div
				id="default-carousel"
				class="relative h-full w-full"
				data-carousel="slide">
				<!-- Carousel wrapper -->
				<div class="relative h-full overflow-hidden rounded-lg">
					<!-- Item 1 -->
					<div
						class="hidden duration-700 ease-in-out"
						data-carousel-item>
						<img
							src="/sample_img_1.jpg"
							class="size-full object-cover"
							alt="..." />
					</div>
					<!-- Item 2 -->
					<div
						class="hidden duration-700 ease-in-out"
						data-carousel-item>
						<img
							src="https://plus.unsplash.com/premium_photo-1718198497330-08b58f749d4b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
							class="size-full object-cover"
							alt="..." />
					</div>
					<!-- Item 3 -->
					<div
						class="hidden duration-700 ease-in-out"
						data-carousel-item>
						<img
							src="https://plus.unsplash.com/premium_photo-1718198497330-08b58f749d4b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
							class="size-full object-cover"
							alt="..." />
					</div>
				</div>
				<!-- Slider indicators -->
				<div
					class="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 space-x-3 rtl:space-x-reverse">
					<button
						type="button"
						class="h-3 w-3 rounded-full"
						aria-current="true"
						aria-label="Slide 1"
						data-carousel-slide-to="0"></button>
					<button
						type="button"
						class="h-3 w-3 rounded-full"
						aria-current="false"
						aria-label="Slide 2"
						data-carousel-slide-to="1"></button>
					<button
						type="button"
						class="h-3 w-3 rounded-full"
						aria-current="false"
						aria-label="Slide 3"
						data-carousel-slide-to="2"></button>
				</div>
				<!-- Slider controls -->
				<button
					type="button"
					class="group absolute start-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
					data-carousel-prev>
					<span
						class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white">
						<svg
							class="h-4 w-4 text-white dark:text-gray-800 rtl:rotate-180"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 6 10">
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 1 1 5l4 4" />
						</svg>
						<span class="sr-only">Previous</span>
					</span>
				</button>
				<button
					type="button"
					class="group absolute end-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
					data-carousel-next>
					<span
						class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white">
						<svg
							class="h-4 w-4 text-white dark:text-gray-800 rtl:rotate-180"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 6 10">
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="m1 9 4-4-4-4" />
						</svg>
						<span class="sr-only">Next</span>
					</span>
				</button>
			</div>
		</section>
		<div class="flex flex-grow flex-col justify-between">
			<div class="flex h-[15%] items-center px-4 md:h-1/4 md:px-16 xl:px-24">
				<h1>Logo</h1>
			</div>
			<div class="flex-grow px-4 py-4 md:px-16 xl:px-24">
				<slot />
			</div>
			<div class="flex flex-col items-center justify-center p-2 text-xs sm:text-sm">
				<button
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
				<!-- Dropdown menu -->
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
				</div>
				<h6>
					&copy; 2024. All Rights Reserved.
					<span class="font-semibold text-pink-500">Regent Auto Valuers</span>
				</h6>
			</div>
		</div>
	</main>
</template>

<script setup lang="ts">
	const { language, availableLanguages } = useSystemLocale();
</script>
