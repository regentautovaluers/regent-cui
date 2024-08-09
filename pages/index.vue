<template>
	<div class="flex h-[85%] flex-col items-start justify-center">
		<img
			src="/images/regent-autovaluers-logo.svg"
			alt="Regent Logo"
			class="h-28" />
		<form
			class="mt-24 block w-full"
			@submit.prevent="attemptLogin">
			<div class="space-y-1 text-3xl font-semibold lg:text-4xl">
				<span>Hello,</span>
				<br />
				<span>Welcome Back</span>
			</div>
			<div class="mt-4 space-y-4 py-2">
				<input
					type="text"
					class="generic-input"
					placeholder="Enter your e-mail"
					v-model="email"
					required />
				<div>
					<input
						:type="displayPassword ? 'text' : 'password'"
						class="generic-input peer"
						placeholder="Enter your password"
						v-model="password"
						required />
					<span
						v-if="loginSuccess === null"
						class="invisible text-sm font-semibold text-gray-500 peer-invalid:visible">
						Please provide your password
					</span>
					<span
						v-else-if="loginSuccess === false"
						class="text-sm font-semibold text-red-500">
						{{ loginAttemptMessage }}
					</span>
					<span
						v-else-if="loginSuccess === true"
						class="text-sm font-semibold text-green-500">
						{{ loginAttemptMessage }}
					</span>
				</div>

				<div class="flex items-center justify-end py-2">
					<input
						type="checkbox"
						class="mt-0.5 size-5 shrink-0 rounded border-gray-200 text-blue-600 disabled:pointer-events-none disabled:opacity-50"
						id="reveal-password"
						v-model="displayPassword" />
					<label
						for="reveal-password"
						class="ms-3 text-gray-500 dark:text-gray-400"
						>Reveal Password</label
					>
				</div>
				<NuxtLink
					:to="{
						name: 'forgot-password',
					}"
					class="font-semibold">
					Forgot Password
				</NuxtLink>
				<div class="flex w-full items-center justify-center">
					<button
						type="submit"
						class="form-submit relative overflow-clip"
						:disabled="loginAttemptLoading">
						<LoadingIndicator
							v-if="loginAttemptLoading"
							inject-classes="absolute w-[100%] mt-0 -top-1" />
						<span v-if="loginAttemptLoading">Processing...</span>
						<span v-else>Login</span>
					</button>
				</div>
			</div>
		</form>
	</div>
</template>

<style scoped>
	input[type='password']::-ms-reveal {
		display: none;
	}
</style>

<script setup lang="ts">
	definePageMeta({
		name: 'authentication-page',
		layout: 'auth-pages-layout',
	});

	const displayPassword: Ref<boolean> = ref(false);
	const {
		email,
		password,
		loginAttemptLoading,
		loginAttemptMessage,
		loginSuccess,
		attemptLogin,
	} = useAuth();
</script>
