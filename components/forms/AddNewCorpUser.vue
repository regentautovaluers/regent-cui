<template>
	<form
		class="rounded-lg shadow-lg px-6 pb-6"
		@submit.prevent="createUserAccount">
		<h1 class="font-semibold text-lg">Add A New User</h1>
		<div class="flex items-center w-full">
			<label class="w-1/6">Full Name</label>
			<div class="flex flex-grow space-x-4">
				<input
					type="text"
					id="first-name"
					class="py-3 px-4 h-[3.5rem] block w-1/2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="e.g John"
					required
					v-model="firstName" />
				<input
					type="text"
					id="other-name"
					class="py-3 px-4 h-[3.5rem] block w-1/2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="e.g Doe"
					required
					v-model="otherName" />
			</div>
		</div>
		<div class="flex items-center w-full mt-6">
			<label class="w-1/6">Email</label>
			<div class="flex flex-grow">
				<input
					type="email"
					id="email"
					class="py-3 px-4 h-[3.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="e.g johndoe@corporate.email.com"
					required
					v-model="email" />
			</div>
		</div>
		<div class="flex items-center w-full mt-6">
			<label class="w-1/6">Phone</label>
			<div class="flex flex-grow">
				<input
					type="text"
					id="phone"
					class="py-3 px-4 h-[3.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="e.g 0712345678"
					required
					v-model="phoneNumber" />
			</div>
		</div>
		<div class="flex items-center mt-6">
			<label class="w-1/6">Password</label>
			<div class="flex flex-grow">
				<input
					type="password"
					id="new-password"
					class="py-3 px-4 h-[3.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="e.g gnarly_squirell@123"
					required
					v-model="password" />
			</div>
		</div>
		<div class="flex items-center mt-6">
			<label class="w-1/6">Role In Company</label>
			<div class="flex flex-grow">
				<input
					type="text"
					id="role"
					class="py-3 px-4 h-[3.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="e.g Underwriter"
					required
					v-model="companyRole" />
			</div>
		</div>
		<div class="flex items-center mt-6">
			<label class="w-1/6">User Privilege</label>
			<div class="flex flex-grow space-x-4">
				<label
					class="flex p-3 w-1/2 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
					v-for="(item, index) in availableRoles"
					:key="index"
					:for="item.id">
					<span class="text-sm text-gray-500 dark:text-gray-400">{{
						item.text
					}}</span>
					<input
						type="radio"
						:value="item.role"
						class="shrink-0 ms-auto mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500"
						:id="item.id"
						v-model="userPrivilege" />
				</label>
			</div>
		</div>
		<button
			type="submit"
			class="py-3 px-4 mt-7 lg:w-1/3 text-lg h-16 items-center gap-x-2 font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
			<span v-if="!formSubmissionLoading">Add User Account</span>
			<div
				v-if="formSubmissionLoading"
				class="animate-spin inline-block size-5 border-[3px] border-white border-current border-t-transparent text-gray-800 rounded-full"
				role="status"
				aria-label="loading" />
		</button>
	</form>
</template>

<script setup lang="ts">
	import availableRoles from "~/types/roles";
	const formSubmissionLoading = ref(false);
	const firstName: Ref<string> = ref("");
	const otherName: Ref<string> = ref("");
	const email: Ref<string> = ref("");
	const phoneNumber: Ref<string> = ref("");
	const password: Ref<string> = ref("");
	const companyRole: Ref<string> = ref("");
	const companyBranch: Ref<string> = ref("");
	const userPrivilege: Ref<string> = ref("");
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const { openToast } = useToast();
	const userName: ComputedRef<string> = computed(
		() => `${firstName.value} ${otherName.value}`
	);

	async function createUserAccount(): Promise<void> {
		formSubmissionLoading.value = true;
		try {
			await $fetch("/ava/api/corp-users/add", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				query: {
					corp: getPrincipal.value.corpId,
					name: userName.value,
					email: email.value,
					password: password.value,
					access_level: userPrivilege.value,
					phone: phoneNumber.value,
					branch: companyBranch.value,
					role: companyRole.value,
					added_by: getPrincipal.value.username,
					created_by: "ava",
					uname: runtimeConfig.app.VALUATION_BASE_UNAME,
					pwd: runtimeConfig.app.VALUATION_BASE_PASS,
				},
				async onResponse({ response }) {
					if (response.status !== 200) {
						throw new Error("Failed to create user account!");
					}

					openToast(
						"Successfully created user account. Reloading",
						"success"
					);

					// reload page to clear form
					location.reload();
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
