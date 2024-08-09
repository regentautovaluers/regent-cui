<template>
	<form @submit.prevent="updateMembershipDetails">
		<div
			class="flex flex-col items-center justify-between space-x-0 space-y-3 lg:flex-row lg:space-x-3 lg:space-y-0">
			<!-- Phone Field -->
			<div class="w-full lg:w-1/2">
				<label
					for="phone"
					class="mb-2 block font-medium dark:text-white"
					>Vehicle Belongs To</label
				>
				<input
					type="text"
					disabled
					id="phone"
					class="block h-[4.5rem] w-full rounded-lg border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:bg-gray-200 disabled:opacity-50"
					placeholder="+254704080056"
					:value="$route.query.clientName" />
			</div>

			<!-- Email field -->
			<div class="w-full lg:w-1/2">
				<label
					for="email"
					class="mb-2 block font-medium dark:text-white"
					>Vehicle Registration</label
				>
				<input
					type="text"
					id="phone"
					class="block h-[4.5rem] w-full rounded-lg border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
					placeholder="youremail@co.ke"
					v-model="vehicleRegistration" />
			</div>
		</div>
		<!-- Vehicle Make and Model -->
		<div
			class="mt-4 flex flex-col items-center justify-between space-x-0 space-y-3 lg:flex-row lg:space-x-3 lg:space-y-0">
			<!-- Vehicle Make -->
			<div class="w-full lg:w-1/2">
				<label
					for="phone"
					class="mb-2 block font-medium dark:text-white"
					>Vehicle Make</label
				>
				<input
					type="text"
					id="phone"
					class="block h-[4.5rem] w-full rounded-lg border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
					placeholder="e.g Toyota"
					v-model="vehicleMake" />
			</div>
			<!-- Vehicle Model -->
			<div class="w-full lg:w-1/2">
				<label
					for="phone"
					class="mb-2 block font-medium dark:text-white"
					>Vehicle Model</label
				>
				<input
					type="text"
					id="phone"
					class="block h-[4.5rem] w-full rounded-lg border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
					placeholder="e.g Premio"
					v-model="vehicleModel" />
			</div>
		</div>
		<!--  -->
		<div class="mt-4 flex items-center justify-between space-x-3">
			<!-- Payment Status Field -->
			<div class="w-1/2 md:w-1/3">
				<label
					for="payment-status"
					class="mb-2 block font-medium dark:text-white"
					>Payment Status</label
				>
				<select
					class="block h-[4.5rem] w-full rounded-lg border-gray-200 px-4 py-3 pe-9 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
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
					class="mb-2 block font-medium dark:text-white"
					>Membership Status</label
				>
				<select
					class="block h-[4.5rem] w-full rounded-lg border-gray-200 px-4 py-3 pe-9 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
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
			class="mt-7 h-16 w-full items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-lg font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 lg:w-1/2">
			<span v-if="!formSubmissionLoading">Update Membership</span>
			<div
				v-if="formSubmissionLoading"
				class="inline-block size-5 animate-spin rounded-full border-[3px] border-current border-white border-t-transparent text-gray-800"
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
