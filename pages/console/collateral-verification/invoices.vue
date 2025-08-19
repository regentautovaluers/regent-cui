<template>
	<div class="laptop:p-4 laptop-lg:p-8 flex flex-1 flex-col rounded-md p-2">
		<!-- div to show when there is a fetch error -->
		<div
			v-if="fetchCollateralVerificationInvoiceListStatus === 'error'"
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

		<!-- div to show when there are no authorization letters -->
		<div
			class="flex h-full flex-1 flex-col items-center justify-center space-y-4 text-sm"
			v-else-if="
				fetchCollateralVerificationInvoiceListStatus === 'success' &&
				collateralVerificationInvoices.length === 0
			">
			<BirdieNotFoundIcon />
			<h1 class="font-semibold text-gray-500">Oops! Seems like you have no invoices!</h1>
		</div>

		<!-- div to show when there are authority letters -->
		<div
			class="flex h-full flex-1 flex-col justify-between"
			v-else>
			<!-- filters -->
			<form
				@submit.prevent="executeFetchCollateralVerificationInvoiceList()"
				class="table-filters-form">
				<button
					data-popover-target="payment-status-pop-over"
					data-popover-trigger="click"
					data-popover-placement="bottom"
					type="button"
					:class="[
						'table-filter-form-options',
						paymentStatus ? 'bg-blue-600 text-white hover:bg-blue-600' : '',
					]">
					Payment Status
				</button>

				<div
					data-popover
					id="payment-status-pop-over"
					role="tooltip"
					class="invisible absolute z-10 inline-block w-64 rounded-lg border border-gray-200 bg-white text-sm text-gray-500 opacity-0 shadow-xs transition-opacity duration-300">
					<div class="space-y-2 px-3 py-2">
						<div
							class="flex h-10 items-center rounded-lg border border-gray-200 ps-4 hover:bg-gray-200"
							v-for="(ps, index) in ['paid', 'unpaid', 'partial', 'stale', 'void']"
							:key="index">
							<input
								id="has-spare-tyre"
								type="radio"
								:value="ps"
								v-model="paymentStatus"
								name="bordered-radio"
								class="size-5 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500" />
							<label
								for="has-spare-tyre"
								class="ms-2 w-full py-4 font-medium text-gray-600"
								>{{ ps }}</label
							>
						</div>
					</div>
					<div data-popper-arrow></div>
				</div>

				<button
					data-popover-target="date-range-pop-over"
					data-popover-trigger="click"
					data-popover-placement="bottom"
					type="button"
					:class="[
						'table-filter-form-options',
						startDate || endDate ? 'bg-blue-600 text-white hover:bg-blue-600' : '',
					]">
					Date Range
				</button>

				<div
					data-popover
					id="date-range-pop-over"
					role="tooltip"
					class="invisible absolute z-10 inline-block w-64 rounded-lg border border-gray-200 bg-white text-sm text-gray-500 opacity-0 shadow-xs transition-opacity duration-300">
					<div class="space-y-2 px-3 py-2">
						<!-- Starting date Field -->
						<div>
							<label
								for="cover-period-starts"
								class="generic-input-label mb-0 text-xs"
								>Start Date</label
							>
							<input
								type="date"
								id="cover-period-starts"
								name="cover-period-starts"
								class="generic-input h-10"
								placeholder="Select"
								pattern="\d{4}-\d{2}-\d{2}"
								required
								v-model="startDate" />
						</div>

						<!-- Ending date Field -->
						<div>
							<label
								for="cover-period-starts"
								class="generic-input-label mb-0 text-xs"
								>End Date</label
							>
							<input
								type="date"
								id="cover-period-starts"
								class="generic-input h-10"
								placeholder="Select"
								pattern="\d{4}-\d{2}-\d{2}"
								required
								v-model="endDate" />
						</div>
					</div>
					<div data-popper-arrow></div>
				</div>
				<span
					class="text-lg"
					v-if="startDate || endDate || paymentStatus"
					>&middot;</span
				>
				<button
					type="submit"
					class="table-filter-form-options flex items-center space-x-2"
					v-if="startDate || endDate || paymentStatus">
					<span class="material-symbols--error-rounded size-5"></span>
					<span>Apply Filters</span>
				</button>
				<button
					type="button"
					@click="clearFilters()"
					class="table-filter-form-options flex items-center space-x-2"
					v-if="startDate || endDate || paymentStatus">
					<span class="material-symbols-light--close-rounded size-5"></span>
					<span>Clear Filters</span>
				</button>
			</form>
			<div class="mt-5 flex-grow">
				<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
					<table class="w-full text-left text-gray-500">
						<thead class="bg-gray-100 text-sm text-gray-700 uppercase">
							<tr>
								<!-- Details will show client name and their contact -->

								<th
									scope="col"
									class="table-headers px-3">
									Inv. Number
								</th>
								<th
									scope="col"
									class="table-headers mobile-lg:table-cell hidden">
									Time Period
								</th>
								<th
									scope="col"
									class="table-headers tablet:table-cell hidden">
									Inv. Amount
								</th>
								<th
									scope="col"
									class="table-headers tablet:table-cell hidden">
									Paid Amount
								</th>
								<th
									scope="col"
									class="table-headers laptop:table-cell hidden">
									Last Payment At
								</th>
								<th
									scope="col"
									class="table-headers laptop-lg:table-cell hidden">
									Fully Paid At
								</th>

								<th
									scope="col"
									class="table-headers pe-3">
									Action
								</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							<!-- loading state -->
							<tr
								class="border-b bg-white hover:bg-gray-100"
								v-if="fetchCollateralVerificationInvoiceListStatus === 'pending'"
								v-for="a in 10"
								:key="a">
								<td class="p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>regenthq</span
									>
								</td>
								<td class="mobile-lg:table-cell hidden p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>domain role</span
									>
								</td>
								<td class="tablet:table-cell hidden p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300">agency</span>
								</td>
								<td class="tablet:table-cell hidden p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>authorizedby</span
									>
								</td>
								<td class="laptop:table-cell hidden p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>bookingstage</span
									>
								</td>
								<td class="laptop-lg:table-cell hidden p-6 text-gray-300">
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
								v-for="(invoice, index) in collateralVerificationInvoices"
								:key="index">
								<td class="px-3 text-sm font-semibold text-wrap text-blue-500">
									{{ invoice.invoiceNumber }}
								</td>
								<td class="mobile-lg:table-cell hidden py-4">
									<span class="w-fit">
										from
										{{ (invoice.periodStart as string)?.split('T')[0] }}</span
									>
									<br />
									<span class="w-fit rounded-lg bg-gray-200 px-1"
										>to {{ (invoice.periodEnd as string)?.split('T')[0] }}</span
									>
								</td>
								<td
									class="tablet:table-cell hidden py-4 text-sm font-semibold text-pink-500">
									{{ invoice.amount ?? 'N/A' }}
								</td>
								<td
									class="tablet:table-cell hidden py-4 text-sm font-semibold text-pink-500">
									{{ invoice.amountPaid ?? 'N/A' }}
								</td>
								<td class="laptop:table-cell hidden py-4 text-sm">
									{{ (invoice.lastPaymentAt as string)?.split('T')[0] ?? 'N/A' }}
								</td>
								<td class="laptop-lg:table-cell hidden py-4 text-sm">
									{{ (invoice.paidAt as string)?.split('T')[0] ?? 'N/A' }}
								</td>
								<td class="py-4 pe-3 text-sm text-blue-600">
									<button
										@click="
											() => {
												downloadInvoice(invoice.id);
											}
										"
										:data-modal-target="`view-invoice-${invoice.id}-modal`"
										:data-modal-toggle="`view-invoice-${invoice.id}-modal`">
										View Inv
									</button>
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

		<!-- View invoice modal(s) -->
		<template
			v-if="collateralVerificationInvoices && collateralVerificationInvoices.length"
			v-for="(invoice, idx) in collateralVerificationInvoices"
			:key="idx">
			<ParentModal
				:modal-id="`view-invoice-${invoice.id}-modal`"
				modal-title="Service Invoice">
				<span v-if="invoiceDownloadLoading"> Please Wait </span>
				<iframe
					v-else-if="!invoiceDownloadLoading && downloadedInvoice"
					:src="downloadedInvoice"
					class="h-[650px] w-full rounded-lg border-none outline-none"
					title="PDF Preview"></iframe>
				{{ fileName }}
			</ParentModal>
		</template>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'collateral-verification-view-invoices',
		layout: 'console-layout',
	});

	const {
		page,
		paymentStatus,
		startDate,
		endDate,
		totalPages,
		collateralVerificationInvoices,
		fetchCollateralVerificationInvoiceListStatus,
		fetchCollateralVerificationInvoiceListError,
		downloadedInvoice,
		fileName,
		invoiceDownloadLoading,
		executeFetchCollateralVerificationInvoiceList,
		clearFilters,
		downloadInvoice,
	} = useCollateralVerificationInvoiceManagement();
</script>
