<template>
	<!-- Slider -->
	<div
		data-hs-carousel='{
            "loadingClasses": "opacity-0",
            "isAutoPlay": true
        }'
		class="relative my-2 px-2">
		<div class="hs-carousel relative h-[340px] w-full overflow-hidden rounded-lg bg-white">
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
							class="object-fill" />
					</div>
				</div>
			</div>
		</div>
		<div
			class="hs-carousel-pagination absolute end-0 start-0 top-3 flex justify-center space-x-2">
			<span
				v-for="index in advertisements"
				:key="index"
				class="size-3 cursor-pointer rounded-full border border-gray-400 hs-carousel-active:bg-pink-600" />
		</div>
	</div>
	<!-- End Slider -->
</template>

<script setup lang="ts">
	const advertisements = ref([
		'https://stickernova.fra1.cdn.digitaloceanspaces.com/regent-ava/WhatsApp%20Image%202024-04-18%20at%203.10.40%20PM.jpeg',
		'https://stickernova.fra1.cdn.digitaloceanspaces.com/regent-ava/WhatsApp%20Image%202024-04-18%20at%203.10.39%20PM.jpeg',
		'https://stickernova.fra1.cdn.digitaloceanspaces.com/regent-ava/WhatsApp%20Image%202024-04-18%20at%203.10.38%20PM%20(2).jpeg',
	]);
</script>
