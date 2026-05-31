<template>
	<div class="console-layout-spacing">
		<!-- links strip -->
		<div
			class="hide-scrollbar mb-5 h-fit space-x-4 divide-y-2 overflow-x-scroll rounded-lg border-2 bg-white whitespace-nowrap">
			<div class="inline-flex h-28 w-full items-center justify-between p-5 outline-none">
				<div class="flex h-full items-center space-x-3">
					<button
						class="inline-flex h-[70%] w-[50px] items-center justify-center rounded-lg bg-blue-700 outline-none">
						<span
							class="icon-[material-symbols-light--device-reset] text-4xl text-slate-100"></span>
					</button>
					<div>
						<h1 class="text-xl font-semibold text-gray-800">Legacy (Mobi) Reports</h1>
						<h2 class="text-sm text-gray-500">
							Access Reports from Our Older System, Mobi.
						</h2>
					</div>
				</div>
			</div>
		</div>
		<div class="flex flex-1 flex-col">
			<!-- div to show when there is a fetch error -->
			<div
				v-if="fetchLegacyValuationsError"
				class="flex h-full flex-1 flex-col items-center justify-center space-y-4 rounded-lg border bg-white text-sm shadow-sm">
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
				class="flex h-full flex-1 flex-col items-center justify-center space-y-4 rounded-lg border bg-white text-sm shadow-sm"
				v-else-if="fetchLegacyValuationsStatus === 'success' && !corpValuations.length">
				<BirdieNotFoundIcon />
				<h1 class="font-semibold text-gray-500">
					Oops! Seems like you have no valuations!
				</h1>
			</div>

			<!-- div to show when there are authority letters -->
			<div
				class="flex h-full flex-1 flex-col"
				v-else>
				<!-- search and filter controls -->
				<div
					class="tablet:space-x-0 my-2 flex h-fit items-center justify-between space-x-2">
					<!-- search box -->
					<form
						class="tablet:mt-0 tablet:w-[50%] laptop-lg:w-[25%] relative flex h-[50px] w-full items-center justify-between"
						@submit.prevent="executeFetchLegacyValuations()">
						<input
							type="text"
							class="generic-input h-full"
							placeholder="Search registration number."
							v-model="searchTerm" />
						<button
							type="submit"
							class="generic-search-submit-button">
							<SearchIcon />
						</button>
					</form>

					<button
						class="group inline-flex h-[50px] w-fit cursor-pointer items-center justify-center rounded-lg border border-gray-400 px-2 outline-none hover:bg-gray-100"
						data-modal-target="corporate-valuation-filters"
						data-modal-toggle="corporate-valuation-filters"
						type="button"
						@click="setSidebarCollapsedState(false)">
						<span class="text-gray-400">Filters</span>
						<span
							class="icon-[material-symbols-light--filter-alt-sharp] size-7 text-gray-400"></span>
					</button>
				</div>

				<div class="my-3 flex-grow">
					<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
						<table class="w-full text-left text-gray-500">
							<thead class="bg-gray-100 text-sm text-gray-700 uppercase">
								<tr>
									<!-- Details will show client name and their contact -->

									<th
										scope="col"
										class="table-headers tablet:table-cell hidden ps-3">
										Vehicle
									</th>
									<th
										scope="col"
										class="table-headers">
										Inspection Details
									</th>
									<th
										scope="col"
										class="table-headers">
										Vehicle Details
									</th>
									<th
										scope="col"
										class="table-headers laptop:table-cell hidden">
										Note
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
									v-if="fetchLegacyValuationsStatus === 'pending'"
									v-for="a in 10"
									:key="a">
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
											>bookingstage</span
										>
									</td>
									<td></td>
								</tr>

								<!-- the actual data -->
								<tr
									class="border-b bg-white text-sm hover:bg-gray-100"
									v-else
									v-for="(valuation, index) in corpValuations"
									:key="index">
									<td class="tablet:table-cell hidden py-4 ps-3">
										<span>{{ valuation.booking_no }}</span>
										<br />
										<span
											class="w-fit rounded-lg bg-blue-200 px-1 text-blue-600"
											>{{ valuation.reg_no ?? 'Reg N/A' }}</span
										>
									</td>

									<td class="tablet:table-cell py-4">
										<span class="w-fit rounded-lg bg-gray-200 px-1">
											{{ valuation.regent_branch?.branch_name ?? 'N/A' }}
										</span>
										<br />
										<span class="w-fit">{{
											valuation.inspection_date?.split('T')[0] ?? 'Date N/A'
										}}</span>
									</td>
									<th
										scope="row"
										class="flex items-center py-4 whitespace-nowrap text-gray-900">
										<div
											class="flex size-12 items-center justify-center rounded-lg bg-gray-200 text-gray-500">
											<span>{{
												valuation.reg_no?.substring(0, 3) ?? 'Reg N/A'
											}}</span>
										</div>
										<div class="ps-2">
											<div
												class="w-fit rounded-full bg-blue-200 px-1 text-sm text-blue-600">
												{{ valuation.vehicleType }}
											</div>
										</div>
									</th>
									<td
										class="laptop:table-cell hidden w-[18rem] max-w-[18rem] py-4 text-sm text-wrap">
										{{ valuation.inspection_note ?? 'N/A' }}
									</td>
									<td class="py-4 pe-3">
										<button
											:id="'dropdownLeftButton' + index"
											:data-dropdown-toggle="'dropdownLeft' + index"
											data-dropdown-placement="left"
											type="button">
											<MenuKebabIcon />
										</button>

										<!-- Dropdown menu -->
										<div
											:id="'dropdownLeft' + index"
											class="z-10 hidden w-44 rounded-lg border bg-white shadow-md">
											<ul
												class="py-2 text-sm text-gray-500"
												aria-labelledby="dropdownLeftButton">
												<li>
													<button
														class="block w-full px-4 py-2 text-center hover:bg-gray-100"
														type="button"
														:data-modal-target="`view-legacy-report-${valuation.booking_no}-modal`"
														:data-modal-toggle="`view-legacy-report-${valuation.booking_no}-modal`"
														@click="setSidebarCollapsedState(false)">
														See More
													</button>
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
		</div>

		<!-- modal to add filters for table entry -->
		<ParentModal
			modal-title="Filters"
			modal-id="corporate-valuation-filters"
			modal-subtitle="Customize your results"
			ref="corporateModalFiltersRef">
			<form
				@submit.prevent="
					() => {
						manuallyCloseModal();
						executeFetchLegacyValuations();
					}
				"
				class="w-full space-y-3">
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
						v-if="startDate || endDate"
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
						v-if="startDate || endDate"
						class="generic-form-submit w-1/2 border bg-white text-gray-500 shadow-none hover:bg-white">
						Clear Filters
					</button>
				</div>
			</form>
		</ParentModal>

		<!-- Modal to see more details on valuations -->
		<template
			v-if="corpValuations && corpValuations.length > 0"
			v-for="lp in corpValuations"
			:key="lp.booking_no">
			<ParentModal
				modal-title="Legacy Report"
				:modal-subtitle="`${lp.reg_no} Details`"
				:modal-id="`view-legacy-report-${lp.booking_no}-modal`">
				<div class="space-y-4">
					<div class="flex flex-grow flex-col justify-end text-sm">
						<!-- vehicle registration -->
						<span class="text-xl font-semibold text-gray-700">{{
							lp.reg_no ?? 'Reg N/A'
						}}</span>

						<!-- regent branch details -->
						<div class="inline-flex items-center space-x-2 text-gray-700">
							<span
								class="icon-[material-symbols-light--home-outline-rounded] size-6"></span>
							<span class="inline-flex items-center">
								<span class="font-semibold text-gray-800">Regent Branch</span>:
								{{
									lp.regent_branch?.branch_name ?? 'Unknown Regent branch!'
								}}</span
							>
						</div>

						<!-- inspection location -->
						<div class="inline-flex items-center space-x-2 text-gray-700">
							<span
								class="icon-[material-symbols-light--location-on-outline-rounded] size-6"></span>
							<span class="inline-flex items-center">
								<span class="font-semibold text-gray-800">Assessed at</span>:
								{{ lp.valuation_location ?? 'Unknown valuation location!' }}</span
							>
						</div>

						<!-- inspection date -->
						<div class="inline-flex items-center space-x-2 text-gray-700">
							<span
								class="icon-[material-symbols-light--calendar-today-outline-rounded] size-6"></span>
							<span class="inline-flex items-center">
								<span class="font-semibold text-gray-800">Inspected On</span>:
								{{
									lp.inspection_date?.split('T')[0] ?? 'Unknown inspection date!'
								}}</span
							>
						</div>

						<!-- approval date -->
						<div class="inline-flex items-center space-x-2 text-gray-700">
							<span
								class="icon-[material-symbols-light--calendar-today-outline-rounded] size-6"></span>
							<span class="inline-flex items-center">
								<span class="font-semibold text-gray-800">Approved On</span>:
								{{
									lp.approval_date?.split('T')[0] ?? 'Unknown approval date!'
								}}</span
							>
						</div>
					</div>

					<div class="my-3 flex-grow">
						<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
							<table class="w-full text-left text-gray-500">
								<thead class="bg-gray-100 text-sm text-gray-700 uppercase">
									<tr>
										<th
											scope="col"
											class="table-headers tablet:table-cell hidden ps-3">
											Item
										</th>
										<th
											scope="col"
											class="table-headers">
											Details
										</th>
									</tr>
								</thead>
								<tbody>
									<tr class="border-b bg-white text-sm hover:bg-gray-100">
										<td
											class="tablet:table-cell hidden py-2 ps-3 text-blue-600">
											Valuation Type
										</td>
										<td class="tablet:table-cell py-2">
											{{
												lp.valuation_type?.valuation_type_name ?? 'Unknown'
											}}
										</td>
									</tr>

									<tr class="border-b bg-white text-sm hover:bg-gray-100">
										<td
											class="tablet:table-cell hidden py-2 ps-3 text-blue-600">
											Vehicle Make & Type
										</td>
										<td class="tablet:table-cell py-2">
											{{ lp.vehicleMake ?? 'Make unknown' }} -
											{{ lp.vehicleType ?? 'Type unknown' }}
										</td>
									</tr>

									<tr class="border-b bg-white text-sm hover:bg-gray-100">
										<td
											class="tablet:table-cell hidden py-2 ps-3 text-blue-600">
											Vehicle Color
										</td>
										<td class="tablet:table-cell py-2">
											{{ lp.vehicleColor ?? 'Unknown' }}
										</td>
									</tr>

									<tr class="border-b bg-white text-sm hover:bg-gray-100">
										<td
											class="tablet:table-cell hidden py-2 ps-3 text-blue-600">
											Chassis Number
										</td>
										<td class="tablet:table-cell py-2">
											{{ lp.chassisNumber ?? 'Unknown' }}
										</td>
									</tr>

									<tr class="border-b bg-white text-sm hover:bg-gray-100">
										<td
											class="tablet:table-cell hidden py-2 ps-3 text-blue-600">
											Engine Number
										</td>
										<td class="tablet:table-cell py-2">
											{{ lp.engineNumber ?? 'Unknown' }}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<div
						class="mt-4 rounded-lg border border-yellow-300 bg-yellow-50 p-2 text-yellow-800"
						role="alert">
						<div class="flex items-center">
							<svg
								class="me-2 h-4 w-4 shrink-0"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
								viewBox="0 0 20 20">
								<path
									d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
							</svg>
							<span class="sr-only">Info</span>
							<h3 class="text-sm font-medium">Inspection Note</h3>
						</div>

						<p class="my-2 text-sm">
							{{ lp.inspection_note ?? 'No note available!' }}
						</p>
					</div>

					<div class="grid grid-cols-2 gap-2">
						<template
							v-if="cleanAwardedValues(lp.vehicle_value)"
							v-for="e in cleanAwardedValues(lp.vehicle_value)"
							:key="e.id">
							<div
								class="flex h-16 flex-col items-center justify-center rounded-xl border-2 border-blue-500">
								<span class="text-gray-700">{{ e.name }}</span>
								<span class="text-blue-600">{{
									Intl.NumberFormat('en-US', {
										minimumFractionDigits: 0,
										maximumFractionDigits: 0,
									}).format(Number(e.value))
								}}</span>
							</div>
						</template>

						<div
							v-else
							class="flex h-20 items-center justify-center rounded-xl border-2">
							<span class="text-gray-700">No vehicle values awarded yet</span>
						</div>
					</div>
				</div>
			</ParentModal>
		</template>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'vehicle-valuation-legacy-reports',
		layout: 'console-layout',
	});

	const corporateModalFiltersRef = useTemplateRef<{ modalElement: HTMLElement }>(
		'corporateModalFiltersRef',
	);

	function manuallyCloseModal(): void {
		corporateModalFiltersRef.value?.close();
	}

	const {
		page,
		fetchLegacyValuationsStatus,
		fetchLegacyValuationsError,
		corpValuations,
		totalPages,
		startDate,
		endDate,
		searchTerm,
		executeFetchLegacyValuations,
		clearFilters,
		cleanAwardedValues,
	} = useLegacyValuations();
</script>
