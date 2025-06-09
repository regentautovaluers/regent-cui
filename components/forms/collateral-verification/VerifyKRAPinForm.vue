<template>
	<form
		@submit.prevent="
			verifyCollateral(
				{
					pinNumber: searchQuery,
				},
				'verify-kra-pin',
			)
		">
		<div class="relative flex items-center justify-between">
			<input
				type="text"
				class="generic-input"
				placeholder="Provide KRA Pin..."
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
			<span class="font-semibold">Business Certificate ID</span>
			<span>{{ responseData.Business_Certificate_Id ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Email Address</span>
			<span>{{ responseData.Email_Addresses ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Locality</span>
			<span>{{ responseData.Locality ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Pin Number</span>
			<span>{{ responseData.PINNo ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Partnership</span>
			<span>{{ responseData.Partnership ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Is Paye</span>
			<span>{{ responseData.Paye ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Station</span>
			<span>{{ responseData.Station ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Tax Payer Name</span>
			<span>{{ responseData.TaxpayerName ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">TOT</span>
			<span>{{ responseData.Tot ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Trading Business Name</span>
			<span>{{ responseData.Trading_Business_Name ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">VAT</span>
			<span>{{ responseData.Vat ?? 'N/A' }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
	const searchQuery: Ref<string> = ref('');
	const { collateralCheckLoading, responseData, verifyCollateral } = useCollateralVerification();
</script>
