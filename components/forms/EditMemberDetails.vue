<template>
	<form @submit.prevent="updateMemberDetails">
		<div
			class="flex flex-col lg:flex-row items-center justify-between space-y-3 lg:space-y-0 space-x-0 lg:space-x-3">
			<!-- Phone Field -->
			<div class="w-full lg:w-1/2">
				<label
					for="phone"
					class="block font-medium mb-2 dark:text-white"
					>Phone</label
				>
				<input
					type="text"
					id="phone"
					class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="+254704080056"
					v-model="clientPhone" />
			</div>

			<!-- Email field -->
			<div class="w-full lg:w-1/2">
				<label
					for="email"
					class="block font-medium mb-2 dark:text-white"
					>Email</label
				>
				<input
					type="email"
					id="phone"
					class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="youremail@co.ke"
					v-model="clientEmail" />
			</div>
		</div>

		<!-- Full Name Field -->
		<div class="w-full">
			<label
				for="full-name"
				class="block font-medium mb-2 dark:text-white"
				>Full Name</label
			>
			<input
				type="text"
				id="full-name"
				class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
				placeholder="Client Name as On Their National ID"
				v-model="clientName" />
		</div>

		<!-- submit button -->
		<button
			type="submit"
			class="py-3 px-4 w-full mt-7 lg:w-1/2 text-lg h-16 items-center gap-x-2 font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
			<span v-if="!formSubmissionLoading">Update Member Details</span>
			<div
				v-if="formSubmissionLoading"
				class="animate-spin inline-block size-5 border-[3px] border-white border-current border-t-transparent text-gray-800 rounded-full"
				role="status"
				aria-label="loading" />
		</button>
	</form>
</template>

<script setup lang="ts">
	const route = useRoute();
	const formSubmissionLoading = ref(false);
	const clientEmail: Ref<string> = ref(route.query.memberEmail as string);
	const clientPhone: Ref<string> = ref(route.query.memberPhone as string);
	const clientName: Ref<string> = ref(route.query.memberName as string);
	const runtimeConfig = useRuntimeConfig();
	const { openToast } = useToast();

	async function updateMemberDetails(): Promise<void> {
		formSubmissionLoading.value = true;
		try {
			await $fetch("api/v1/memberships/${route.query.memberId}", {
				baseURL: runtimeConfig.public.AVA_BASE_URL,
				method: "PATCH",
				body: JSON.stringify({
					full_name: clientName.value,
					phone_number: clientPhone.value,
					userEmail: clientEmail.value,
				}),

				async onResponse({ response }) {
					if (response.status !== 200) {
						throw new Error("Member details not updated.");
					}

					openToast("Member details updated successfully", "success");
				},
			});
		} catch (error) {
			console.log("Error encountered. Reason: ", error);
			openToast("Failed to update member details. Try again!", "danger");
		} finally {
			formSubmissionLoading.value = false;
		}
	}
</script>
