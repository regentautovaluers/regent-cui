<template>
	<div
		id="default-carousel"
		class="relative my-6 w-full rounded-lg border"
		data-carousel="slide">
		<!-- Carousel wrapper -->
		<div class="relative h-56 overflow-hidden rounded-lg md:h-96">
			<!-- Item 1 -->
			<div
				class="hidden duration-700 ease-in-out"
				data-carousel-item>
				<img
					src="https://images.unsplash.com/photo-1723149500877-69d4a956ea97?q=80&w=1926&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
					class="size-full object-cover"
					alt="..." />
			</div>
			<!-- Item 2 -->
			<div
				class="hidden duration-700 ease-in-out"
				data-carousel-item>
				<img
					src="https://plus.unsplash.com/premium_photo-1671411322574-e6dd4eea0183?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D"
					class="size-full object-cover"
					alt="..." />
			</div>
			<!-- Item 3 -->
			<div
				class="hidden duration-700 ease-in-out"
				data-carousel-item>
				<img
					src="https://plus.unsplash.com/premium_photo-1723649902695-f499154adddb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMnx8fGVufDB8fHx8fA%3D%3D"
					class="size-full object-cover"
					alt="..." />
			</div>
		</div>
		<!-- Slider indicators -->
		<div
			class="absolute left-1/2 top-3 z-30 flex -translate-x-1/2 space-x-3 rtl:space-x-reverse">
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
	</div>
</template>

<script setup lang="ts"></script>
