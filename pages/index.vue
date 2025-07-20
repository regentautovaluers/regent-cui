<template>
	<form @submit.prevent="attemptLogin">
		<div class="mb-16 text-3xl md:text-4xl lg:text-5xl">
			<h1 class="font-bold">Hello,</h1>
			<h2 class="font-bold whitespace-nowrap">Welcome Back</h2>
		</div>
		<div class="space-y-4">
			<input
				type="text"
				class="generic-input"
				placeholder="Enter your email"
				v-model.trim="email"
				required />
			<input
				:type="revealPassword ? 'text' : 'password'"
				class="generic-input"
				placeholder="Enter your password"
				required
				v-model.trim="password" />
		</div>
		<div class="my-4 flex items-center justify-between py-2">
			<div class="flex items-center space-x-2">
				<input
					checked
					id="remember-me"
					type="checkbox"
					class="size-6 rounded-lg border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
					v-model="revealPassword" />
				<label
					for="remember-me"
					class="generic-input-label text-sm"
					>Show Password</label
				>
			</div>
		</div>

		<!-- submit button -->
		<button
			type="submit"
			:class="['generic-form-submit', loginAttemptLoading && 'skeleton skeleton-animated']">
			{{ loginAttemptLoading ? 'Please Wait...' : 'Login' }}
		</button>
	</form>

	<!-- link to forgot password -->
	<!-- <NuxtLink
		:to="{ name: 'exterior-forgot-password' }"
		class="generic-quick-link text-sm">
		Forgot Password
	</NuxtLink> -->
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'exterior-home',
		layout: 'exterior-layout',
	});

	const revealPassword: Ref<boolean> = ref(false);
	const { email, password, loginAttemptLoading, attemptLogin } = useAuth();
</script>

<style scoped>
	input[type='password']::-ms-reveal {
		display: none;
	}
</style>
