<template>
	<form @submit.prevent="attemptLogin">
		<div class="laptop:text-4xl desktop:4k:text-5xl mb-16 text-3xl">
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
			:class="['generic-form-submit', loginLoading && 'skeleton skeleton-animated']">
			{{ loginLoading ? 'Please Wait...' : 'Login' }}
		</button>
	</form>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'regent-track-auth',
		layout: 'interior-auth-layout',
	});

	const revealPassword: Ref<boolean> = ref(false);
	const { email, password, loginLoading, attemptLogin } = useRegentTrackingAuth();
</script>

<style scoped>
	input[type='password']::-ms-reveal {
		display: none;
	}
</style>
