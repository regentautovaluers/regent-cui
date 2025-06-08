<template>
	<form
		@submit.prevent="
			verifyCollateral(
				{
					idNumber: searchQuery,
				},
				'verify-driving-license',
			)
		">
		<div class="relative flex items-center justify-between">
			<input
				type="text"
				class="generic-input"
				placeholder="Provide Driving License..."
				v-model="searchQuery" />
			<button
				type="submit"
				class="generic-search-submit-button">
				<FormSubmissionLoader
					class="mr-2 size-6 animate-spin text-white"
					v-if="collateralCheckLoading" />
				<SearchIcon v-else />
			</button>
		</div>
	</form>

	<div
		class="mt-5 space-y-2 text-sm text-gray-500"
		v-if="responseData">
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Points</span>
			<span>{{ responseData.points ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">National ID</span>
			<span>{{ responseData.address ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Status</span>
			<span>{{ responseData.status ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Date of Issue</span>
			<span>{{ responseData.date_of_issue ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Smart DL Booking Test Center</span>
			<span>{{ responseData.smartDLBookingTestCenter ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Phone Number</span>
			<span>{{ responseData.phoneNumber ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">City</span>
			<span>{{ responseData.city ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">KRA PIN</span>
			<span>{{ responseData.kra ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Date of Birth</span>
			<span>{{ responseData.date_of_birth ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">ID Type</span>
			<span>{{ responseData.id_type ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">License Number</span>
			<span>{{ responseData.license_number ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Blood Group</span>
			<span>{{ responseData.blood_group ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Sex</span>
			<span>{{ responseData.sex ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Email</span>
			<span>{{ responseData.email ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">DL Class</span>
			<span>{{ responseData.dlclass ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Nationality</span>
			<span>{{ responseData.nationality ?? 'N/A' }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
	const searchQuery: Ref<string> = ref('');
	const { collateralCheckLoading, responseData, verifyCollateral } = useCollateralVerification();
</script>
