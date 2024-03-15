<template>
	<div class="py-10 bg-[#f6f9f2] responsive-view h-full">
		<div class="bg-white w-full p-10 px-2 lg:px-10">
			<h1 class="my-4 text-2xl antialiased font-semibold">
				Add To Your Fleets
			</h1>
			<p class="text-lg text-gray-500">
				Note that each fleet you add using this form will be shown to
				you as one of your corporate options when you make a bulk
				membership registration.
			</p>
			<form
				@submit.prevent="addToCorporateFleet"
				class="mt-5">
				<!-- end of hidden field -->
				<label
					for="fleet-name"
					class="block font-medium mb-2 dark:text-white"
					>Name of the Fleet</label
				>
				<input
					type="text"
					id="fleet-name"
					class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="e.g Kenya Power & Lightning Company"
					required
					v-model="fleetName" />
				<div
					class="flex flex-col lg:flex-row items-center justify-between space-y-3 lg:space-y-0 space-x-0 lg:space-x-3 mt-7">
					<!-- Full Name Field -->
					<div class="w-full lg:w-1/3">
						<label
							for="contact-person-name"
							class="block font-medium mb-2 dark:text-white"
							>Contact Person Name</label
						>
						<input
							type="text"
							id="contact-person-name"
							class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
							placeholder="Client Name as On Their National ID"
							required
							v-model="contactFullName" />
					</div>

					<!-- Phone Field -->
					<div class="w-full lg:w-1/3">
						<label
							for="contact-person-phone"
							class="block font-medium mb-2 dark:text-white"
							>Contact Person Phone Number</label
						>
						<input
							type="text"
							id="contact-person-phone"
							class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
							placeholder="+254704080056"
							required
							v-model="contactPhoneNumber" />
					</div>

					<!-- Email field -->
					<div class="w-full lg:w-1/3">
						<label
							for="contact-person-email"
							class="block font-medium mb-2 dark:text-white"
							>Contact Person Email</label
						>
						<input
							type="email"
							id="contact-person-email"
							class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
							placeholder="youremail@co.ke"
							required
							v-model="contactEmail" />
					</div>
				</div>
				<button
					type="submit"
					class="py-3 px-4 w-full mt-7 lg:w-1/2 text-lg h-16 items-center gap-x-2 font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
					<span v-if="!formSubmissionLoading">Add to Fleet</span>
					<div
						v-if="formSubmissionLoading"
						class="animate-spin inline-block size-5 border-[3px] border-white border-current border-t-transparent text-gray-800 rounded-full"
						role="status"
						aria-label="loading" />
				</button>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: "manage-fleets",
		layout: "in-app-layout",
	});

	const formSubmissionLoading = ref(false);
	const fleetName: Ref<string | null> = ref(null);
	const contactFullName: Ref<string | null> = ref(null);
	const contactPhoneNumber: Ref<string | null> = ref(null);
	const contactEmail: Ref<string | null> = ref(null);
	const { getDetails } = usePrincipal();
	const { openToast } = useToast();
	const runtimeConfig = useRuntimeConfig();

	async function addToCorporateFleet() {
		formSubmissionLoading.value = true;
		try {
			await $fetch(
				`${runtimeConfig.public.DEV_TIME_HOST}/api/v1/fleets`,
				{
					method: "POST",
					body: JSON.stringify({
						corporate: getDetails.acc_id,
						fleetname: fleetName.value,
						contact_full_name: contactFullName.value,
						contact_phone_number: contactPhoneNumber.value,
						contact_email: contactEmail.value,
						recordedBy: getDetails.username,
					}),
					async onResponse({ response }) {
						if (response.status === 201) {
							openToast("Fleet created successfully", "success");
							formSubmissionLoading.value = false;
						}
					},
				}
			);
		} catch (error) {
			console.log("An error occured: ", error);
			formSubmissionLoading.value = false;
			openToast("Request failed. Please try again!", "danger");
		}
	}
</script>
