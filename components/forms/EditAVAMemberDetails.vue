<template>
	<form @submit.prevent="updateMemberDetails">
		<div
			class="mb-2 flex flex-col items-center justify-between space-x-0 space-y-3 lg:flex-row lg:space-x-3 lg:space-y-0">
			<!-- Phone Field -->
			<div class="w-full lg:w-1/2">
				<label
					for="phone"
					class="generic-input-label"
					>Phone</label
				>
				<input
					type="text"
					id="phone"
					class="generic-input"
					placeholder="+254704080056"
					v-model="clientPhone" />
			</div>

			<!-- Email field -->
			<div class="w-full lg:w-1/2">
				<label
					for="email"
					class="generic-input-label"
					>Email</label
				>
				<input
					type="email"
					id="phone"
					class="generic-input"
					placeholder="youremail@co.ke"
					v-model="clientEmail" />
			</div>
		</div>

		<!-- Full Name Field -->
		<div class="w-full">
			<label
				for="full-name"
				class="generic-input-label"
				>Full Name</label
			>
			<input
				type="text"
				id="full-name"
				class="generic-input"
				placeholder="As On Their National ID"
				v-model="clientName" />
		</div>

		<!-- submit button -->
		<button
			type="submit"
			class="generic-form-submit mt-4">
			Update Details
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

					useToast('Details Updated Successfully!', {
						type: '"success',
						showIcon: true,
						showCloseButton: true,
						hideProgressBar: false,
						transition: 'slide',
					});
				},
			});
		} catch (error) {
			console.log('Error encountered. Reason: ', error);
			useToast('Failed. Try Again!', {
				type: 'danger',
				showIcon: true,
				showCloseButton: true,
				hideProgressBar: false,
				transition: 'slide',
			});
		} finally {
			formSubmissionLoading.value = false;
		}
	}
</script>
