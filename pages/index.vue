<template>
	<div>
		<img
			src="/images/regent-autovaluers-logo.svg"
			alt="Regent Logo"
			class="h-36" />
	</div>
	<form
		class="mt-12"
		@submit.prevent="handleLoginFormSubmission">
		<div class="flex flex-col font-semibold space-y-1 text-3xl lg:text-5xl">
			<span class="tracking-wide">Hello,</span>
			<span class="tracking-wide">Welcome Back</span>
		</div>
		<div class="space-y-4 py-2 mt-4">
			<input
				type="text"
				class="py-5 px-3 block w-full border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
				placeholder="Enter your e-mail / username"
				v-model="username"
				required />
			<div>
				<input
					:type="displayPassword ? 'text' : 'password'"
					class="py-5 px-3 block w-full border-gray-200 valid:border-gray-200 invalid:border-red-500 peer rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="Enter your password"
					v-model="password"
					required />
				<p class="invisible peer-invalid:visible text-sm text-red-500">
					Please provide your password
				</p>
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
			<div class="flex justify-between py-2 items-center">
				<div class="flex items-center">
					<input
						type="checkbox"
						class="shrink-0 size-6 mt-0.5 border-gray-200 rounded text-blue-600 disabled:opacity-50 disabled:pointer-events-none"
						id="remember-me"
						v-model="rememberSession" />
					<label
						for="remember-me"
						class="text-lg text-gray-500 ms-3 dark:text-gray-400"
						>Remember Me</label
					>
				</div>
				<NuxtLink
					:to="{
						name: 'forgot-password',
					}"
					class="font-semibold">
					Forgot Password
				</NuxtLink>
			</div>
			<button
				type="submit"
				class="py-3 px-4 w-full mt-2 items-center gap-x-2 font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
				<span v-if="!formSubmissionLoading">Login</span>
				<div
					v-if="formSubmissionLoading"
					class="animate-spin inline-block size-5 border-[3px] border-white border-current border-t-transparent text-gray-800 rounded-full"
					role="status"
					aria-label="loading" />
			</button>
		</div>
	</form>
</template>

<style scoped>
	input[type="password"]::-ms-reveal {
		display: none;
	}
</style>

<script setup lang="ts">
	definePageMeta({
		name: "authentication-page",
		layout: "auth-pages-layout",
	});

	const router = useRouter();
	const formSubmissionLoading: Ref<boolean> = ref(false);
	const displayPassword: Ref<boolean> = ref(false);
	const username: Ref<string> = ref("");
	const password: Ref<string> = ref("");
	const rememberSession: Ref<boolean> = ref(false);
	const { setDetails } = usePrincipal();
	const { openToast } = useToast();
	const { handleSessionTokensSetup } = useSessionContext();

	async function handleLoginFormSubmission(): Promise<void> {
		formSubmissionLoading.value = true;
		try {
			await $fetch("/api/corp-login", {
				method: "POST",
				query: {
					uname: username.value,
					pwd: password.value,
				},
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				async onResponse({ response }) {
					if (response.status === 200) {
						const responseData: Object[] = JSON.parse(
							response._data
						);

						if (responseData.length === 0) {
							throw new Error("Invalid login credentials");
						}
						const principalDetails = responseData[0];

						// supply the session context with session-related tokens to store
						handleSessionTokensSetup(rememberSession.value);

						// store the prinicpal
						await setDetails(principalDetails);

						// login the user
						router.push({
							name: "dashboard-home",
						});

						openToast("Login successfull", "success");
					}
				},
			});
		} catch (error) {
			console.log("An error occured: ", error);
			openToast("Login failed. Please try again!", "danger");
		} finally {
			formSubmissionLoading.value = false;
		}
	}
</script>
