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
			:class="['generic-form-submit', loginAttemptLoading && 'skeleton skeleton-animated']">
			{{ loginAttemptLoading ? 'Please Wait...' : 'Login' }}
		</button>

		<!-- option for bypassing login  -->
		<template v-if="getPrincipal()">
			<div class="inline-flex w-full items-center justify-center">
				<hr class="my-8 h-0.5 w-full rounded-sm border-0 bg-gray-200" />
				<div class="absolute bg-white px-4 text-gray-500">
					<span class="text-sm">Or Continue As</span>
				</div>
			</div>

			<div class="flex flex-col items-center justify-center space-y-2">
				<NuxtLink
					:to="{ name: 'mobivaluer-home' }"
					class="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-blue-700 ring-4 ring-gray-300 transition-colors duration-200 ease-in-out hover:ring-blue-500">
					<svg
						class="-left-1 h-10 w-10 text-white"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg">
						<path
							fill-rule="evenodd"
							d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
							clip-rule="evenodd"></path>
					</svg>
				</NuxtLink>
				<span class="text-sm font-semibold text-gray-500">{{
					getPrincipal()?.username
				}}</span>
			</div>
		</template>
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
	const { email, password, loginAttemptLoading, attemptLogin, getPrincipal } = useAuth();
</script>

<style scoped>
	input[type='password']::-ms-reveal {
		display: none;
	}
</style>
