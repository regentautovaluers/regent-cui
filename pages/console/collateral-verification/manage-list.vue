<template>
	<div class="flex h-full min-h-full flex-col">
		<!-- filters -->
		<div
			class="flex h-fit items-center justify-between"
			v-if="fetchFraudsterListStatus === 'success' && fraudsterEntries.length > 0">
			<!-- search box -->
			<div
				class="laptop:w-[45%] laptop-lg:w-[23%] relative flex w-full items-center justify-between">
				<input
					type="text"
					class="generic-input"
					placeholder="Search Registration Number" />
				<button
					type="submit"
					class="generic-search-submit-button">
					<SearchIcon />
				</button>
			</div>
		</div>
		<div class="h-full">
			<!-- div to show when there is a fetch error -->
			<div
				v-if="fetchFraudsterListStatus === 'error'"
				class="mt-2 flex h-full flex-col items-center justify-center space-y-4">
				<BirdieNotFoundIcon />
				<h1 class="font-semibold text-gray-500">Failed to load data!</h1>
				<button
					class="inline-flex items-center space-x-2 rounded-lg border bg-transparent px-2 py-1 text-gray-500 hover:text-gray-600"
					@click="refreshPage">
					<span>Refresh</span>
					<RefreshIcon classes="size-6" />
				</button>
			</div>

			<!-- div to show when there are no entries -->
			<div
				class="mt-2 flex h-full flex-col items-center justify-center space-y-4"
				v-else-if="fetchFraudsterListStatus === 'success' && fraudsterEntries.length === 0">
				<BirdieNotFoundIcon />
				<h1 class="font-semibold text-gray-500">
					Oops! Seems like you have no collateral!
				</h1>
			</div>

			<!-- div to show when there are fraud entries -->
			<div
				class="flex h-full flex-col"
				v-else>
				<div class="my-2 flex-grow">
					<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
						<table class="w-full text-left text-gray-500">
							<thead class="bg-gray-100 text-sm text-gray-700 uppercase">
								<tr>
									<th
										scope="col"
										class="table-headers">
										Reg No.
									</th>
									<th
										scope="col"
										class="table-headers">
										Color
									</th>
									<th
										scope="col"
										class="table-headers">
										Chassis No.
									</th>
									<th
										scope="col"
										class="table-headers">
										Engine No.
									</th>
									<th
										scope="col"
										class="table-headers">
										Make & Model
									</th>
									<th
										scope="col"
										class="table-headers">
										Incident Date
									</th>
									<th
										scope="col"
										class="table-headers">
										Actions
									</th>
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
										class="p-6 font-medium whitespace-nowrap text-gray-300">
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
											>useremail</span
										>
									</td>
									<td class="p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>useremail</span
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
									<td></td>
								</tr>

								<!-- the actual data -->
								<tr
									class="border-b bg-white hover:bg-gray-100"
									v-else
									v-for="(entry, index) in fraudsterEntries"
									:key="index">
									<td class="generic-table-cell p-5 font-semibold text-blue-600">
										{{ entry.registrationNumber }}
									</td>
									<td class="generic-table-cell p-5">
										{{ entry.color }}
									</td>
									<td class="generic-table-cell p-5">
										{{ entry.chassisNumber }}
									</td>
									<td class="generic-table-cell p-5 font-semibold text-pink-600">
										{{ entry.engineNumber }}
									</td>
									<th class="generic-table-cell inline-flex space-x-1 p-5">
										<span>{{ entry.make }}</span>
										<span>{{ entry.model }}</span>
									</th>
									<td class="generic-table-cell p-5">
										{{ entry.dateOfIncident }}
									</td>
									<th class="inline-flex items-center space-x-2 p-4">
										<NuxtLink
											class="rounded-full border-none bg-green-300 p-2 text-green-600 transition-colors duration-200 outline-none hover:bg-green-400">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="18"
												height="18"
												viewBox="0 0 24 24">
												<g
													fill="none"
													stroke="currentColor"
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="1.5"
													color="currentColor">
													<path
														d="M21.544 11.045c.304.426.456.64.456.955c0 .316-.152.529-.456.955C20.178 14.871 16.689 19 12 19c-4.69 0-8.178-4.13-9.544-6.045C2.152 12.529 2 12.315 2 12c0-.316.152-.529.456-.955C3.822 9.129 7.311 5 12 5c4.69 0 8.178 4.13 9.544 6.045" />
													<path d="M15 12a3 3 0 1 0-6 0a3 3 0 0 0 6 0" />
												</g>
											</svg>
										</NuxtLink>
										<NuxtLink
											class="rounded-full border-none bg-blue-300 p-2 text-blue-600 transition-colors duration-200 outline-none hover:bg-blue-400">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="18"
												height="18"
												viewBox="0 0 24 24">
												<path
													fill="currentColor"
													d="M4 21q-.425 0-.712-.288T3 20v-2.425q0-.4.15-.763t.425-.637L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.437.65T21 6.4q0 .4-.138.763t-.437.662l-12.6 12.6q-.275.275-.638.425t-.762.15zM17.6 7.8L19 6.4L17.6 5l-1.4 1.4z" /></svg></NuxtLink
										><button
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
				<div class="mt-5 flex min-h-12 items-center justify-between">
					<h1 class="text-sm font-semibold text-gray-500">
						Showing {{ page + 1 }} of {{ totalPages }} pages.
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

	<!-- Delete Entry Modal -->
	<ParentModal
		modal-id="delete-entry-modal"
		modal-title="Delete Entry Modal">
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
