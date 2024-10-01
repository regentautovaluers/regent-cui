<template>
	<div class="flex h-full flex-col">
		<div
			class="flex h-9 w-full items-center space-x-4 font-semibold text-gray-500 md:text-base lg:text-lg">
			<button
				@click="() => (activeView = 0)"
				:class="[
					'border-b-2',
					activeView === 0 ? 'border-b-blue-600 text-blue-600' : 'border-b-inherit',
				]">
				<span>Create Authorization Letter</span>
			</button>
			<button
				@click="() => (activeView = 1)"
				:class="[
					'border-b-2',
					activeView === 1 ? 'border-b-blue-600 text-blue-600' : 'border-b-inherit',
				]">
				<span>View Authorization Letters</span>
			</button>
		</div>
		<div class="flex-grow">
			<CreateAuthorizationLetter
				v-if="activeView === 0"
				@open-search-agent-corp-modal="isSearchCorpBrokersModalOpen = true" />
			<div
				v-if="activeView === 1"
				class="h-[58.5rem]">
				<!-- div to show when there is a fetch error -->
				<div
					class="flex h-full flex-col items-center justify-center space-y-4 rounded-lg border shadow-sm"
					v-if="fetchAuthorityLetterStatus === 'error'">
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
					class="flex h-full flex-col items-center justify-center space-y-4 rounded-lg border shadow-sm"
					v-else-if="
						fetchAuthorityLetterStatus === 'success' && authorityLetters.length === 0
					">
					<BirdieNotFoundIcon />
					<h1 class="font-semibold text-gray-500">
						Oops! Seems like you have no authority letters!
					</h1>
				</div>

				<!-- div to show when there are authority letters -->
				<div
					class="flex h-full flex-col"
					v-else>
					<!-- search & filter controls -->
					<div class="flex h-fit items-center justify-between">
						<form class="relative h-fit w-full md:w-[45%] lg:w-[25%]">
							<input
								type="text"
								class="generic-input"
								placeholder="Search Registration" />
							<button
								type="submit"
								class="absolute right-0 top-0 flex size-14 items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700">
								<SearchIcon />
							</button>
						</form>
						<button
							type="button"
							class="h-14 w-fit items-center justify-center rounded-lg bg-blue-600 px-2 font-semibold text-white hover:bg-blue-700"
							@click.prevent="isExportExcelModalOpen = true">
							Export to Excel
						</button>
					</div>

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
											class="table-headers">
											Policy Number
										</th>
										<th
											scope="col"
											class="table-headers">
											Agency / Broker
										</th>
										<th
											scope="col"
											class="table-headers">
											Authorized By
										</th>
										<th
											scope="col"
											class="table-headers">
											Created On
										</th>
										<th
											scope="col"
											class="table-headers text-center">
											Stage
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
										v-if="fetchAuthorityLetterStatus === 'pending'"
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
												>created today</span
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
										v-for="(letter, index) in authorityLetters"
										:key="index">
										<td
											scope="row"
											class="whitespace-nowrap p-4 font-semibold text-gray-600">
											{{ letter.registrationNumber }}
										</td>
										<td class="inline-flex flex-col p-4">
											<span>{{ letter.clientName }}</span>
											<span
												class="w-fit rounded-lg bg-pink-200 px-1 text-sm text-pink-600"
												>{{ letter.clientPhone }}</span
											>
										</td>
										<td class="p-4 font-semibold text-blue-600">
											{{ letter.policyNumber ?? 'N/A' }}
										</td>
										<td class="p-4">{{ letter.agencyName ?? 'N/A' }}</td>
										<td
											class="max-w-48 overflow-hidden text-ellipsis py-6 text-blue-600">
											{{ letter.authorizedBy.username }}
										</td>
										<td class="p-4 font-semibold">
											{{ letter.createdOn.split(' ')[0] }}
										</td>

										<td
											class="max-w-48 overflow-hidden text-ellipsis py-4 text-center font-semibold text-gray-600">
											{{
												!letter.assessmentStage
													? 'N/A'
													: determineValuationStage(
															letter.assessmentStage,
														)
											}}
										</td>
										<td></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<!-- page controls -->
					<div class="flex h-12 items-center justify-between">
						<h1 class="text-sm font-semibold text-gray-500 md:text-base">
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
	</div>

	<!-- Search Corp or Broker modal -->
	<ParentModal
		modal-id="search-corp-brokers"
		:modal-title="isPrincipalBroker() ? 'Search Corporate' : 'Search Brokers'"
		class="h-[28rem]"
		v-if="isSearchCorpBrokersModalOpen"
		@close-modal="isSearchCorpBrokersModalOpen = false">
		<SearchCorporateOrBroker
			@close-search-agent-corp-modal="isSearchCorpBrokersModalOpen = false" />
	</ParentModal>

	<!-- Search Corp or Broker modal -->
	<ParentModal
		modal-id="search-corp-brokers"
		modal-title="Export to Excel"
		class="h-[18rem]"
		v-if="isExportExcelModalOpen"
		@close-modal="isExportExcelModalOpen = false">
		<ExportAuthorityLetter />
	</ParentModal>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'vehicle-valuation-authorization-letter',
		layout: 'console-layout',
	});

	const activeView = ref(0);
	const isSearchCorpBrokersModalOpen: Ref<boolean> = ref(false);
	const isExportExcelModalOpen: Ref<boolean> = ref(false);
	const { page, totalPages, fetchAuthorityLetterStatus, authorityLetters } =
		useAuthorityLetters();
	const { isPrincipalBroker } = useAuth();
</script>
