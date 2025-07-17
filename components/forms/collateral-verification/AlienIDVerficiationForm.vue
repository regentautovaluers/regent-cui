<template>
	<form
		@submit.prevent="
			verifyCollateral(
				{
					idNumber: searchQuery,
				},
				'verify-alien-id',
			)
		">
		<div class="relative flex items-center justify-between">
			<input
				type="text"
				class="generic-input"
				placeholder="Provide Alien ID as number..."
				v-model="searchQuery"
				pattern="[0-9]*" />
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
			<span class="font-semibold">First Name</span>
			<span>{{ responseData.first_name ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Last Name</span>
			<span>{{ responseData.last_name ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Other Name</span>
			<span>{{ responseData.other_name ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Gender</span>
			<span>{{ responseData.gender ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Date of Birth</span>
			<span>{{ responseData.dob ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Citizenship</span>
			<span>{{ responseData.citizenship ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Serial Number</span>
			<span>{{ responseData.id_number ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Is Valid</span>
			<span>{{ responseData.valid ?? 'N/A' }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
	const searchQuery: Ref<string> = ref('');
	const { collateralCheckLoading, responseData, verifyCollateral } = useCollateralVerificiation();
</script>
