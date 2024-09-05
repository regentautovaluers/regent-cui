<template>
	<form
		@submit.prevent="updateMemberDetails(props.memberId, clientName, clientPhone, clientEmail)">
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
					v-model="clientPhone"
					required />
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
				v-model="clientName"
				required />
		</div>

		<!-- submit button -->
		<button
			type="submit"
			class="generic-form-submit mt-4">
			<FormSubmissionLoader
				classes="mr-2 size-6 animate-spin text-white"
				v-if="updateMemberDetailsLoading" />
			{{ updateMemberDetailsLoading ? $t('request_processing') : 'Update' }}
		</button>
	</form>
</template>

<script setup lang="ts">
	const props = defineProps({
		memberId: { required: true, type: Number },
		memberName: { required: true, type: String },
		memberEmail: { required: false, type: String || null },
		memberPhone: { required: true, type: String },
	});

	const clientEmail: Ref<string> = ref(props.memberEmail ?? '');
	const clientPhone: Ref<string> = ref(props.memberPhone);
	const clientName: Ref<string> = ref(props.memberName);

	const { updateMemberDetails, updateMemberDetailsLoading } = useAVAMemberships();

	watch(clientPhone, (newNumber) => {
		if (newNumber.startsWith('0') || newNumber.startsWith('+254')) {
			clientPhone.value = newNumber.replace(/^(\+254|0)/, '254');
		}
	});
</script>
