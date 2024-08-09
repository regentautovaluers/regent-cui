<template>
	<main class="flex h-screen w-screen flex-col items-center justify-center">
		<img
			src="/icons/misc/page-not-found.svg"
			alt="Not Found Icon"
			class="size-96" />

		<h1 class="mt-2 text-3xl font-bold">Page Not Found.</h1>
		<NuxtLink
			:to="{ name: 'authentication-page' }"
			class="mt-2 text-blue-500 underline underline-offset-2"
			>Take Me Home</NuxtLink
		>
	</main>
</template>
