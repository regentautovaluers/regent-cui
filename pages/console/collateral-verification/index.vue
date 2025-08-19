<template>
	<div class="laptop:p-4 laptop-lg:p-8 laptop:justify-center flex flex-1 flex-col gap-y-4">
		<div
			class="laptop:flex-row laptop:space-y-0 laptop:space-x-5 flex h-fit flex-col space-y-5">
			<div
				class="laptop:w-1/3 flex h-72 w-full flex-col items-center justify-center space-y-3 rounded-lg border p-4 text-gray-600 shadow-sm">
				<h1 class="mb-2 font-semibold text-gray-500">Most Used</h1>
				<h2 class="text-sm">{{ mostSearched.searchType }}</h2>
			</div>
			<div
				class="laptop:w-1/3 flex h-72 w-full flex-col items-center justify-center space-y-3 rounded-lg border p-4 text-gray-600 shadow-sm">
				<h1 class="text-5xl font-bold">
					{{
						searchDistribution.reduce(
							(accumulator, currentValue) => accumulator + currentValue.totalSearches,
							0,
						)
					}}
				</h1>
				<h1 class="mb-2 font-semibold text-gray-500">Total Searches</h1>
			</div>
			<div
				class="laptop:w-1/3 flex h-72 w-full flex-col items-center justify-center space-y-3 rounded-lg border text-gray-600 shadow-sm">
				<h1 class="text-5xl font-bold">
					{{ getCollateralVerificationTokenInfo?.balance ?? 'N/A' }}
				</h1>
				<h2 class="text-sm">Tokens Available</h2>
				<button
					class="generic-form-submit w-1/3 text-sm shadow-none"
					data-modal-target="topup-tokens-modal"
					data-modal-toggle="topup-tokens-modal">
					Top Up ({{ getCollateralVerificationTokenInfo?.billingType }})
				</button>
			</div>
		</div>
		<div
			class="laptop:flex-row laptop:space-y-0 laptop:space-x-5 flex h-fit flex-col space-y-5">
			<div
				class="laptop:w-2/3 flex h-[28rem] w-full flex-col rounded-lg border p-4 shadow-sm">
				<h1 class="mb-2 font-semibold text-gray-500">Recent Searches</h1>
				<div class="flex-grow">
					<CollateralVerificationSearchesBarChart
						:labels="[
							'Collateral',
							'NatID',
							'AlienID',
							'Vehicle',
							'DL',
							'KRA Pin',
							'Business',
							'Loans',
							'Bank',
						]"
						:data="[
							getCollateralVerificationTokenInfo?.fraudBundleSearches ?? 0,
							getCollateralVerificationTokenInfo?.verifyNationalIdSearches ?? 0,
							getCollateralVerificationTokenInfo?.verifyAlienIdSearches ?? 0,
							getCollateralVerificationTokenInfo?.verifyVehicleSearches ?? 0,
							getCollateralVerificationTokenInfo?.verifyDrivingLicenseSearches ?? 0,
							getCollateralVerificationTokenInfo?.verifyKraPinSearches ?? 0,
							getCollateralVerificationTokenInfo?.verifyBusinessSearches ?? 0,
							getCollateralVerificationTokenInfo?.verifyCollateralSearches ?? 0,
							getCollateralVerificationTokenInfo?.verifyBankAccountSearches ?? 0,
						]" />
				</div>
			</div>

			<div
				class="laptop:w-1/3 h-[28rem] w-full rounded-lg border p-4 text-gray-600 shadow-sm">
				<h1 class="mb-2 font-semibold text-gray-500">Recent Activity</h1>
				<div
					class="h-fit space-y-1 rounded-lg py-3 text-sm hover:bg-gray-100"
					v-for="(e, idx) in history"
					:key="idx">
					<h1><span class="font-semibold">Search made:</span> {{ e.searchType }}</h1>
					<h1>{{ e.date.split('T')[0] }}</h1>
				</div>
			</div>
		</div>

		<!-- top up modal -->
		<ParentModal
			modal-id="topup-tokens-modal"
			modal-title="Top Up Tokens"
			modal-placement="center-center">
			<TopUpCollateralVerificationsForm />
		</ParentModal>
	</div>
</template>
<script setup lang="ts">
	definePageMeta({
		name: 'collateral-verification-home',
		layout: 'console-layout',
	});

	const mostSearched = computed(() => {
		let sorted = searchDistribution.value.sort((e1, e2) => e2.totalSearches - e1.totalSearches);
		return sorted[0];
	});
	const { shouldAllowSearch, getCollateralVerificationTokenInfo, searchDistribution } =
		useCollateralVerificationTokensManagement();

	const { history, fetchCollateralVerificationHistoryStatus } =
		useCollateralVerificationsHistoryManagement();
</script>
