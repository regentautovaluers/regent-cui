<template>
	<div>
		<img
			src="/images/regent-autovaluers-logo.svg"
			alt="Regent Logo"
			class="h-32" />
	</div>
	<form
		class="mt-12"
		@submit.prevent="attemptLogin">
		<div class="flex flex-col font-semibold space-y-1 text-3xl lg:text-5xl">
			<span class="tracking-wide">Hello,</span>
			<span class="tracking-wide">Welcome Back</span>
		</div>
		<div class="space-y-4 py-2 mt-4">
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
					class="invisible peer-invalid:visible text-sm font-semibold text-gray-500">
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

			<div class="flex justify-end py-2 items-center">
				<input
					type="checkbox"
					class="shrink-0 size-5 mt-0.5 border-gray-200 rounded text-blue-600 disabled:opacity-50 disabled:pointer-events-none"
					id="reveal-password"
					v-model="displayPassword" />
				<label
					for="reveal-password"
					class="text-gray-500 ms-3 dark:text-gray-400"
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
					v-if="!loginAttemptLoading"
					type="submit"
					class="form-submit">
					Login
				</button>
				<looping-rhombuses-spinner
					v-else
					:animation-duration="2000"
					:rhombus-size="20"
					color="#2563eb" />
			</div>
		</div>
	</form>
</template>

<style scoped>
	input[type="password"]::-ms-reveal {
		display: none;
	}
</style>

<script setup lang="ts">
	import { LoopingRhombusesSpinner } from "epic-spinners";
	definePageMeta({
		name: "authentication-page",
		layout: "auth-pages-layout",
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
