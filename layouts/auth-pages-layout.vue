<template>
	<main class="flex">
		<div class="w-[60%] h-screen hidden md:flex">
			<img
				src="/images/auth-img-parking-lot.webp"
				alt="Auth Pages Image"
				class="rounded-md object-cover w-full h-full" />
		</div>
		<div class="flex-grow my-28 px-4 md:px-28">
			<slot />
		</div>
	</main>
</template>

<script setup lang="ts"></script>
