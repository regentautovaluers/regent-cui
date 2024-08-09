<template>
	<form
		@submit.prevent="createFleet"
		class="mt-5">
		<!-- end of hidden field -->
		<label
			for="fleet-name"
			class="mb-2 block font-medium dark:text-white"
			>Name of the Fleet</label
		>
		<input
			type="text"
			id="fleet-name"
			class="generic-input"
			placeholder="e.g Kenya Power & Lightning Company"
			required
			v-model="fleetName" />
		<div
			class="mt-7 flex flex-col items-center justify-between space-x-0 space-y-3 lg:flex-row lg:space-x-3 lg:space-y-0">
			<!-- Full Name Field -->
			<div class="w-full lg:w-1/3">
				<label
					for="contact-person-name"
					class="mb-2 block font-medium dark:text-white"
					>Contact Person Name</label
				>
				<input
					type="text"
					id="contact-person-name"
					class="generic-input"
					placeholder="Client Name as On Their National ID"
					required
					v-model="contactFullName" />
			</div>

			<!-- Phone Field -->
			<div class="w-full lg:w-1/3">
				<label
					for="contact-person-phone"
					class="mb-2 block font-medium dark:text-white"
					>Contact Person Phone Number</label
				>
				<input
					type="text"
					id="contact-person-phone"
					class="generic-input"
					placeholder="+254704080056"
					required
					v-model="contactPhoneNumber" />
			</div>

			<!-- Email field -->
			<div class="w-full lg:w-1/3">
				<label
					for="contact-person-email"
					class="mb-2 block font-medium dark:text-white"
					>Contact Person Email</label
				>
				<input
					type="email"
					id="contact-person-email"
					class="generic-input"
					placeholder="youremail@co.ke"
					required
					v-model="contactEmail" />
			</div>
		</div>
		<div class="mt-4 flex items-center justify-start">
			<button
				v-if="!formSubmissionLoading"
				type="submit"
				class="form-submit w-1/3">
				Create Fleet
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
	import { LoopingRhombusesSpinner } from 'epic-spinners';

	const fleetName: Ref<string> = ref('');
	const contactFullName: Ref<string> = ref('');
	const contactPhoneNumber: Ref<string> = ref('');
	const contactEmail: Ref<string> = ref('');
	const formSubmissionLoading = ref(false);
	const runtimeConfig = useRuntimeConfig();
	const { openToast } = useToast();
	const { getPrincipal } = useAuth();

	watch(contactPhoneNumber, (newNumber) => {
		if (newNumber.startsWith('0') || newNumber.startsWith('+254')) {
			contactPhoneNumber.value = newNumber.replace(/^(\+254|0)/, '254');
		}
	});

	const createFleet = async () => {
		formSubmissionLoading.value = true;
		try {
			await $fetch(`${runtimeConfig.public.AVA_BASE_URL}/api/v1/fleets`, {
				// baseUrl: runtimeConfig.public.AVA_BASE_URL,
				method: 'POST',
				body: JSON.stringify({
					corporate: getPrincipal.value.corpId,
					fleetname: fleetName.value,
					contact_full_name: contactFullName.value,
					contact_phone_number: contactPhoneNumber.value,
					contact_email: contactEmail.value,
					recordedBy: getPrincipal.value.userId,
				}),

				onResponse({ response }) {
					console.log('Create fleet response body: ', response._data);
					console.log('Create fleet response status: ', response.status);
					if (response.status === 201) {
						openToast('Fleet created successfully', 'success');
					}
				},
			});
		} catch (error) {
			console.log('An error occured: ', error);
			openToast('Request failed. Please try again!', 'danger');
		} finally {
			formSubmissionLoading.value = false;
		}
	};
</script>
