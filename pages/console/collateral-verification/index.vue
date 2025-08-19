<template>
	<div class="laptop:p-4 laptop-lg:p-8 flex flex-1 flex-col p-2">
		<div
			class="laptop:flex-row laptop:space-y-0 laptop:space-x-5 flex h-fit flex-col space-y-5">
			<div class="laptop:w-2/3 flex h-96 w-full flex-col rounded-lg border p-4 shadow-sm">
				<h1 class="mb-2 text-lg font-semibold text-gray-500">Recent Searches</h1>
				<div class="h-96 flex-grow">
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
				class="laptop:w-1/3 flex h-96 w-full flex-col items-center justify-center space-y-3 rounded-lg border text-gray-600 shadow-sm">
				<h1 class="text-5xl font-bold">
					{{ getCollateralVerificationTokenInfo?.balance ?? 'N/A' }}
				</h1>
				<h2 class="text-sm">Tokens Available</h2>
				<button
					class="generic-form-submit w-1/3 shadow-none"
					data-modal-target="topup-tokens-modal"
					data-modal-toggle="topup-tokens-modal">
					Top Up
				</button>
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
	import { CollateralVerificationSearchesBarChart } from '#components';
	import TopUpCollateralVerificationsForm from '~/components/forms/TopUpCollateralVerificationsForm.vue';

	definePageMeta({
		name: 'collateral-verification-home',
		layout: 'console-layout',
	});

	const { shouldAllowSearch, getCollateralVerificationTokenInfo } =
		useCollateralVerificationTokensManagement();
</script>
