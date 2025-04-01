<template>
	<form @submit.prevent="">
		<div class="mb-4 text-3xl md:text-4xl lg:text-5xl">
			<h1 class="font-bold">Password Reset</h1>
		</div>
		<div
			id="alert-additional-content-4"
			class="mb-4 rounded-lg border border-green-300 bg-green-50 p-4 text-green-800"
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
					Success! Kindly reset your password by inputing a new one and confirming it.
					Afterwards, we will redirect you to the login page where you can login using
					your new password!
				</p>
			</div>
		</div>
		<div class="space-y-4">
			<input
				:type="revealPassword ? 'text' : 'password'"
				class="generic-input"
				placeholder="Enter new password"
				required />
			<input
				:type="revealPassword ? 'text' : 'password'"
				class="generic-input"
				placeholder="Confirm password"
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
					>Show Password</label
				>
			</div>
		</div>
		<!-- submit button -->
		<button
			type="submit"
			class="generic-form-submit mt-3">
			<FormSubmissionLoader
				classes="mr-2 size-6 animate-spin text-white"
				v-if="false" />
			{{ false ? 'Processing' : 'Proceed' }}
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
		name: 'exterior-password-reset',
		layout: 'exterior-layout',
	});

	const revealPassword: Ref<boolean> = ref(false);
</script>
