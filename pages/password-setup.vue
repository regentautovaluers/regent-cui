<template>
	<form @submit.prevent="updatePassword">
		<div class="laptop:text-4xl desktop:4k:text-5xl mb-8 text-3xl">
			<h1 class="font-bold">Password Setup</h1>
		</div>

		<div
			class="mb-2 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800"
			role="alert">
			<div class="flex items-center">
				<svg
					class="me-2 h-4 w-4 shrink-0"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 20 20">
					<path
						d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
				</svg>
				<span class="sr-only">Info</span>
				<h3 class="text-sm font-semibold">Password Update Required</h3>
			</div>

			<p class="my-1 text-sm">
				You need to change your password before you can proceed. Kindly setup a string
				password. You may periodically be required to do this.
			</p>
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

		<div class="flex flex-col tablet:flex-row space-y-3 tablet:space-y-0 tablet:space-x-3 tablet:items-center">
			<button
				type="submit"
				:disabled="disableNewPassword2 || newPassword1 != newPassword2"
				:class="[
					'generic-form-submit',
					passwordChangeAttemptLoading && 'skeleton skeleton-animated',
				]">
				{{ passwordChangeAttemptLoading ? 'Please Wait...' : 'Save Password' }}
			</button>
			<NuxtLink
				:to="{ name: 'mobivaluer-home' }"
				:class="[
					'generic-form-submit bg-yellow-600 hover:bg-yellow-700',
				]">
				<span>Skip For Now</span>
				<span class="icon-[material-symbols-light--warning-rounded] size-6"></span>
			</NuxtLink>
		</div>

		<!-- submit button -->
		
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
