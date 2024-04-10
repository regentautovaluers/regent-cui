<template>
	<main class="flex h-screen">
		<div class="w-[60%] min-w-[60%] h-full hidden lg:flex">
			<img
				src="/images/auth-img-parking-lot.webp"
				alt="Auth Pages Image"
				class="rounded-md object-cover w-full h-full" />
		</div>
		<div class="flex-grow px-2 mt-10 lg:my-28 md:px-28">
			<slot />
		</div>
	</main>
</template>

<script setup lang="ts"></script>
