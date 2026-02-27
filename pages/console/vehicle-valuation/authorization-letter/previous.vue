<template>
	<div
		class="laptop:p-4 laptop-lg:p-8 flex flex-1 flex-col rounded-lg border-2 bg-white p-2 outline-none">
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
			<NuxtLink
				:to="{ name: 'vehicle-valuation-create-authorization-letter' }"
				class="inline-flex items-center space-x-1 rounded-full bg-blue-600 p-2 text-sm font-semibold text-white outline-none">
				<span class="icon-[material-symbols-light--add-2-rounded] size-5 text-white"></span>
				<span>Create One</span>
			</NuxtLink>
		</div>

		<!-- div to show when there are authority letters -->
		<div
			class="flex flex-1 flex-col justify-between"
			v-else>
			<!-- search & filter controls -->
			<div
				class="tablet:space-x-0 tablet:flex-row mt-2 flex flex-col justify-between space-y-2">
				<form
					class="tablet:mt-0 tablet:w-[50%] laptop-lg:w-[25%] relative flex h-[50px] w-full items-center justify-between"
					@submit.prevent="handleSearchTriggered(searchRegNo)">
					<input
						type="text"
						class="generic-input h-full"
						placeholder="Search Registration"
						required
						v-model="searchRegNo" />
					<button
						type="submit"
						class="generic-search-submit-button">
						<SearchIcon />
					</button>
				</form>
				<div class="flex space-x-2">
					<button
						data-modal-target="search-authority-letters-filter-modal"
						data-modal-toggle="search-authority-letters-filter-modal"
						type="button"
						class="filter-button text-gray-600"
						@click="setSidebarCollapsedState(false)">
						<span class="icon-[material-symbols-light--filter-list] size-7"></span>
					</button>
					<button
						data-modal-target="export-authority-letters-modal"
						data-modal-toggle="export-authority-letters-modal"
						type="button"
						class="filter-button flex-grow text-gray-600"
						@click="setSidebarCollapsedState(false)">
						<span class="icon-[material-symbols-light--downloading] size-7 mr-1"></span>
						<span>Export Report</span>
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
								<td class="w-52 py-4 ps-3">
									<span
										class="w-fit rounded-lg border-[1px] border-pink-300 bg-pink-200 px-1 text-sm text-pink-600"
										>{{ letter.registrationNumber }}</span
									>
									<br />
									<span class="text-sm">{{ letter.policyNumber ?? 'N/A' }}</span>
								</td>
								<td class="mobile-lg:table-cell hidden w-64 py-4">
									<span>{{ letter.clientName }}</span>
									<br />
									<span
										class="w-fit rounded-lg border-[1px] border-blue-300 bg-blue-200 px-1 text-sm text-blue-600"
										>{{ letter.clientPhone }}</span
									>
								</td>
								<td class="tablet:table-cell hidden w-72 py-4 text-wrap">
									{{ letter.agencyName ?? 'N/A' }}
								</td>
								<td class="tablet:table-cell hidden w-64 py-4">
									<span
										class="w-fit rounded-lg border-[1px] border-yellow-300 bg-yellow-200 px-1 text-sm text-yellow-600"
										>{{ letter.authorizedBy?.username ?? 'Name N/A' }}</span
									>
									<br />
									<span>{{ letter.createdOn?.split(' ')[0] ?? 'Date N/A' }}</span>
								</td>
								<td
									class="laptop:table-cell hidden w-44 overflow-hidden py-4 text-wrap text-gray-600">
									{{
										(letter.assessmentStage as string)
											?.toLowerCase()
											.replaceAll('_', ' ') ?? 'instructions received'
									}}
								</td>
								<td class="laptop:table-cell hidden py-4 text-sm text-wrap">
									{{ letter.feedback ?? 'N/A' }}
								</td>
								<td class="w-20">
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
										class="z-10 hidden w-44 rounded-lg border bg-white shadow-md">
										<ul
											class="space-y-2 divide-y-[1px] divide-gray-300 py-2 text-sm text-gray-500"
											aria-labelledby="dropdownLeftButton">
											<li>
												<button
													class="block w-full px-4 py-2 text-center hover:bg-gray-100"
													type="button"
													:data-modal-target="`extended-letter-${letter.letterId}`"
													:data-modal-toggle="`extended-letter-${letter.letterId}`"
													@click="setSidebarCollapsedState(false)">
													Edit Details
												</button>
											</li>
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

		<!--  export letters -->
		<ParentModal
			modal-id="export-authority-letters-modal"
			modal-title="Export Letters">
			<ExportAuthorityLetter />
		</ParentModal>

		<!-- filter modal -->
		<ParentModal
			modal-title="Filters"
			modal-id="search-authority-letters-filter-modal"
			modal-subtitle="Customize your results"
			ref="authorityLettersModalFiltersRef">
			<form
				@submit.prevent="
					() => {
						manuallyCloseModal();
						executeGetAuthorityLetters();
					}
				"
				class="w-full space-y-3">
				<div
					class="transtion-colors w-full rounded-lg bg-gray-100 px-3 py-2 duration-200 ease-in-out outline-none hover:bg-gray-200">
					<h1 class="mb-2 text-xs font-semibold text-gray-500">With Valuations</h1>
					<div class="flex h-fit w-full items-center py-2">
						<input
							id="show-tampered-vehicles"
							type="checkbox"
							:value="true"
							v-model="onlyOngoing"
							name="bordered-radio"
							class="size-5 rounded-lg border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500" />
						<label
							for="show-tampered-vehicles"
							class="3 ms-2 w-full text-sm font-medium text-gray-600"
							>Only include letters where valuation has started or has ended</label
						>
					</div>
				</div>

				<div
					class="transtion-colors w-full rounded-lg bg-gray-100 px-3 py-2 duration-200 ease-in-out outline-none hover:bg-gray-200">
					<h1 class="mb-2 text-xs font-semibold text-gray-500">Report Period</h1>
					<div
						class="tablet:flex-row tablet:space-y-0 tablet:space-x-2 flex w-full flex-col space-y-2">
						<!-- start date -->
						<div class="tablet:w-1/2 w-full space-y-2">
							<label
								for="cover-period-starts"
								class="generic-input-label text-xs"
								>Start Date</label
							>
							<input
								type="date"
								id="cover-period-starts"
								class="generic-input"
								placeholder="Select"
								pattern="\d{4}-\d{2}-\d{2}"
								v-model="startDate" />
						</div>

						<!-- end date -->
						<div class="tablet:w-1/2 w-full space-y-2">
							<label
								for="cover-period-ends"
								class="generic-input-label text-xs"
								>End Date</label
							>
							<input
								type="date"
								id="cover-period-ends"
								class="generic-input"
								placeholder="Select"
								pattern="\d{4}-\d{2}-\d{2}"
								v-model="endDate" />
						</div>
					</div>
				</div>

				<div class="mt-2 flex w-full justify-center space-x-3">
					<!-- submit button -->
					<button
						type="submit"
						v-if="startDate || endDate || onlyOngoing"
						class="generic-form-submit w-1/2">
						Apply
					</button>

					<!-- clear filters -->
					<button
						type="button"
						@click="
							() => {
								manuallyCloseModal();
								clearFilters();
							}
						"
						v-if="startDate || endDate || onlyOngoing"
						class="generic-form-submit w-1/2 border bg-white text-gray-500 shadow-none hover:bg-white">
						Clear Filters
					</button>
				</div>
			</form>
		</ParentModal>

		<!-- extra info on auth -->
		<template v-if="authorityLetters.length > 0">
			<ParentModal
				v-for="(letter, index) in authorityLetters"
				modal-title="Autority Letter"
				:key="index"
				:modal-id="`extended-letter-${letter.letterId}`"
				:modal-subtitle="`For vehicle ${letter.registrationNumber}`"
				modal-size="large">
				<AuthorityLetterDetailsForm :authority-letter="letter" />
			</ParentModal>
		</template>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'vehicle-valuation-view-authorization-letter',
		layout: 'console-layout',
	});

	const authorityLettersModalFiltersRef = useTemplateRef<{ modalElement: HTMLElement }>(
		'authorityLettersModalFiltersRef',
	);

	function manuallyCloseModal(): void {
		authorityLettersModalFiltersRef.value?.close();
	}

	const {
		page,
		totalPages,
		fetchAuthorityLetterStatus,
		fetchAuthorityLetterError,
		authorityLetters,
		searchRegNo,
		startDate,
		endDate,
		onlyOngoing,
		handleSearchTriggered,
		executeGetAuthorityLetters,
		clearFilters,
	} = useAuthorityLetters();
</script>
