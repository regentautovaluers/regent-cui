<template>
	<form
		class="rounded-2xl shadow px-6 py-6 border"
		@submit.prevent="updateMyAccount">
		<h1 class="font-semibold text-lg my-b">My Account</h1>
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
					v-model="password" />
			</div>
		</div>
		<div class="flex flex-col mt-3">
			<label
				for="user-branch"
				class="font-bold text-gray-500"
				>Your Branch</label
			>
			<select
				class="generic-input"
				id="user-branch"
				required
				v-model="companyBranch"
				disabled>
				<option value="">Select The User's Branch</option>
				<option
					v-for="(branch, index) in availableBranches"
					:key="index"
					:value="branch.branchId">
					{{ branch.branchName + "-" + branch.branchLocation }}
				</option>
			</select>
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
		<div class="mt-3">
			<button
				type="submit"
				class="form-submit md:w-1/3 relative overflow-clip">
				<LoadingIndicator
					v-if="formSubmissionLoading"
					inject-classes="absolute w-[100%] mt-0 -top-1" />
				<span v-if="formSubmissionLoading">Processing...</span>
				<span v-else>Update Account</span>
			</button>
		</div>
	</form>
</template>

<script setup lang="ts">
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
	const companyBranch: Ref<string> = ref(getPrincipal.value.branchId);
	const { openToast } = useToast();
	const availableBranches: Ref<any[]> = ref([]);

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

	const updateMyAccount = async (): Promise<void> => {
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
					userId: getPrincipal.value.userId,
					firstName: firstName.value,
					lastName: otherName.value,
					email: email.value,
					phoneNumber: phoneNumber.value,
					newPassword: computedPassword.value,
					roleInOrganization: companyRole.value,
					branchId: companyBranch.value,
					isAccountEnabled: true,
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
	};

	await useFetch("/api/v1/auth/corp-branch/get-all", {
		baseURL: runtimeConfig.public.VALUATION_BASE_URL,
		method: "GET",
		headers: {
			Accept: "application/json",
		},
		server: false,
		lazy: true,
		query: {
			corpId: getPrincipal.value.corpId,
		},
		onResponse({ response }) {
			if (response.status === 200) {
				availableBranches.value = response._data.data;
			}
		},

		onRequestError() {
			openToast("Failed to retrieve branches. Try again!", "danger");
		},
	});
</script>
