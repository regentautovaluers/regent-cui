<template>
	<div class="laptop:p-4 laptop-lg:p-8 flex flex-1 flex-col p-2">
		<!-- div to show when there is a fetch error -->
		<div
			v-if="fetchFraudsterListStatus === 'error'"
			class="flex h-full flex-1 flex-col items-center justify-center space-y-4 text-sm">
			<BirdieNotFoundIcon />
			<h1 class="font-semibold text-gray-500">Failed to load data!</h1>
			<button
				class="inline-flex items-center space-x-2 rounded-lg border bg-transparent px-2 py-1 text-gray-500 hover:text-gray-600"
				@click="refreshPage">
				<span>Refresh</span>
				<RefreshIcon classes="size-5" />
			</button>
		</div>

		<!-- div to show when there are no entries -->
		<div
			class="flex h-full flex-1 flex-col items-center justify-center space-y-4 text-sm"
			v-else-if="fetchFraudsterListStatus === 'success' && fraudsterEntries.length === 0">
			<BirdieNotFoundIcon />
			<h1 class="font-semibold text-gray-500">Oops! Seems like you have no collateral!</h1>
		</div>

		<!-- div to show when there are entries -->
		<div
			class="flex flex-1 flex-col justify-between"
			v-else>
			<!-- filters -->
			<div
				class="flex h-fit items-center justify-between"
				v-if="fetchFraudsterListStatus === 'success' && fraudsterEntries.length > 0">
				<!-- search box -->
				<div
					class="tablet:w-1/2 laptop:w-[45%] laptop-lg:w-[23%] relative flex w-full items-center justify-between">
					<input
						type="text"
						class="generic-input h-[50px]"
						placeholder="Search Registration Number" />
					<button
						type="submit"
						class="generic-search-submit-button">
						<SearchIcon />
					</button>
				</div>
			</div>
			<div class="my-2 flex-grow">
				<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
					<table class="w-full text-left text-gray-500">
						<thead class="bg-gray-100 text-sm text-gray-700 uppercase">
							<tr>
								<th
									scope="col"
									class="table-headers ps-3">
									Vehicle
								</th>
								<th
									scope="col"
									class="table-headers mobile-lg:table-cell hidden">
									Chassis & Eng. No.
								</th>
								<th
									scope="col"
									class="table-headers laptop-lg:table-cell hidden">
									Make & Model
								</th>
								<th
									scope="col"
									class="table-headers tablet:table-cell hidden">
									Incident Date
								</th>
								<th
									scope="col"
									class="table-headers laptop:table-cell hidden">
									Added By
								</th>
								<th
									scope="col"
									class="table-headers pe-3">
									Actions
								</th>
								<th
									scope="col"
									class="table-headers"></th>
							</tr>
						</thead>
						<tbody>
							<!-- loading state -->
							<tr
								class="border-b bg-white hover:bg-gray-100"
								v-if="fetchFraudsterListStatus === 'pending'"
								v-for="a in 10"
								:key="a">
								<td
									scope="row"
									class="px-3 py-4 font-medium whitespace-nowrap text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>username</span
									>
								</td>
								<td class="py-4 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>useremail</span
									>
								</td>
								<td class="mobile-lg:table-cell hidden py-4 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>regenthq</span
									>
								</td>
								<td class="tablet:table-cell hidden py-4 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>domain role</span
									>
								</td>
								<td class="laptop:table-cell hidden py-4 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>domain role</span
									>
								</td>
								<td class="py-4 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300">agency</span>
								</td>
								<td></td>
							</tr>

							<!-- the actual data -->
							<tr
								class="border-b bg-white hover:bg-gray-100"
								v-else
								v-for="(entry, index) in fraudsterEntries"
								:key="index">
								<td
									class="generic-table-cell py-4 ps-3 font-semibold text-blue-600">
									<span>{{ entry.registrationNumber ?? 'Reg No. N/A' }}</span>
									<br />
									<span
										class="w-fit rounded-lg bg-yellow-200 px-1 text-yellow-600">
										{{ entry.color ?? 'Color N/A' }}</span
									>
									<br />
								</td>
								<td class="mobile-lg:table-cell generic-table-cell hidden py-4">
									<span class="w-fit rounded-lg bg-blue-200 px-1 text-blue-600">{{
										entry.chassisNumber ?? 'Chassis No. N/A'
									}}</span>
									<br />
									<span>{{ entry.engineNumber ?? 'Engine No. N/A' }}</span>
								</td>
								<th
									class="generic-table-cell laptop-lg:table-cell hidden space-x-1 py-4">
									<span>{{ entry.make }}</span>
									<span>{{ entry.model }}</span>
								</th>
								<td class="tablet:table-cell generic-table-cell hidden py-4">
									{{ entry.dateOfIncident }}
								</td>
								<td class="generic-table-cell laptop:table-cell hidden py-4">
									<span class="w-fit rounded-lg bg-blue-200 px-1 text-blue-600">{{
										entry.corpClientRepName ?? 'Name N/A'
									}}</span>
									<br />
									<span>{{ entry.corpClientEmail ?? 'Email N/A' }}</span>
								</td>
								<th class="inline-flex items-center space-x-2 py-4 pe-3">
									<button
										class="inline-flex h-9 w-9 items-center justify-center rounded-full border-none bg-green-300 p-2 text-green-600 transition-colors duration-200 outline-none hover:bg-green-400"
										data-modal-target="view-entry-modal"
										data-modal-toggle="view-entry-modal"
										@click="activeEntryIndex = index">
										<span class="oui--expand size-5"></span>
									</button>
									<button
										class="inline-flex h-9 w-9 items-center justify-center rounded-full border-none bg-red-300 p-2 text-red-600 transition-colors duration-200 outline-none hover:bg-red-400"
										data-modal-target="delete-entry-modal"
										data-modal-toggle="delete-entry-modal"
										@click="activeEntryIndex = index">
										<span class="weui--delete-on-filled size-5"></span>
									</button>
								</th>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<!-- page controls -->
			<div
				class="tablet:flex-row tablet:min-h-12 tablet:h-12 mt-5 flex h-16 min-h-16 flex-col items-center justify-between">
				<h1 class="text-sm font-semibold text-gray-500">
					Showing {{ page + 1 }} of {{ totalPages }} pages.
				</h1>
				<div
					class="tablet:w-fit tablet:block flex h-full w-full justify-center space-x-2 md:space-x-4">
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

	<!-- Delete Entry Modal -->
	<ParentModal
		modal-id="delete-entry-modal"
		modal-title="Delete Entry Modal"
		@close-modal="
			() => {
				activeEntryIndex = -1;
			}
		">
		<form
			@submit.prevent="deleteFraudRecord()"
			class="flex flex-col items-center justify-center">
			<p class="text-center text-gray-500">Are you sure you want to delete entry?</p>
			<button
				class="generic-form-submit tablet:w-1/2 mt-4 h-[50px] w-full rounded-full border border-red-600 bg-red-200 text-red-500 hover:bg-red-200 hover:text-red-500">
				<FormSubmissionLoader
					class="mr-2 size-6 animate-spin text-red-500"
					v-if="deleteDefaulterEntryLoading" />
				<span v-else>Proceed</span>
			</button>
		</form>
	</ParentModal>
	<ParentModal
		modal-id="view-entry-modal"
		modal-title="Collateral Entry"
		@close-modal="
			() => {
				activeEntryIndex = -1;
			}
		">
		<EditFraudster
			v-if="fraudsterEntries && activeEntryIndex > -1"
			:collateral-entry="fraudsterEntries[activeEntryIndex]"
			:entry-id="fraudsterEntries[activeEntryIndex].id" />
	</ParentModal>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'collateral-verification-manage-list',
		layout: 'console-layout',
	});

	const {
		fetchFraudsterListStatus,
		executeFetchFraudsterList,
		fetchFraudsterListError,
		fraudsterEntries,
		deleteDefaulterEntryLoading,
		activeEntryIndex,
		totalPages,
		page,
		deleteFraudRecord,
	} = useFraudDetection();
</script>
