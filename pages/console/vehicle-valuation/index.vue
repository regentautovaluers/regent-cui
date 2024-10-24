<template>
	<div class="flex h-full flex-col">
		<div
			class="flex h-fit items-center justify-between"
			v-if="fetchValuationsStatus === 'success' && corpValuations.length > 0">
			<div class="space-x-4 font-semibold text-gray-500 md:text-base lg:text-lg">
				<button
					@click="() => (activeView = 'pending')"
					:class="[
						'border-b-2',
						activeView === 'pending'
							? 'border-b-blue-600 text-blue-600'
							: 'border-b-inherit',
					]">
					<span>Pending</span>
				</button>
				<button
					@click="() => (activeView = 'complete')"
					:class="[
						'border-b-2',
						activeView == 'complete'
							? 'border-b-blue-600 text-blue-600'
							: 'border-b-inherit',
					]">
					<span>Completed</span>
				</button>
			</div>

			<!-- search box -->
			<div class="relative flex w-full items-center justify-between md:w-[45%] lg:w-[23%]">
				<input
					type="text"
					class="generic-input"
					placeholder="Search Registration Number" />
				<button
					type="submit"
					class="absolute right-0 top-0 flex size-14 items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700">
					<SearchIcon />
				</button>
			</div>

			<!-- other filters -->
			<div class="h-full">
				<button
					class="table-filter-buttons"
					@click.prevent="isFilterFormOpen = true">
					Filters<FilterIcon class="text-xl" />
				</button>
			</div>
		</div>

		<div class="min-h-[53rem]">
			<!-- div to show when there is a fetch error -->
			<div
				v-if="fetchValuationsStatus === 'error'"
				class="mt-2 flex h-full flex-col items-center justify-center space-y-4 rounded-lg border shadow-sm">
				<BirdieNotFoundIcon />
				<h1 class="font-semibold text-gray-500">Failed to load data!</h1>
				<button
					class="inline-flex items-center space-x-2 rounded-lg border bg-transparent px-2 py-1 text-gray-500 hover:text-gray-600"
					@click="refreshPage">
					<span>Refresh</span>
					<RefreshIcon classes="size-6" />
				</button>
			</div>

			<!-- div to show when there are no authorization letters -->
			<div
				class="mt-2 flex h-full flex-col items-center justify-center space-y-4 rounded-lg border shadow-sm"
				v-else-if="fetchValuationsStatus === 'success' && corpValuations.length === 0">
				<BirdieNotFoundIcon />
				<h1 class="font-semibold text-gray-500">
					Oops! Seems like you have no valuations!
				</h1>
			</div>

			<!-- div to show when there are authority letters -->
			<div
				class="flex h-full flex-col"
				v-else>
				<!-- search & filter controls -->

				<div class="my-2 flex-grow">
					<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
						<table class="w-full text-left text-gray-500">
							<thead class="bg-gray-100 text-sm uppercase text-gray-700">
								<tr>
									<th
										scope="col"
										class="table-headers">
										Reg No.
									</th>
									<!-- Details will show client name and their contact -->
									<th
										scope="col"
										class="table-headers">
										Client Details
									</th>
									<th
										scope="col"
										class="table-headers text-start">
										Progress
									</th>
									<th
										scope="col"
										class="table-headers">
										Make & Model
									</th>
									<th
										scope="col"
										class="table-headers">
										Booking Date
									</th>
									<th
										scope="col"
										class="table-headers">
										Regent Location
									</th>
									<th
										scope="col"
										class="table-headers"
										v-if="activeView == 'complete'">
										Value
									</th>
									<th
										scope="col"
										class="table-headers"
										v-if="activeView == 'complete'">
										Note Value
									</th>

									<th
										scope="col"
										class="table-headers" />
								</tr>
							</thead>
							<tbody>
								<!-- loading state -->
								<tr
									class="border-b bg-white hover:bg-gray-100"
									v-if="fetchValuationsStatus === 'pending'"
									v-for="a in 10"
									:key="a">
									<td
										scope="row"
										class="whitespace-nowrap p-6 font-medium text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>username</span
										>
									</td>
									<td class="p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>useremail</span
										>
									</td>
									<td class="p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>bookedtoday</span
										>
									</td>
									<td class="p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>regenthq</span
										>
									</td>
									<td class="p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>domain role</span
										>
									</td>
									<td class="p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>agency</span
										>
									</td>
									<td class="p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>authorizedby</span
										>
									</td>
									<td class="p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>bookingstage</span
										>
									</td>
									<td></td>
								</tr>
								<tr
									class="border-b bg-white hover:bg-gray-100"
									v-else
									v-for="(valuation, index) in corpValuations"
									:key="index">
									<td
										scope="row"
										class="whitespace-nowrap p-4 font-semibold text-gray-600">
										{{ valuation.regNo }}
									</td>
									<td class="inline-flex flex-col p-4">
										<span>{{ valuation.clientName }}</span>
										<span
											class="w-fit rounded-lg bg-pink-200 px-1 text-sm text-pink-600"
											>{{ valuation.clientPhone }}</span
										>
									</td>
									<td class="p-4 font-semibold text-blue-600">
										{{ determineValuationStage(valuation.valuationStage) }}
									</td>
									<td class="inline-flex flex-col p-4">
										<span>{{ valuation.vehicleMake ?? 'N/A' }}</span>
										<span
											class="w-fit rounded-lg bg-blue-200 px-1 text-sm text-blue-600"
											>{{ valuation.vehicleModel ?? 'N/A' }}</span
										>
									</td>
									<td class="p-4 font-semibold text-blue-600">
										{{ valuation.bookingDate.split('T')[0] }}
									</td>
									<td class="p-4 font-semibold text-gray-600">
										{{ valuation.regentBranch.branchName }}
									</td>
									<td v-if="activeView == 'complete'"></td>
									<td v-if="activeView == 'complete'"></td>
									<td></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<!-- page controls -->
				<div class="flex h-12 items-center justify-between">
					<h1 class="text-sm font-semibold text-gray-500 md:text-base">
						Showing {{ 1 }} of {{ totalPages }} pages.
					</h1>
					<div class="h-full space-x-2 md:space-x-4">
						<button
							class="table-page-buttons"
							@click="page -= 1"
							:disabled="page === 0 || totalPages == 1">
							Previous
						</button>
						<button
							class="table-page-buttons"
							@click="page += 1"
							:disabled="page === totalPages - 1 || totalPages == 1">
							Next
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Search Corp or Broker modal -->
	<ParentModal
		modal-id="all-valuation-filters"
		modal-title="Results Filters"
		class="h-[18rem]"
		v-if="isFilterFormOpen"
		@close-modal="isFilterFormOpen = false">
		<form class="w-full">
			<InformationChip>
				<p class="text-sm font-semibold text-gray-500">
					Select the dates between which you want to filter results.
				</p>
			</InformationChip>
			<div>
				<label
					for="letter-start-date"
					class="generic-input-label generic-input-required-label"
					>Start Date</label
				>
				<input
					type="date"
					id="letter-start-date"
					class="generic-input"
					placeholder="Enter Customer Name as Seen In Their National ID"
					pattern="\d{4}-\d{2}-\d{2}"
					required
					v-model="startDate" />
			</div>

			<!-- Ending date Field -->
			<div>
				<label
					for="letter-end-date"
					class="generic-input-label generic-input-required-label"
					>End Date</label
				>
				<input
					type="date"
					id="letter-end-date"
					class="generic-input"
					placeholder="Enter Customer Name as Seen In Their National ID"
					pattern="\d{4}-\d{2}-\d{2}"
					required
					v-model="endDate" />
			</div>

			<!-- submit button -->
			<button
				type="submit"
				class="generic-form-submit mt-3">
				Apply Filters
			</button>
		</form>
	</ParentModal>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'vehicle-valuation-home',
		layout: 'console-layout',
	});

	const {
		activeView,
		fetchValuationsStatus,
		corpValuations,
		totalPages,
		page,
		executeFetchValuations,
	} = useCorporateValuations();
	const isFilterFormOpen: Ref<boolean> = ref(false);
	const startDate: Ref<string> = ref('');
	const endDate: Ref<string> = ref('');
</script>
