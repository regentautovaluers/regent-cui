<template>
	<form @submit.prevent="updatePassword">
		<div class="laptop:text-4xl desktop:4k:text-5xl mb-8 text-3xl">
			<h1 class="font-bold">Password Setup</h1>
		</div>
		<div class="space-y-4">
			<input
				:type="revealPassword ? 'text' : 'password'"
				class="generic-input"
				placeholder="Enter new password"
				v-model.trim="newPassword1"
				required />
			<!-- password checkers -->
			<ul class="space-y-2">
				<li
					class="flex items-center"
					v-for="(e, idx) in checksToPass"
					:key="idx">
					<span
						:class="[
							'icon-[material-symbols-light--check-circle] size-5',
							passesValidationRules[idx] ? 'text-blue-700' : 'text-gray-700',
						]"></span>
					<p class="ml-2 text-sm text-gray-700">
						{{ e }}
					</p>
				</li>
			</ul>
			<div class="h-fit">
				<input
					:type="revealPassword ? 'text' : 'password'"
					:disabled="disableNewPassword2"
					class="generic-input"
					placeholder="Repeat password"
					required
					v-model.trim="newPassword2" />
				<p
					v-show="newPassword2.length > 0 && newPassword1 != newPassword2"
					class="mt-1 text-sm text-yellow-700">
					Passwords don't match.
				</p>
			</div>
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
			:disabled="disableNewPassword2 || newPassword1 != newPassword2"
			:class="[
				'generic-form-submit',
				passwordChangeAttemptLoading && 'skeleton skeleton-animated',
			]">
			{{ passwordChangeAttemptLoading ? 'Please Wait...' : 'Save Password' }}
		</button>
	</form>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'password-setup',
		layout: 'exterior-layout',
	});

	const revealPassword: Ref<boolean> = ref(false);
	const {
		newPassword1,
		newPassword2,
		passwordChangeAttemptLoading,
		passesValidationRules,
		checksToPass,
		updatePassword,
		disableNewPassword2,
	} = usePasswordManagement();
</script>

<style scoped>
	input[type='password']::-ms-reveal {
		display: none;
	}
</style>
