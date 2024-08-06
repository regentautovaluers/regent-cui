<template>
	<form @submit.prevent="updateMembershipDetails">
		<div
			class="flex flex-col lg:flex-row items-center justify-between space-y-3 lg:space-y-0 space-x-0 lg:space-x-3">
			<!-- Phone Field -->
			<div class="w-full lg:w-1/2">
				<label
					for="phone"
					class="block font-medium mb-2 dark:text-white"
					>Vehicle Belongs To</label
				>
				<input
					type="text"
					disabled
					id="phone"
					class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none disabled:bg-gray-200"
					placeholder="+254704080056"
					:value="$route.query.clientName" />
			</div>

			<!-- Email field -->
			<div class="w-full lg:w-1/2">
				<label
					for="email"
					class="block font-medium mb-2 dark:text-white"
					>Vehicle Registration</label
				>
				<input
					type="text"
					id="phone"
					class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="youremail@co.ke"
					v-model="vehicleRegistration" />
			</div>
		</div>
		<!-- Vehicle Make and Model -->
		<div
			class="flex flex-col lg:flex-row items-center justify-between space-x-0 lg:space-x-3 space-y-3 lg:space-y-0 mt-4">
			<!-- Vehicle Make -->
			<div class="w-full lg:w-1/2">
				<label
					for="phone"
					class="block font-medium mb-2 dark:text-white"
					>Vehicle Make</label
				>
				<input
					type="text"
					id="phone"
					class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="e.g Toyota"
					v-model="vehicleMake" />
			</div>
			<!-- Vehicle Model -->
			<div class="w-full lg:w-1/2">
				<label
					for="phone"
					class="block font-medium mb-2 dark:text-white"
					>Vehicle Model</label
				>
				<input
					type="text"
					id="phone"
					class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="e.g Premio"
					v-model="vehicleModel" />
			</div>
		</div>
		<!--  -->
		<div class="flex items-center justify-between space-x-3 mt-4">
			<!-- Payment Status Field -->
			<div class="w-1/2 md:w-1/3">
				<label
					for="payment-status"
					class="block font-medium mb-2 dark:text-white"
					>Payment Status</label
				>
				<select
					class="py-3 px-4 pe-9 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					id="payment-status"
					v-model="paymentStatus">
					<option
						v-for="(status, index) in ['Paid', 'Not Paid']"
						:key="index"
						:value="status.toLocaleLowerCase()">
						{{ status }}
					</option>
				</select>
			</div>
			<!-- Payment Status Field -->
			<div class="w-1/2 md:w-2/3">
				<label
					for="membership-status"
					class="block font-medium mb-2 dark:text-white"
					>Membership Status</label
				>
				<select
					class="py-3 px-4 pe-9 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					id="membership-status"
					v-model="membershipStatus">
					<option
						v-for="(status, index) in ['Active', 'Inactive']"
						:key="index"
						:value="status.toLocaleLowerCase()">
						{{ status }}
					</option>
				</select>
			</div>
		</div>
		<button
			type="submit"
			class="py-3 px-4 w-full mt-7 lg:w-1/2 text-lg h-16 items-center gap-x-2 font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
			<span v-if="!formSubmissionLoading">Update Membership</span>
			<div
				v-if="formSubmissionLoading"
				class="animate-spin inline-block size-5 border-[3px] border-white border-current border-t-transparent text-gray-800 rounded-full"
				role="status"
				aria-label="loading" />
		</button>
	</form>
</template>

<script setup lang="ts">
	const formSubmissionLoading = ref(false);
	const route = useRoute();
	const router = useRouter();
	const runtimeConfig = useRuntimeConfig();
	const vehicleRegistration: Ref<string> = ref(route.query.vehicleRegistration as string);
	const vehicleMake: Ref<string> = ref(route.query.vehicleMake as string);
	const vehicleModel: Ref<string> = ref(route.query.vehicleModel as string);
	const paymentStatus: Ref<string> = ref(route.query.paymentStatus as string);
	const membershipStatus: Ref<string> = ref(route.query.membershipStatus as string);
	const { openToast } = useToast();

	async function updateMembershipDetails(): Promise<void> {
		formSubmissionLoading.value = true;
		try {
			await $fetch(`/api/v1/membershipVehicles/${route.query.membershipId}`, {
				baseURL: runtimeConfig.public.AVA_BASE_URL,
				method: 'PATCH',
				body: JSON.stringify({
					registration: vehicleRegistration.value,
					make: vehicleMake.value,
					model: vehicleModel.value,
					payment_status: paymentStatus.value,
					membership_status: membershipStatus.value,
				}),

				async onResponse({ response }) {
					if (response.status !== 200) {
						throw new Error('Member details not updated.');
					}

					openToast('Membership details updated successfully', 'success');

					router.back();
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
