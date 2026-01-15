<template>
	<div class="console-layout-spacing flex flex-1 flex-col">
		<div class="mb-2 flex items-center space-x-3 font-semibold text-gray-500">
			<button
				@click="() => (activeView = 'pending')"
				:class="[
					'tablet:text-base border-b-2 text-sm',
					activeView == 'pending'
						? 'border-b-blue-600 text-blue-600'
						: 'border-b-inherit',
				]">
				<span>Ongoing</span>
			</button>
			<button
				@click="() => (activeView = 'complete')"
				:class="[
					'tablet:text-base border-b-2 text-sm',
					activeView === 'complete'
						? 'border-b-blue-600 text-blue-600'
						: 'border-b-inherit',
				]">
				<span>Completed</span>
			</button>
		</div>

		<!-- div to show when there is a fetch error -->
		<div
			v-if="fetchValuationsError"
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
			v-else-if="fetchValuationsStatus === 'success' && !corpValuations.length">
			<BirdieNotFoundIcon />
			<h1 class="font-semibold text-gray-500">Oops! Seems like you have no valuations!</h1>
		</div>

		<!-- div to show when there are authority letters -->
		<div
			class="flex h-full flex-1 flex-col"
			v-else>
			<!-- search and filter controls -->
			<div class="tablet:space-x-0 my-2 flex h-fit items-center justify-between space-x-2">
				<!-- search box -->
				<form
					class="tablet:mt-0 tablet:w-[50%] laptop-lg:w-[25%] relative flex h-[50px] w-full items-center justify-between"
					@submit.prevent="executeFetchValuations()">
					<input
						type="text"
						class="generic-input h-full"
						placeholder="Search registration number."
						v-model="searchRegNo" />
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
									Client Details
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
									class="table-headers desktop-4k:table-cell hidden">
									Progress
								</th>
								<th
									scope="col"
									class="table-headers laptop:table-cell hidden"
									v-if="activeView == 'pending'">
									Pending
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
								v-if="fetchValuationsStatus === 'pending'"
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
									<span class="animate-pulse rounded-lg bg-gray-300">agency</span>
								</td>
								<td class="p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>authorizedby</span
									>
								</td>
								<td
									class="p-6 text-gray-300"
									v-if="activeView == 'pending'">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>bookingstage</span
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
									<span>{{ valuation.clientName }}</span>
									<br />
									<span class="w-fit rounded-lg bg-blue-200 px-1 text-blue-600">{{
										valuation.clientPhone ?? 'Phone N/A'
									}}</span>
								</td>

								<td class="tablet:table-cell py-4">
									<span class="w-fit">{{
										valuation.inspectionDate?.split('T')[0] ?? 'Date N/A'
									}}</span>
									<br />
									<span class="w-fit rounded-lg bg-gray-200 px-1">{{
										valuation.regentBranch.branchName
									}}</span>
								</td>
								<th
									scope="row"
									class="flex items-center py-4 whitespace-nowrap text-gray-900">
									<img
										class="size-12 rounded-lg object-cover"
										:src="valuation.vehicleImage"
										alt="Vehicle Image"
										v-if="valuation.vehicleImage" />
									<div
										v-else
										class="flex size-12 items-center justify-center rounded-lg bg-gray-200 text-gray-500">
										<span>{{
											valuation.regNo?.substring(0, 3) ?? 'Reg N/A'
										}}</span>
									</div>
									<div class="ps-2">
										<div
											class="w-fit rounded-full bg-blue-200 px-1 text-sm text-blue-600">
											{{ valuation.regNo }}
										</div>
										<div class="font-normal text-gray-500">
											{{ valuation.vehicleMake ?? 'Make N/A' }}
										</div>
									</div>
								</th>
								<td class="desktop-4k:table-cell hidden max-w-24 py-4 text-sm">
									<span class="w-fit">{{
										(valuation.valuationStage as string)
											?.toLowerCase()
											.replaceAll('_', ' ') ?? 'N/A'
									}}</span>
								</td>
								<td
									class="laptop:table-cell hidden w-44 max-w-44 py-4 text-xs text-wrap"
									v-if="activeView == 'pending'">
									{{ valuation.pending ?? 'None' }}
								</td>
								<td
									class="laptop:table-cell hidden w-48 max-w-48 py-4 text-sm text-wrap">
									{{ valuation.inspectionNote ?? 'N/A' }}
								</td>
								<td class="py-4 pe-3">
									<button
										:id="'dropdownLeftButton' + index"
										:data-dropdown-toggle="'dropdownLeft' + index"
										data-dropdown-placement="left"
										type="button"
										v-if="activeView == 'complete'">
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
													v-if="
														valuation.reportURL == null ||
														determineValuationStage(
															valuation.valuationStage,
														)?.status == 'Ongoing'
													"
													class="block w-full bg-gray-100 px-4 py-2 text-center"
													type="button">
													Report N/A
												</button>
												<NuxtLink
													v-else
													:to="{
														name: 'vehicle-valuation-report',
														params: {
															valuation_id: valuation.valuationId,
														},
													}"
													class="block w-full px-4 py-2 text-center hover:bg-gray-100"
													type="button">
													View Report
												</NuxtLink>
											</li>
											<li>
												<button
													v-if="
														valuation.reportURL == null ||
														determineValuationStage(
															valuation.valuationStage,
														)?.status == 'Ongoing'
													"
													class="block w-full bg-gray-100 px-4 py-2 text-center"
													type="button">
													Report N/A
												</button>
												<button
													v-else
													class="block w-full px-4 py-2 text-center hover:bg-gray-100"
													type="button"
													:data-modal-target="`view-valuation-${valuation.valuationId}-report`"
													:data-modal-toggle="`view-valuation-${valuation.valuationId}-report`"
													@click="
														() => {
															setSidebarCollapsedState(false);
															downloadReport(valuation.reportURL);
														}
													">
													View Report B
												</button>
											</li>
											<li
												v-if="
													valuation.reportURL != null &&
													determineValuationStage(
														valuation.valuationStage,
													)?.status == 'Completed'
												">
												<a
													target="_self"
													:href="valuation.reportURL"
													class="block w-full px-4 py-2 text-center hover:bg-gray-100">
													Download Report
												</a>
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
						executeFetchValuations();
					}
				"
				class="w-full space-y-3">
				<div
					class="transtion-colors w-full rounded-lg bg-gray-100 px-3 py-2 duration-200 ease-in-out outline-none hover:bg-gray-200">
					<h1 class="mb-2 text-xs font-semibold text-gray-500">Tampered Vehicles</h1>
					<div class="flex h-fit w-full items-center py-2">
						<input
							id="show-tampered-vehicles"
							type="checkbox"
							:value="true"
							v-model="showTampered"
							name="bordered-radio"
							class="size-5 rounded-lg border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500" />
						<label
							for="show-tampered-vehicles"
							class="3 ms-2 w-full text-sm font-medium text-gray-600"
							>Also Include Tampered Vehicles</label
						>
					</div>
				</div>

				<div
					class="transtion-colors w-full rounded-lg bg-gray-100 px-3 py-2 duration-200 ease-in-out outline-none hover:bg-gray-200">
					<h1 class="mb-2 text-xs font-semibold text-gray-500">Payment Status</h1>
					<div
						class="tablet:flex-row tablet:space-y-0 tablet:space-x-2 flex w-full flex-col space-y-2">
						<div
							class="tablet:w-1/3 flex h-fit w-full py-2 ps-2"
							v-for="e in ['paid', 'not-paid', 'none']"
							:key="e">
							<input
								:id="`payment-status-${e}`"
								type="radio"
								:value="e == 'none' ? null : e"
								v-model="paymentStatus"
								name="payment_status"
								class="size-5 rounded-lg border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500" />
							<label
								for="payment-status-paid"
								class="ms-2 w-full text-sm font-medium text-gray-600"
								>{{ deriveRdBtnName(e) }}</label
							>
						</div>
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
						v-if="
							startDate || endDate || paymentStatus || paymentMethod || showTampered
						"
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
						v-if="
							startDate || endDate || paymentStatus || paymentMethod || showTampered
						"
						class="generic-form-submit w-1/2 border bg-white text-gray-500 shadow-none hover:bg-white">
						Clear Filters
					</button>
				</div>
			</form>
		</ParentModal>

		<!-- modal to for intial AI chat test -->
		<template
			v-if="activeView == 'complete' && corpValuations.length > 0"
			v-for="(v, idx) in corpValuations"
			:key="idx">
			<ParentModal
				modal-title="Valuation Report"
				:modal-id="`view-valuation-${v.valuationId}-report`"
				modal-subtitle="Chat features are experimental!"
				modal-size="xl">
				<!-- loading screen -->
				<div
					v-if="reportDownloading"
					class="h-[calc(100vh-20%)] place-content-center place-items-center">
					<h1>Loading...</h1>
				</div>

				<!-- error screen -->
				<div
					v-else-if="!reportDownloading && !downloadedReport"
					class="h-[calc(100vh-20%)] place-content-center place-items-center">
					<h1>Error...</h1>
				</div>

				<template v-else>
					<div
						:class="[
							'grid h-[75vh]',
							!showAIView && 'grid-cols-1',
							showAIView && 'grid-cols-2',
						]">
						<!-- the pdf -->
						<div class="relative h-full">
							<!-- chat trigger button -->
							<button
								class="ai-chat-button absolute right-8 bottom-8"
								@click="showAIView = true">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									class="text-slate-100">
									<g fill="none">
										<path
											d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path>
										<path
											fill="currentColor"
											d="M9.107 5.448c.598-1.75 3.016-1.803 3.725-.159l.06.16l.807 2.36a4 4 0 0 0 2.276 2.411l.217.081l2.36.806c1.75.598 1.803 3.016.16 3.725l-.16.06l-2.36.807a4 4 0 0 0-2.412 2.276l-.081.216l-.806 2.361c-.598 1.75-3.016 1.803-3.724.16l-.062-.16l-.806-2.36a4 4 0 0 0-2.276-2.412l-.216-.081l-2.36-.806c-1.751-.598-1.804-3.016-.16-3.724l.16-.062l2.36-.806A4 4 0 0 0 8.22 8.025l.081-.216zM19 2a1 1 0 0 1 .898.56l.048.117l.35 1.026l1.027.35a1 1 0 0 1 .118 1.845l-.118.048l-1.026.35l-.35 1.027a1 1 0 0 1-1.845.117l-.048-.117l-.35-1.026l-1.027-.35a1 1 0 0 1-.118-1.845l.118-.048l1.026-.35l.35-1.027A1 1 0 0 1 19 2"></path>
									</g>
								</svg>
								<span class="text-slate-100">Ask AVA</span>
							</button>

							<iframe
								:src="downloadedReport"
								class="h-full w-full rounded-lg border-none outline-none"
								title="Valuation Report"></iframe>
						</div>
						<!-- chat interface -->
						<div v-show="showAIView"></div>
					</div>
				</template>
			</ParentModal>
		</template>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'vehicle-valuation-home',
		layout: 'console-layout',
	});
	const corporateModalFiltersRef = useTemplateRef<{ modalElement: HTMLElement }>(
		'corporateModalFiltersRef',
	);
	const showAIView: Ref<boolean> = ref(false);

	function manuallyCloseModal(): void {
		corporateModalFiltersRef.value?.close();
	}

	function deriveRdBtnName(option: 'paid' | 'not-paid' | 'none'): string {
		switch (option) {
			case 'paid':
				return 'Only Paid';
			case 'not-paid':
				return 'Not Paid';
			case 'none':
				return 'Show All';
			default:
				return '';
		}
	}

	const {
		activeView,
		fetchValuationsStatus,
		fetchValuationsError,
		corpValuations,
		totalPages,
		page,
		startDate,
		endDate,
		paymentStatus,
		showTampered,
		paymentMethod,
		searchRegNo,
		reportDownloading,
		downloadedReport,
		executeFetchValuations,
		clearFilters,
		downloadReport,
	} = useCorporateValuations();
</script>
