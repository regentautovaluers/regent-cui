<template>
	<div class="laptop:p-4 laptop-lg:p-8 flex flex-1 flex-col p-2">
		<!-- div to show when there is a fetch error -->
		<div
			class="flex h-full flex-1 flex-col items-center justify-center space-y-4 text-sm"
			v-if="fetchAuthorityLetterError">
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
			class="flex h-full flex-1 flex-col items-center justify-center space-y-4 text-sm"
			v-else-if="fetchAuthorityLetterStatus === 'success' && authorityLetters.length === 0">
			<BirdieNotFoundIcon />
			<h1 class="font-semibold text-gray-500">
				Oops! Seems like you have no authority letters!
			</h1>
		</div>

		<!-- div to show when there are authority letters -->
		<div
			class="flex flex-1 flex-col justify-between"
			v-else>
			<!-- search & filter controls -->
			<div class="flex h-fit flex-col space-y-2">
				<div
					class="tablet:space-x-0 mt-2 flex h-fit items-center justify-between space-x-2">
					<form
						class="tablet:mt-0 tablet:w-[50%] laptop-lg:w-[25%] relative flex h-[50px] w-full items-center justify-between"
						@submit.prevent="handleSearchTriggered(searchPhrase)">
						<input
							type="text"
							class="generic-input h-full"
							placeholder="Search Registration"
							required
							v-model="searchPhrase" />
						<button
							type="submit"
							class="generic-search-submit-button">
							<SearchIcon />
						</button>
					</form>
					<button
						data-modal-target="export-authority-letters-modal"
						data-modal-toggle="export-authority-letters-modal"
						type="button"
						class="group inline-flex h-[50px] w-14 cursor-pointer items-center justify-center rounded-lg border border-gray-400 p-1 outline-none hover:bg-gray-100"
						@click.prevent="isExportExcelModalOpen = true">
						<span class="ph--microsoft-excel-logo-thin size-7 text-gray-400"></span>
					</button>
				</div>
				<button
					v-if="searchRegNo !== ''"
					@click="
						() => {
							searchRegNo = '';
							searchPhrase = '';
						}
					"
					class="w-fit rounded-full border border-gray-500 bg-transparent px-2 py-1 text-sm font-semibold text-gray-500 shadow hover:bg-gray-200">
					Clear Filters
				</button>
			</div>

			<div class="my-2 flex-grow">
				<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
					<table class="w-full text-left text-gray-500">
						<thead class="bg-gray-100 text-sm text-gray-700 uppercase">
							<tr>
								<th
									scope="col"
									class="table-headers ps-3">
									Reg & Policy No.
								</th>
								<!-- Details will show client name and their contact -->
								<th
									scope="col"
									class="table-headers mobile-lg:table-cell hidden">
									Client
								</th>
								<th
									scope="col"
									class="table-headers tablet:table-cell hidden">
									Agency / Broker
								</th>
								<th
									scope="col"
									class="table-headers tablet:table-cell hidden">
									Authorized By
								</th>
								<th
									scope="col"
									class="table-headers laptop:table-cell hidden">
									Progress
								</th>
								<th
									scope="col"
									class="table-headers laptop:table-cell hidden pe-3">
									Feedback
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
								v-if="fetchAuthorityLetterStatus === 'pending'"
								v-for="a in 10"
								:key="a">
								<td
									scope="row"
									class="p-6 font-medium whitespace-nowrap text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>username</span
									>
								</td>
								<td class="mobile-lg:table-cell hidden p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>useremail</span
									>
								</td>
								<td class="tablet:table-cell hidden p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>regenthq</span
									>
								</td>
								<td class="tablet:table-cell hidden p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>domain role</span
									>
								</td>
								<td class="laptop:table-cell hidden p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>authorizedby</span
									>
								</td>
								<td class="laptop:table-cell hidden p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>created today</span
									>
								</td>
								<td class="p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>bookingstage</span
									>
								</td>
							</tr>
							<tr
								class="border-b bg-white text-sm hover:bg-gray-100"
								v-else
								v-for="(letter, index) in authorityLetters"
								:key="index">
								<td class="py-4 ps-3">
									<span
										class="w-fit rounded-lg bg-pink-200 px-1 text-sm text-pink-600"
										>{{ letter.registrationNumber }}</span
									>
									<br />
									<span class="text-sm">{{ letter.policyNumber ?? 'N/A' }}</span>
								</td>
								<td class="mobile-lg:table-cell hidden py-4">
									<span>{{ letter.clientName }}</span>
									<br />
									<span
										class="w-fit rounded-lg bg-blue-200 px-1 text-sm text-blue-600"
										>{{ letter.clientPhone }}</span
									>
								</td>
								<td class="tablet:table-cell hidden py-4">
									{{ letter.agencyName ?? 'N/A' }}
								</td>
								<td class="tablet:table-cell hidden py-4">
									<span
										class="w-fit rounded-lg bg-pink-200 px-1 text-sm text-pink-600"
										>{{ letter.authorizedBy.username }}</span
									>
									<br />
									<span>{{ letter.createdOn.split(' ')[0] }}</span>
								</td>
								<td
									class="laptop:table-cell hidden max-w-24 overflow-hidden py-4 text-wrap text-gray-600">
									{{
										(letter.assessmentStage as string)
											?.toLowerCase()
											.replaceAll('_', ' ') ?? 'instructions received'
									}}
								</td>
								<td
									class="laptop:table-cell hidden w-48 max-w-48 py-4 text-sm text-wrap">
									{{ letter.feedback ?? 'N/A' }}
								</td>
								<td>
									<button
										:id="'dropdownLeftButton' + index"
										:data-dropdown-toggle="'dropdownLeft' + index"
										data-dropdown-placement="left"
										type="button">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="1em"
											height="1em"
											viewBox="0 0 16 16"
											class="size-6">
											<MenuKebabIcon />
										</svg>
									</button>
									<!-- Dropdown menu -->
									<div
										:id="'dropdownLeft' + index"
										class="z-10 hidden w-44 divide-y divide-gray-100 rounded-lg border bg-white shadow-md">
										<ul
											class="py-2 text-sm text-gray-500"
											aria-labelledby="dropdownLeftButton">
											<li v-if="letter.reportURL == null">
												<button
													class="block w-full bg-gray-100 px-4 py-2 text-center"
													type="button">
													Report N/A
												</button>
											</li>
											<li v-else>
												<NuxtLink
													:to="{
														name: 'vehicle-valuation-report',
														params: {
															valuation_id: letter.letterId,
														},
													}"
													class="block w-full px-4 py-2 text-center hover:bg-gray-100"
													type="button">
													View Report
												</NuxtLink>
											</li>
										</ul>
									</div>
								</td>
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

		<ParentModal
			modal-id="export-authority-letters-modal"
			modal-title="Export Letters">
			<ExportAuthorityLetter />
		</ParentModal>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'vehicle-valuation-view-authorization-letter',
		layout: 'console-layout',
	});

	const searchPhrase: Ref<string> = ref('');
	const isExportExcelModalOpen: Ref<boolean> = ref(false);
	const {
		page,
		totalPages,
		fetchAuthorityLetterStatus,
		fetchAuthorityLetterError,
		authorityLetters,
		searchRegNo,
		handleSearchTriggered,
	} = useAuthorityLetters();
</script>
