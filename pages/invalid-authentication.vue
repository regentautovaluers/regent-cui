<template>
	<div class="mb-4 text-3xl md:text-4xl lg:text-5xl">
		<h1 class="font-bold">{{ $t('authentication_failed') }}</h1>
	</div>
	<div
		id="alert-additional-content-4"
		class="mb-4 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800"
		role="alert">
		<div class="flex items-center">
			<svg
				class="me-2 h-4 w-4 flex-shrink-0"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="currentColor"
				viewBox="0 0 20 20">
				<path
					d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
			</svg>
			<span class="sr-only">Info</span>
			<h3 class="text-lg font-medium">Security Notice</h3>
		</div>
		<div class="mb-4 mt-2">
			<p>
				The link provided has been determined to be invalid. Kindly attempt
				re-authentication by using the link below to navigate to the login page.
			</p>
		</div>
	</div>

	<!-- link to login screen -->
	<NuxtLink
		:to="{ name: 'exterior-home' }"
		class="generic-quick-link text-sm md:text-base">
		{{ $t('go_home') }}
	</NuxtLink>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'exterior-invalid-authentication',
		layout: 'exterior-layout',
	});
</script>
