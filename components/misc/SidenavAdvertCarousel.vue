<template>
	<!-- Slider -->
	<div
		data-hs-carousel='{
            "loadingClasses": "opacity-0",
            "isAutoPlay": true
        }'
		class="relative bg-red-500">
		<div
			class="hs-carousel relative overflow-hidden w-full min-h-[340px] bg-white rounded-lg">
			<div
				class="hs-carousel-body absolute top-0 bottom-0 start-0 flex flex-nowrap transition-transform duration-700 opacity-0">
				<div
					class="hs-carousel-slide"
					v-for="(advertisement, index) in advertisements"
					:key="index">
					<div class="flex justify-center h-full  bg-gray-100 p-6">
						<span
							class="self-center text-4xl transition duration-700"
							>{{ advertisement }}</span
						>
					</div>
				</div>
			</div>
		</div>

		<div
			class="hs-carousel-pagination flex justify-center absolute top-3 start-0 end-0 space-x-2">
			<span
				v-for="index in advertisements"
				:key="index"
				class="hs-carousel-active:bg-pink-700 size-3 border border-gray-400 rounded-full cursor-pointer" />
		</div>
	</div>
	<!-- End Slider -->
</template>

<script setup lang="ts">
	const advertisements = ref(["First Slide", "Second Slide", "Third Slide"]);
</script>
