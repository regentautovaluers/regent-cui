<template>
	<form @submit.prevent="">
		<div class="mb-4 text-3xl md:text-4xl lg:text-5xl">
			<h1 class="font-bold">Two Factor Authentication</h1>
		</div>
		<div
			id="alert-additional-content-4"
			class="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800"
			role="alert">
			<div class="flex items-center">
				<svg
					class="me-2 h-4 w-4 shrink-0"
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
			<div class="mt-2 mb-4">
				<p>
					Kindly provide the code that has been emailed to you. You may also choose to
					bypass this step for the next 15 days. This choice is invalidated by browser
					change or cookie clearance.
				</p>
			</div>
		</div>
		<div class="space-y-4">
			<input
				type="text"
				class="generic-input"
				placeholder="Enter code"
				required />
		</div>

		<div class="my-4 flex items-center justify-between py-2">
			<div class="flex items-center space-x-2">
				<input
					checked
					id="remember-me"
					type="checkbox"
					class="size-7 rounded-lg border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
					v-model="revealPassword" />
				<label
					for="remember-me"
					class="generic-input-label text-sm md:text-base"
					>Remember Me for 15 Days</label
				>
			</div>
		</div>
		<!-- submit button -->
		<button
			type="submit"
			:class="['generic-form-submit mt-3', false && 'skeleton skeleton-animated']">
			{{ false ? 'Please Wait...' : 'Proceed' }}
		</button>
	</form>

	<!-- link to login screen -->
	<NuxtLink
		:to="{ name: 'exterior-home' }"
		class="generic-quick-link text-sm md:text-base">
		Go Home
	</NuxtLink>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'exterior-2fa-authentication',
		layout: 'exterior-layout',
	});

	const revealPassword: Ref<boolean> = ref(false);
</script>
