<template>
	<form @submit.prevent="updateMemberDetails">
		<div
			class="flex flex-col items-center justify-between space-x-0 space-y-3 lg:flex-row lg:space-x-3 lg:space-y-0">
			<!-- Phone Field -->
			<div class="w-full lg:w-1/2">
				<label
					for="phone"
					class="mb-2 block font-medium dark:text-white"
					>Phone</label
				>
				<input
					type="text"
					id="phone"
					class="block h-[4.5rem] w-full rounded-lg border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
					placeholder="+254704080056"
					v-model="clientPhone" />
			</div>

			<!-- Email field -->
			<div class="w-full lg:w-1/2">
				<label
					for="email"
					class="mb-2 block font-medium dark:text-white"
					>Email</label
				>
				<input
					type="email"
					id="phone"
					class="block h-[4.5rem] w-full rounded-lg border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
					placeholder="youremail@co.ke"
					v-model="clientEmail" />
			</div>
		</div>

		<!-- Full Name Field -->
		<div class="w-full">
			<label
				for="full-name"
				class="mb-2 block font-medium dark:text-white"
				>Full Name</label
			>
			<input
				type="text"
				id="full-name"
				class="block h-[4.5rem] w-full rounded-lg border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
				placeholder="Client Name as On Their National ID"
				v-model="clientName" />
		</div>

		<!-- submit button -->
		<button
			type="submit"
			class="mt-7 h-16 w-full items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-lg font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 lg:w-1/2">
			<span v-if="!formSubmissionLoading">Update Member Details</span>
			<div
				v-if="formSubmissionLoading"
				class="inline-block size-5 animate-spin rounded-full border-[3px] border-current border-white border-t-transparent text-gray-800"
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
			await $fetch('api/v1/memberships/${route.query.memberId}', {
				baseURL: runtimeConfig.public.AVA_BASE_URL,
				method: 'PATCH',
				body: JSON.stringify({
					full_name: clientName.value,
					phone_number: clientPhone.value,
					userEmail: clientEmail.value,
				}),

				async onResponse({ response }) {
					if (response.status !== 200) {
						throw new Error('Member details not updated.');
					}

					openToast('Member details updated successfully', 'success');
				},
			});
		} catch (error) {
			console.log('Error encountered. Reason: ', error);
			openToast('Failed to update member details. Try again!', 'danger');
		} finally {
			formSubmissionLoading.value = false;
		}
	}
</script>
