<template>
	<form
		class="rounded-lg shadow-lg px-6 pb-6"
		@submit.prevent="updateUserAccountDetails">
		<h1 class="font-semibold text-lg">Update Corporate User Details</h1>
		<!-- <div class="flex items-center w-full">
			<label class="w-1/6">Full Name</label>
			<div class="flex flex-grow space-x-4">
				<input
					type="text"
					id="first-name"
					class="py-3 px-4 h-[3.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					:class="
						fetchDetailsLoading
							? 'animate-pulse disabled:bg-gray-200'
							: null
					"
					:disabled="fetchDetailsLoading"
					placeholder="e.g John"
					required
					v-model="userName" />
			</div>
		</div> -->
		<div class="flex items-center mt-6">
			<label class="w-1/6">New Password</label>
			<div class="flex flex-grow">
				<input
					type="password"
					id="new-password"
					class="py-3 px-4 h-[3.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="e.g gnarly_squirell@123"
					v-model="password" />
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
			class="py-3 px-4 mt-7 lg:w-1/3 text-lg h-16 items-center gap-x-2 font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
			:disabled="fetchDetailsLoading"
			:class="
				fetchDetailsLoading
					? 'animate-pulse disabled:bg-gray-200'
					: null
			">
			<span v-if="!formSubmissionLoading">Update Account Details</span>
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
	// const userName: Ref<string> = ref("");
	const password: Ref<string> = ref("");
	const userPrivilege: Ref<string> = ref("");
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const { openToast } = useToast();
	const route = useRoute();
	const corpUID: Ref<string> = ref(route.query.corpuid as string);
	const fetchDetailsLoading: Ref<boolean> = ref(false);

	async function updateUserAccountDetails(): Promise<void> {
		formSubmissionLoading.value = true;
		try {
			await $fetch("/ava/api/corp-users/update", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				query: {
					corp: getPrincipal.value.corpId,
					password: password.value,
					access_level: userPrivilege.value,
					added_by: getPrincipal.value.username,
					created_by: "ava",
					corp_user_id: corpUID,
					uname: runtimeConfig.app.VALUATION_BASE_UNAME,
					pwd: runtimeConfig.app.VALUATION_BASE_PASS,
				},
				async onResponse({ response }) {
					if (response.status !== 200) {
						throw new Error("Failed to update account details!");
					}

					console.log("Response data", response._data);
					openToast(
						"Successfully updated account details. Reloading",
						"success"
					);

					// reload page to clear form
					location.reload();
				},
			});
		} catch (error) {
			console.log("An error occured: ", error);
			openToast("Updating accoutn details failed. Try again!", "danger");
		} finally {
			formSubmissionLoading.value = false;
		}
	}

	onMounted(async () => {
		fetchDetailsLoading.value = true;
		try {
			await $fetch("/ava/api/corp-users/details", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				query: {
					corp: getPrincipal.value.corpId,
					corp_user_id: route.query.corpuid,
					uname: runtimeConfig.app.VALUATION_BASE_UNAME,
					pwd: runtimeConfig.app.VALUATION_BASE_PASS,
				},
				async onResponse({ response }) {
					if (response.status !== 200) {
						throw new Error("Failed to get user details!");
					}

					const userData: any[] = JSON.parse(response._data);
					// userName.value = userData[0].name_of_user;
					userPrivilege.value = userData[0].userlevel;

					openToast(
						"Successfully retrieved account details",
						"success"
					);
				},
			});
		} catch (error) {
			console.log("An error occured: ", error);
			openToast("Failed to get user details. Reload Page!", "danger");
		} finally {
			fetchDetailsLoading.value = false;
		}
	});
</script>
