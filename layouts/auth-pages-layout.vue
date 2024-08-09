<template>
	<main class="flex h-screen">
		<div class="hidden h-full w-[65%] lg:flex">
			<div
				data-hs-carousel='{
					"loadingClasses": "opacity-0",
					"isAutoPlay": true
				}'
				class="relative size-full">
				<div class="hs-carousel relative h-full min-h-96 w-full overflow-hidden bg-white">
					<div
						class="hs-carousel-body absolute bottom-0 start-0 top-0 flex flex-nowrap opacity-0 transition-transform duration-700">
						<div
							class="hs-carousel-slide"
							v-for="(advertisement, index) in advertisements"
							:key="index">
							<div class="flex h-full w-full justify-center bg-gray-100">
								<img
									:src="advertisement"
									alt="Image Advertisement"
									class="object-cover" />
							</div>
						</div>
					</div>
				</div>
				<div
					class="hs-carousel-pagination absolute bottom-3 end-0 start-0 flex justify-center space-x-2">
					<span
						v-for="index in advertisements"
						:key="index"
						class="size-3 cursor-pointer rounded-full border border-gray-400 hs-carousel-active:bg-pink-600" />
				</div>
			</div>
			<!-- End Slider -->
		</div>
		<div class="flex flex-grow flex-col justify-between px-4 md:px-20">
			<slot />
			<div class="mb-4 text-center text-sm">
				<span
					>Copyright &copy 2024. All Rights Reserved.
					<span class="font-semibold text-pink-500">Regent Auto Valuers</span></span
				>
			</div>
		</div>
	</main>
</template>

<script setup lang="ts">
	const advertisements = ref([
		'/images/auth-img-parking-lot.webp',
		'/images/auth-img-parking-lot.webp',
		'/images/auth-img-parking-lot.webp',
	]);
</script>
