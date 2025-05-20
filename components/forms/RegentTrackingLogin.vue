<template>
	<form @submit.prevent="attemptLogin">
		<div class="mt-3 flex flex-col">
			<label class="font-bold text-gray-500">Email</label>
			<div class="flex flex-grow">
				<input
					type="email"
					id="email"
					class="generic-input"
					placeholder="johndoe@corpemail.com"
					required
					v-model="email" />
			</div>
		</div>
		<div class="mt-3 flex flex-col">
			<label class="font-bold text-gray-500">Phone Number</label>
			<div class="flex flex-grow">
				<input
					type="password"
					id="password"
					class="generic-input"
					placeholder="e.g. gnurly-squirel"
					required
					v-model="password" />
			</div>
		</div>
		<!-- submit button -->
		<button
			type="submit"
			class="generic-form-submit mt-3">
			<FormSubmissionLoader
				classes="mr-2 size-6 animate-spin text-white"
				v-if="loginAttemptLoading" />
			{{ loginAttemptLoading ? 'Processing' : 'Login' }}
		</button>
	</form>
</template>

<script setup lang="ts">
	const { email, password, loginAttemptLoading, attemptLogin } = useRegentTracking();
</script>
