<template>
	<form @submit.prevent="topUpTokens()">
		<div class="mt-3 flex flex-col">
			<label
				class="generic-input-label"
				for="amount"
				>Amount</label
			>
			<div class="flex flex-grow">
				<input
					type="text"
					id="amount"
					class="generic-input"
					placeholder="e.g 1000"
					required
					v-model="amount" />
			</div>
		</div>
		<div class="mt-3 flex flex-col">
			<label
				class="generic-input-label"
				for="phone"
				>Phone Number</label
			>
			<div class="flex flex-grow">
				<input
					type="text"
					id="phone"
					class="generic-input"
					placeholder="254712345678"
					required
					v-model="phoneNumber" />
			</div>
		</div>

		<!-- submit button -->
		<button
			type="submit"
			:class="[
				'generic-form-submit mt-3',
				initiateTopUpRequestLoading && 'skeleton skeleton-animated',
			]">
			{{ initiateTopUpRequestLoading ? 'Please Wait...' : 'Top Up' }}
		</button>
	</form>
</template>

<script setup lang="ts">
	const { topUpTokens, amount, phoneNumber, initiateTopUpRequestLoading } =
		useCollateralVerificationTokensManagement();
</script>
