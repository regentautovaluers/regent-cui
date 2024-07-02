<template>
	<form
		class="rounded-2xl shadow px-6 py-6 border"
		@submit.prevent="updateUserAccount">
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
			<label class="font-bold text-gray-500">New Password</label>
			<div class="flex flex-grow">
				<input
					type="password"
					id="new-password"
					class="generic-input"
					placeholder="gnarly_squirell@123"
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
					v-model="companyRole" />
			</div>
		</div>
		<div class="flex flex-col mt-3">
			<label class="font-bold text-gray-500">Account Status</label>
			<div class="flex flex-grow">
				<select
					class="generic-input"
					id="account-status"
					required
					v-model="isAccountEnabled">
					<option :value="false">Not Active</option>
					<option :value="true">Active</option>
				</select>
			</div>
		</div>
		<div class="flex flex-col mt-3">
			<label class="font-bold text-gray-500">User Privilege</label>
			<div class="flex flex-grow space-x-4">
				<label
					class="flex items-center py-3 px-4 w-1/2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500">
					<span class="text-gray-500">Is A Normal User</span>
					<input
						type="radio"
						value="role_corp_norm"
						class="radio-buttons"
						id="normal"
						checked
						v-model="userRole" />
				</label>
				<label
					class="flex items-center py-3 px-4 w-1/2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500">
					<span class="text-gray-500">Is An Admin</span>
					<input
						type="radio"
						value="role_corp_admin"
						class="radio-buttons"
						id="admin"
						v-model="userRole" />
				</label>
			</div>
		</div>
		<div class="flex mt-3 items-center justify-center">
			<button
				v-if="!formSubmissionLoading"
				type="submit"
				class="form-submit">
				Update Account Details
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
	const route = useRoute();
	const formSubmissionLoading = ref(false);
	const firstName: Ref<string> = ref("");
	const otherName: Ref<string> = ref("");
	const email: Ref<string> = ref("");
	const phoneNumber: Ref<string> = ref("");
	const password: Ref<string> = ref("");
	const companyRole: Ref<string> = ref("");
	const userRole: Ref<string> = ref("");
	const { openToast } = useToast();
	const isAccountEnabled: Ref<boolean> = ref(true);

	useFetch("/api/v1/auth/corp-account/get-account", {
		key: "userDetails",
		baseURL: runtimeConfig.public.VALUATION_BASE_URL,
		method: "GET",
		headers: {
			Accept: "application/json",
		},
		query: {
			userId: route.query.userId,
		},
		server: false,
		lazy: false,
		onResponse({ response }) {
			if (response.status === 200) {
				const responseData = response._data.data;
				firstName.value = responseData.username.split(" ")[0];
				otherName.value = responseData.username.split(" ")[1];
				email.value = responseData.email;
				phoneNumber.value = responseData.phoneNumber;
				password.value = responseData.password;
				companyRole.value = responseData.roleInOrganization;
				userRole.value = responseData.userRoles[0].toLowerCase();
				isAccountEnabled.value = responseData.accountEnabled;
			} else {
				openToast(
					"Failed to retrieve account details. Try again!",
					"danger"
				);
			}
		},
	});

	watch(phoneNumber, (newNumber) => {
		if (newNumber.startsWith("0") || newNumber.startsWith("+254")) {
			phoneNumber.value = newNumber.replace(/^(\+254|0)/, "254");
		}
	});

	const computedPassword: ComputedRef = computed(() => {
		if (password.value && password.value.length > 0) {
			return password;
		}

		return null;
	});

	async function updateUserAccount(): Promise<void> {
		formSubmissionLoading.value = true;
		try {
			await $fetch("/api/v1/auth/corp-account/update-account-details", {
				baseURL: runtimeConfig.public.VALUATION_BASE_URL,
				method: "PUT",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: route.query.userId,
					firstName: firstName.value,
					lastName: otherName.value,
					email: email.value,
					phoneNumber: phoneNumber.value,
					newPassword: computedPassword.value,
					roleInOrganization: companyRole.value,
					isAccountEnabled: isAccountEnabled.value,
					userRoles: [userRole.value],
				}),
				onResponse({ response }) {
					if (response.status === 200) {
						openToast("Account updated successfully!", "success");
					} else {
						throw new Error("Account updating failed. Try again!");
					}
				},
			});
		} catch (error) {
			console.log("An error occured: ", error);
			openToast("Account updating failed. Try again!", "danger");
		} finally {
			formSubmissionLoading.value = false;
		}
	}
</script>
