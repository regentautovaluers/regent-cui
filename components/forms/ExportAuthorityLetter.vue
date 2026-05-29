<template>
	<form
		class="space-y-2"
		@submit.prevent="
			exportBookings(startDate, endDate, corpId, bookingSource, completed, corpBranchId)
		">
		<!-- duration filters -->
		<div
			class="transtion-colors w-full rounded-lg bg-gray-100 px-3 py-2 duration-200 ease-in-out outline-none hover:bg-gray-200">
			<h1 class="mb-2 text-sm font-semibold text-gray-500">
				Report Period (Limited to 3Mo prior)
			</h1>
			<div
				class="tablet:flex-row tablet:space-y-0 tablet:space-x-2 flex w-full flex-col space-y-2">
				<!-- start date -->
				<div class="tablet:w-1/2 w-full space-y-2">
					<label
						for="cover-period-starts"
						class="generic-input-label generic-input-required-label"
						>Start Date</label
					>
					<input
						type="date"
						id="cover-period-starts"
						class="generic-input"
						placeholder="Select"
						pattern="\d{4}-\d{2}-\d{2}"
						:min="minDate"
						:max="maxDate"
						v-model="startDate" />
				</div>

				<!-- end date -->
				<div class="tablet:w-1/2 w-full space-y-2">
					<label
						for="cover-period-ends"
						class="generic-input-label generic-input-required-label"
						>End Date</label
					>
					<input
						type="date"
						id="cover-period-ends"
						class="generic-input"
						placeholder="Select"
						pattern="\d{4}-\d{2}-\d{2}"
						:min="minDate"
						:max="maxDate"
						v-model="endDate" />
				</div>
			</div>
		</div>

		<!-- source -->
		<div
			class="transtion-colors w-full rounded-lg bg-gray-100 px-3 py-2 duration-200 ease-in-out outline-none hover:bg-gray-200">
			<h1 class="mb-2 text-sm font-semibold text-gray-500">Source of Work</h1>
			<div class="flex h-fit w-full items-center py-2">
				<input
					id="show-only-from-auth-letter"
					type="checkbox"
					:value="'AUTHORITY_LETTER'"
					v-model="bookingSource"
					name="bordered-radio"
					class="size-5 rounded-lg border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500" />
				<label
					for="show-only-from-auth-letter"
					class="3 ms-2 w-full text-sm font-medium text-gray-600"
					>Only include work issued via Authority Letters</label
				>
			</div>
		</div>

		<!-- work completion -->
		<div
			class="transtion-colors w-full rounded-lg bg-gray-100 px-3 py-2 duration-200 ease-in-out outline-none hover:bg-gray-200">
			<h1 class="mb-2 text-sm font-semibold text-gray-500">Report Availability</h1>
			<div class="flex h-fit w-full items-center py-2">
				<input
					id="show-only-completed"
					type="checkbox"
					:value="true"
					v-model="completed"
					name="bordered-radio"
					class="size-5 rounded-lg border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500" />
				<label
					for="show-only-completed"
					class="3 ms-2 w-full text-sm font-medium text-gray-600"
					>Only include completed work with report available</label
				>
			</div>
		</div>

		<!-- target branch -->
		<div
			class="transtion-colors w-full rounded-lg bg-gray-100 px-3 py-2 duration-200 ease-in-out outline-none hover:bg-gray-200">
			<h1 class="mb-2 text-sm font-semibold text-gray-500">
				From Which Branches (Leave Blank for All)
			</h1>
			<div class="relative mt-3">
				<select
					class="generic-input"
					id="user-branch"
					required
					v-model="corpBranchId">
					<option
						:value="null"
						selected="true">
						Select Your Organization's Branch
					</option>
					<option
						v-for="(branch, index) in corporateBranches"
						:key="index"
						:value="branch.branchId">
						{{ branch.branchName + '-' + branch.branchLocation }}
					</option>
				</select>
				<FormSubmissionLoader
					class="absolute top-[52%] right-7 mr-2 size-5 animate-spin text-gray-500"
					v-if="fetchStatus === 'pending'" />
			</div>
		</div>

		<!-- submit button -->
		<button
			type="submit"
			:class="['generic-form-submit', exportBookingsLoading && 'skeleton skeleton-animated']">
			{{ exportBookingsLoading ? 'Please Wait...' : 'Export Data' }}
		</button>
	</form>
</template>

<script setup lang="ts">
	const { getPrincipal } = useAuth();

	const startDate: Ref<string> = ref('');
	const endDate: Ref<string> = ref('');
	const corpId: Ref<string> = ref(getPrincipal()?.corpOrganization.corpId ?? '');
	const bookingSource: Ref<'AUTHORITY_LETTER' | null> = ref(null);
	const completed: Ref<boolean | null> = ref(null);
	const corpBranchId: Ref<string | null> = ref(null);
	const minDate = deriveMinDate(3);
	const maxDate = deriveMaxDate();

	const { exportBookingsLoading, exportBookings } = useExportValuationAssets();
	const { fetchStatus, corporateBranches } = useCorporateBranch();
</script>
