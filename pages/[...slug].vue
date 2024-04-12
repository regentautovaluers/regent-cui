<template>
	<main class="w-screen h-screen flex flex-col justify-center items-center">
		<img
			src="/icons/misc/page-not-found.svg"
			alt="Not Found Icon"
			class="size-64" />

		<h1 class="text-3xl font-bold mt-2">Page Not Found.</h1>
		<NuxtLink
			:to="{ name: 'authentication-page' }"
			class="text-blue-500 underline underline-offset-2 mt-2"
			>Take Me Home</NuxtLink
		>
	</main>
</template>
