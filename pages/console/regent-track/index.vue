<template>
	<form @submit.prevent="attemptLogin" class="h-[55%] w-full tablet:w-[65%] laptop:w-[50%] laptop-lg:w-[45%] desktop-4k:w-[30%] p-4">
		<div class="mb-10 flex flex-col items-center text-gray-600">
			<img src="/images/tracking-logo.jpg" alt="regent-tracking-logo" class="p-1 size-16 mb-8 ring-2 rounded-full ring-blue-300 shadow-lg shadow-blue-400"/>
			<h1 class="font-semibold text-2xl">Welcome back!</h1>
			<h2 class="whitespace-nowrap mt-1">
				<span>Don't have an account yet? </span>
				<a 
					href="mailto:support@regenttrack.co.ke?cc=support@regenttrack.co.ke &subject=Request Account Creation &body=Say something..."
					class="text-blue-600 hover:text-blue-700 transition-colors duration-150 ease-in-out">
					Contact Us
				</a>
			</h2>
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
		 <div class="flex justify-center">
			<button
				type="submit"
				:disabled="loginLoading"
				:class="['generic-form-submit w-1/2 self-end', loginLoading && 'skeleton skeleton-animated']">
				{{ loginLoading ? 'Please Wait...' : 'Login' }}
			</button>
		 </div>
		
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
