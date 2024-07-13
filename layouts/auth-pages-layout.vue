<template>
	<main class="flex h-screen">
		<div class="w-[60%] min-w-[60%] h-full hidden lg:flex">
			<div
				data-hs-carousel='{
					"loadingClasses": "opacity-0",
					"isAutoPlay": true
				}'
				class="relative size-full">
				<div
					class="hs-carousel relative overflow-hidden w-full min-h-96 bg-white rounded-lg h-full">
					<div
						class="hs-carousel-body absolute top-0 bottom-0 start-0 flex flex-nowrap transition-transform duration-700 opacity-0">
						<div
							class="hs-carousel-slide"
							v-for="(advertisement, index) in advertisements"
							:key="index">
							<div
								class="flex justify-center w-full h-full bg-gray-100">
								<img
									:src="advertisement"
									alt="Image Advertisement"
									class="object-cover" />
							</div>
						</div>
					</div>
				</div>

				<div
					class="hs-carousel-pagination flex justify-center absolute bottom-3 start-0 end-0 space-x-2">
					<span
						v-for="index in advertisements"
						:key="index"
						class="hs-carousel-active:bg-pink-600 size-3 border border-gray-400 rounded-full cursor-pointer" />
				</div>
			</div>
			<!-- End Slider -->
		</div>
		<div class="flex-grow px-2 mt-10 lg:my-28 md:px-28">
			<slot />
		</div>
	</main>
</template>

<script setup lang="ts">
	const advertisements = ref([
		"/images/auth-img-parking-lot.webp",
		"/images/auth-img-parking-lot.webp",
		"/images/auth-img-parking-lot.webp",
	]);
</script>
