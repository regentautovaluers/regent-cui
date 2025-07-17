<template>
	<form
		@submit.prevent="
			verifyCollateral(
				{
					bankId: bankId,
					accountNumber: accountNumber,
				},
				'verify-bank-account',
			)
		">
		<div class="relative flex w-full flex-col">
			<label
				for="target-brank"
				class="generic-input-label"
				>Select a Bank</label
			>
			<select
				:class="[
					'generic-input',
					fetchBankListStatus === 'error'
						? 'border-yellow-300 focus:border-yellow-600 focus:ring-yellow-600'
						: 'border-gray-300',
				]"
				id="target-brank"
				v-model="bankId"
				required>
				<option
					v-for="(bank, index) in bankList"
					:key="index"
					:value="bank.id">
					{{ bank.name }}
				</option>
			</select>
			<FormSubmissionLoader
				class="absolute top-[52%] right-6 mr-2 size-5 animate-spin text-gray-500"
				v-if="fetchBankListStatus === 'pending'" />
			<WarningIndicator
				class="absolute top-[52%] right-6 mr-2 size-5 text-yellow-500"
				v-else />
		</div>

		<div class="relative mt-2 flex items-center justify-between">
			<input
				type="text"
				class="generic-input"
				placeholder="Provide Account Number..."
				v-model="accountNumber"
				required />
		</div>

		<!-- submit button -->
		<button
			type="submit"
			:class="[
				'generic-form-submit mt-2 w-full',
				collateralCheckLoading && 'skeleton skeleton-animated',
			]">
			{{ collateralCheckLoading ? 'Please Wait...' : 'Perform Check' }}
		</button>
	</form>

	<div
		class="mt-5 space-y-2 text-sm text-gray-500"
		v-if="responseData">
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Holder's Name</span>
			<span>{{ responseData.name ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Account Number</span>
			<span>{{ responseData.account_number ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Bank Name</span>
			<span>{{ responseData.bank_name ?? 'N/A' }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
	import WarningIndicator from '~/components/misc/spinners/WarningIndicator.vue';

	const bankId: Ref<string> = ref('');
	const accountNumber: Ref<string> = ref('');
	const {
		collateralCheckLoading,
		responseData,
		fetchBankListStatus,
		executeFetchBankList,
		bankList,
		verifyCollateral,
	} = useCollateralVerificiation();
</script>
