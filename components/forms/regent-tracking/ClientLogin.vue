<template>
	<form
		@submit.prevent="attemptLogin"
		class="flex size-full flex-col items-center justify-center space-y-4 p-5">
		<input
			type="text"
			class="generic-input"
			placeholder="Enter your email"
			v-model.trim="email"
			required />
		<input
			type="password"
			class="generic-input"
			placeholder="Enter your password"
			required
			v-model.trim="password" />

		<!-- submit button -->
		<button
			type="submit"
			:class="['generic-form-submit', loginLoading && 'skeleton skeleton-animated']">
			{{ loginLoading ? 'Please Wait...' : 'Login' }}
		</button>
	</form>
</template>

<script setup lang="ts">
	const { email, password, loginLoading, attemptLogin } = useRegentTrackingAuth();
</script>
