<template>
	<form
		class="rounded-2xl shadow px-6 py-6 border"
		@submit.prevent="updateMyAccount">
		<h1 class="font-semibold text-lg my-b">Update User</h1>
		<div class="flex flex-col">
			<label class="font-bold text-gray-500">Full Name</label>
			<div class="flex w-full space-x-4">
				<input
					type="text"
					id="first-name"
					class="generic-input"
					placeholder="John"
					required
					v-model="firstName" />
				<input
					type="text"
					id="other-name"
					class="generic-input"
					placeholder="Doe"
					required
					v-model="otherName" />
			</div>
		</div>
		<div class="flex flex-col mt-3">
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
		<div class="flex flex-col mt-3">
			<label class="font-bold text-gray-500">Phone Number</label>
			<div class="flex flex-grow">
				<input
					type="text"
					id="phone"
					class="generic-input"
					placeholder="254712345678"
					required
					v-model="phoneNumber" />
			</div>
		</div>
		<div class="flex flex-col mt-3">
			<label class="font-bold text-gray-500">Password</label>
			<div class="flex flex-grow">
				<input
					type="password"
					id="new-password"
					class="generic-input"
					placeholder="gnarly_squirell@123"
					required
					v-model="password" />
			</div>
		</div>
		<div class="flex flex-col mt-3">
			<label class="font-bold text-gray-500">Role In Company</label>
			<div class="flex flex-grow">
				<input
					type="text"
					id="role"
					class="generic-input"
					placeholder="Underwriter"
					required
					disabled
					v-model="companyRole" />
			</div>
		</div>
		<div class="flex w-full mt-2 lg:w-1/3 items-center justify-center">
			<button
				v-if="!formSubmissionLoading"
				type="submit"
				class="form-submit">
				Update My Account
			</button>
			<looping-rhombuses-spinner
				v-else
				:animation-duration="2000"
				:rhombus-size="20"
				color="#2563eb" />
		</div>
	</form>
</template>

<script setup lang="ts">
	import { LoopingRhombusesSpinner } from "epic-spinners";

	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const formSubmissionLoading = ref(false);
	const firstName: Ref<string> = ref(
		getPrincipal.value.username.split(" ")[0]
	);
	const otherName: Ref<string> = ref(
		getPrincipal.value.username.split(" ")[1]
	);
	const email: Ref<string> = ref(getPrincipal.value.email);
	const phoneNumber: Ref<string> = ref(getPrincipal.value.phonenumber);
	const password: Ref<string> = ref("");
	const companyRole: Ref<string> = ref(getPrincipal.value.roleInOrganization);
	const { openToast } = useToast();

	watch(phoneNumber, (newNumber) => {
		if (newNumber.startsWith("0") || newNumber.startsWith("+254")) {
			phoneNumber.value = newNumber.replace(/^(\+254|0)/, "254");
		}
	});

	const computedPassword: ComputedRef = computed(() => {
		if (password.value.length > 0) {
			return password;
		}

		return null;
	});

	async function updateMyAccount(): Promise<void> {
		formSubmissionLoading.value = true;
		try {
			await $fetch("/api/v1/auth/corp-account/update-account-details", {
				baseURL: runtimeConfig.public.VALUATION_BASE_URL,
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: getPrincipal.value.userId,
					firstName: firstName.value,
					lastName: otherName.value,
					email: email.value,
					phoneNumber: phoneNumber.value,
					newPassword: computedPassword.value,
					roleInOrganization: companyRole.value,
					isAccountEnabled: true,
				}),
				onResponse({ response }) {
					console.info("Response data: ", response._data);
					console.info("Response status: ", response.status);
				},
			});
		} catch (error) {
			console.log("An error occured: ", error);
			openToast("Account creation failed. Try again!", "danger");
		} finally {
			formSubmissionLoading.value = false;
		}
	}
</script>
