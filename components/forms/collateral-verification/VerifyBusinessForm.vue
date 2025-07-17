<template>
	<form
		@submit.prevent="
			verifyCollateral(
				{
					businessRegNumber: searchQuery,
				},
				'verify-business',
			)
		">
		<div class="relative flex items-center justify-between">
			<input
				type="text"
				class="generic-input"
				placeholder="Provide Business Reg Number..."
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
			<span class="font-semibold">Status</span>
			<span>{{ responseData.status ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Registration Date</span>
			<span>{{ responseData.registration_date ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Postal Address</span>
			<span>{{ responseData.postal_address ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Physical Address</span>
			<span>{{ responseData.physical_address ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Phone Number</span>
			<span>{{ responseData.phone_number ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Registration Number</span>
			<span>{{ responseData.registration_number ?? 'N/A' }}</span>
		</div>

		<!-- share capital -->
		<div
			class="flex items-center justify-between border-b py-2"
			v-if="(responseData.share_capital as []).length === 0">
			<span class="font-semibold">Share Capital</span>
			<span>{{ 'N/A' }}</span>
		</div>
		<div
			v-else
			class="tablet:grid-cols-2 mt-2 grid grid-cols-1 gap-3">
			<span class="col-span-full font-semibold">Share Capital</span>
			<div
				v-for="(share, index) in responseData.share_capital"
				:key="index"
				class="flex min-h-28 flex-col justify-center rounded-lg border p-4 shadow-md">
				<h1 class="text-center font-bold">{{ share.name }}</h1>
				<div class="mt-2 flex space-x-2">
					<div class="flex h-full w-1/2 flex-col">
						<h1 class="text-xs">No. Of Shares</h1>
						<span class="text-lg font-semibold">{{ share.number_of_shares }}</span>
					</div>
					<div class="flex h-full w-1/2 flex-col">
						<h1 class="text-xs">Nominal Value</h1>
						<span class="text-lg font-semibold">{{ share.number_of_shares }}</span>
					</div>
				</div>
			</div>
		</div>

		<!-- partners -->
		<div
			class="flex items-center justify-between border-b py-2"
			v-if="(responseData.partners as []).length === 0">
			<span class="font-semibold">Partners</span>
			<span>{{ 'N/A' }}</span>
		</div>
		<div
			v-else
			class="tablet:grid-cols-2 mt-2 grid grid-cols-1 gap-3">
			<span class="col-span-full font-semibold">Partners</span>
			<div
				v-for="(partner, index) in responseData.partners"
				:key="index"
				class="flex min-h-32 flex-col items-center rounded-lg border p-4 shadow-md">
				<span class="text-sm font-semibold">{{ partner.name }} ({{ partner.gender }})</span>
				<span class="text-xs">({{ (partner.type as string).replaceAll('_', ' ') }})</span>
				<span class="text-xs">ID Number: {{ partner.id_number }}</span>
				<div class="mt-2 w-full border-t text-center">
					<h1 class="font-semibold">Shares</h1>
					<span v-if="(partner.shares as []).length == 0"> No Shares </span>
					<span
						v-else
						v-for="(shares, index) in partner.shares"
						:key="index"
						class="text-sm">
						{{ shares.name }} - {{ shares.number_of_shares }}
					</span>
				</div>
				<span></span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const searchQuery: Ref<string> = ref('');
	const { collateralCheckLoading, responseData, verifyCollateral } = useCollateralVerificiation();
</script>
