<template>
	<div class="laptop:p-0 flex flex-1 flex-col gap-y-10 p-2">
		<div class="laptop:grid-cols-3 grid h-fit grid-cols-1 gap-10">
			<div
				class="flex h-36 items-center justify-center rounded-lg border border-green-300 bg-white p-5 shadow-xs outline-none">
				<div class="flex-grow">
					<h2 class="text-sm text-gray-500">Most Used</h2>
					<h1 class="text-lg font-semibold text-gray-700">
						{{ mostSearched.searchType }}
					</h1>
					<h3 class="inline-flex items-center space-x-1 text-sm">
						<span class="font-bold text-green-500">{{ 10 }}%</span
						><span class="text-gray-500">of total searches</span>
					</h3>
				</div>
				<button
					class="inline-flex size-[3.2rem] items-center justify-center rounded-md border border-green-300 bg-green-100">
					<span
						class="icon-[material-symbols-light--document-search-rounded] text-3xl text-green-600"></span>
				</button>
			</div>
			<div
				class="flex h-36 items-center justify-center rounded-lg border border-blue-300 bg-white p-5 shadow-xs outline-none">
				<div class="flex-grow">
					<h2 class="text-sm text-gray-500">You Made</h2>
					<h1 class="text-lg font-semibold text-gray-700">
						{{
							searchDistribution.reduce(
								(accumulator, currentValue) =>
									accumulator + currentValue.totalSearches,
								0,
							)
						}}
					</h1>
					<h3 class="inline-flex items-center space-x-1 text-sm text-gray-500">
						Total Searches
					</h3>
				</div>
				<button
					class="inline-flex size-[3.2rem] items-center justify-center rounded-md border border-blue-300 bg-blue-100">
					<span
						class="icon-[material-symbols-light--equal-rounded] text-3xl text-blue-600"></span>
				</button>
			</div>
			<div
				class="flex h-36 items-center justify-center rounded-lg border border-yellow-300 bg-white p-5 shadow-xs outline-none">
				<div class="flex-grow">
					<h2 class="text-sm text-gray-500">Tokens Available</h2>
					<h1 class="text-lg font-semibold text-gray-700">
						{{ getCollateralVerificationTokenInfo?.balance ?? 0 }}
					</h1>
					<h3 class="inline-flex items-center space-x-1 text-sm text-gray-500">
						Click the '+' button to top up.
					</h3>
				</div>
				<button
					class="inline-flex size-[3.2rem] cursor-pointer items-center justify-center rounded-md border border-yellow-300 bg-yellow-100"
					data-modal-target="topup-tokens-modal"
					data-modal-toggle="topup-tokens-modal">
					<span
						class="icon-[material-symbols-light--add-circle-rounded] text-3xl text-yellow-600"></span>
				</button>
			</div>
		</div>
		<div
			class="laptop:flex-row laptop:space-y-0 laptop:space-x-10 flex h-fit flex-col space-y-10">
			<div
				class="laptop:w-2/3 flex h-[33rem] w-full flex-col rounded-lg border-2 bg-white p-4">
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
				class="laptop:w-1/3 h-[33rem] w-full rounded-lg border-2 bg-white p-4 text-gray-600">
				<h1 class="mb-2 font-semibold text-gray-500">Recent Activity</h1>
				<div
					class="h-fit space-y-1 p-3 text-sm hover:bg-gray-100"
					v-for="(e, idx) in history"
					:key="idx">
					<h1>{{ e.date.split('T')[0] }}</h1>
					<h1><span class="font-semibold">Search made:</span> {{ e.searchType }}</h1>
				</div>
			</div>
		</div>

		<!-- top up modal -->
		<ParentModal
			modal-id="topup-tokens-modal"
			modal-title="Top Up Tokens">
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
