<template>
	<!-- Slider -->
	<div
		data-hs-carousel='{
            "loadingClasses": "opacity-0",
            "isAutoPlay": true
        }'
		class="relative px-2 my-2">
		<div
			class="hs-carousel relative overflow-hidden w-full h-[340px] bg-white rounded-lg">
			<div
				class="hs-carousel-body absolute top-0 bottom-0 start-0 flex flex-nowrap transition-transform duration-700 opacity-0">
				<div
					class="hs-carousel-slide"
					v-for="(advertisement, index) in advertisements"
					:key="index">
					<div class="flex justify-center w-full h-full bg-gray-100">
						<img
							:src="advertisement"
							alt="Image Advertisement"
							class="object-fill" />
					</div>
				</div>
			</div>
		</div>
		<div
			class="hs-carousel-pagination flex justify-center absolute top-3 start-0 end-0 space-x-2">
			<span
				v-for="index in advertisements"
				:key="index"
				class="hs-carousel-active:bg-pink-600 size-3 border border-gray-400 rounded-full cursor-pointer" />
		</div>
	</div>
	<!-- End Slider -->
</template>

<script setup lang="ts">
	const advertisements = ref([
		"https://stickernova.fra1.cdn.digitaloceanspaces.com/regent-ava/WhatsApp%20Image%202024-04-18%20at%203.10.40%20PM.jpeg",
		"https://stickernova.fra1.cdn.digitaloceanspaces.com/regent-ava/WhatsApp%20Image%202024-04-18%20at%203.10.39%20PM.jpeg",
		"https://stickernova.fra1.cdn.digitaloceanspaces.com/regent-ava/WhatsApp%20Image%202024-04-18%20at%203.10.38%20PM%20(2).jpeg",
	]);
</script>
