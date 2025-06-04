<template>
	<!-- traceability reports -->
	<div class="console-layout-spacing">
		<!-- <div
			class="flex h-fit items-center justify-between"
			v-if="
				fetchTrackingCertificatesStatus === 'success' && trackingCertificates!.length > 0
			">
			<form class="size-fit">
				<button class="table-filter-buttons">
					Export to Excel<FilterIcon class="text-xl" />
				</button>
			</form>
		</div> -->

		<!-- div to show when there is an error -->
		<div
			v-if="fetchTrackingCertificatesStatus === 'error'"
			class="flex h-full flex-col items-center justify-center space-y-4 rounded-md border">
			<BirdieNotFoundIcon />
			<h1 class="font-semibold text-gray-500">Oops! Fetch Failed!</h1>
			<button
				class="inline-flex items-center space-x-2 rounded-lg border bg-transparent px-2 py-1 text-gray-500 hover:text-gray-600"
				@click="refreshPage">
				<span>Refresh</span>
				<RefreshIcon classes="size-6" />
			</button>
		</div>

		<!-- div to show when there are no incidents -->
		<div
			v-else-if="
				fetchTrackingCertificatesStatus === 'success' && !trackingCertificates?.length
			"
			class="flex h-full flex-col items-center justify-center space-y-4 rounded-md border">
			<BirdieNotFoundIcon />
			<h1 class="font-semibold text-gray-500">Oops! Seems like you have no reports!</h1>
		</div>

		<!-- div to show when there are incidents -->
		<div
			class="ml-10 flex h-full flex-col justify-between"
			v-else>
			<!-- the table itself -->
			<div class="mb-4 flex-grow">
				<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
					<table class="w-full text-left text-gray-500">
						<thead class="bg-gray-100 text-sm uppercase text-gray-700">
							<tr>
								<th
									scope="col"
									class="table-headers">
									Client Name & No
								</th>
								<th
									scope="col"
									class="table-headers">
									Reg No
								</th>
								<th
									scope="col"
									class="table-headers">
									Installation Date
								</th>
								<th
									scope="col"
									class="table-headers">
									Renewal Date
								</th>
								<th
									scope="col"
									class="table-headers max-w-48">
									Latest Comment
								</th>
							</tr>
						</thead>
						<tbody>
							<!-- loading state -->
							<tr
								class="border-b bg-white hover:bg-gray-100"
								v-if="fetchTrackingCertificatesStatus === 'pending'"
								v-for="a in 10">
								<td
									scope="row"
									class="whitespace-nowrap p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>demoreg</span
									>
								</td>
								<td class="p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>demodatetime</span
									>
								</td>
								<td class="p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>demophone</span
									>
								</td>
								<td class="p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>demoservice</span
									>
								</td>
								<td class="p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>demostatus</span
									>
								</td>
							</tr>
							<tr
								class="border-b bg-white hover:bg-gray-100"
								v-else
								v-for="(certificate, index) in trackingCertificates?.slice(0, 10)"
								:key="index">
								<td class="inline-flex flex-col p-4">
									<span>{{ certificate.clientName ?? 'Name N/A' }}</span>
									<span
										class="w-fit rounded-lg bg-pink-200 px-1 text-sm text-pink-600"
										>{{ certificate.clientNo }}</span
									>
								</td>
								<td class="p-4 font-semibold text-blue-600">
									{{ certificate.regno }}
								</td>
								<td class="p-4 font-semibold text-pink-600">
									{{ certificate.installationDate ?? 'Date N/A' }}
								</td>
								<td class="p-4 font-semibold">
									{{ certificate.renewalDate ?? 'Date N/A' }}
								</td>
								<td
									class="h-20 max-h-20 max-w-64 text-wrap text-sm"
									style="
										overflow: hidden;
										display: inline-flex;
										-webkit-box-orient: vertical;
										-webkit-line-clamp: 3;
										line-clamp: 3;
									">
									Lorem ipsum dolor sit amet consectetur adipisicing elit.
									Explicabo, odio mollitia corporis veritatis quia.
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<!-- page controls -->
			<div class="mt-5 flex min-h-12 items-center justify-between">
				<h1 class="text-sm font-semibold text-gray-500 md:text-base">
					Showing {{ currentPage + 1 }} of {{ totalPages }} pages.
				</h1>
				<div class="h-full space-x-2 md:space-x-4">
					<button
						class="table-page-buttons"
						@click="currentPage -= 1">
						Previous
					</button>
					<button
						class="table-page-buttons"
						@click="currentPage += 1">
						Next
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- search and export button teleported to the navbar -->
	<Teleport to="#custom-search-box">
		<div class="flex h-full w-1/2 items-center space-x-2">
			<form
				@submit.prevent=""
				class="relative size-full text-gray-500">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="1em"
					height="1em"
					viewBox="0 0 24 24"
					class="absolute left-4 size-8 translate-y-3">
					<path
						fill="currentColor"
						d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0s.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14" />
				</svg>

				<input
					type="text"
					class="generic-input size-full rounded-2xl bg-gray-200 pl-14"
					placeholder="Search report by Reg No..."
					v-model="searchRegNo" />
			</form>

			<form
				@submit.prevent="exportToExcel"
				class="h-full min-h-full w-16 max-w-16">
				<button class="generic-form-submit max-w-full text-xl">
					<FormSubmissionLoader
						classes="mr-2 size-6 animate-spin text-white"
						v-if="downloadReports" />
					<svg
						v-else
						xmlns="http://www.w3.org/2000/svg"
						width="48"
						height="48"
						viewBox="0 0 48 48">
						<path
							fill="currentColor"
							fill-rule="evenodd"
							d="M15 8c0-1.105.806-2 1.8-2h23.4c.994 0 1.8.895 1.8 2v32c0 1.105-.806 2-1.8 2H16.8c-.994 0-1.8-.895-1.8-2v-6H7.8c-.994 0-1.8-.895-1.8-2V16c0-1.105.806-2 1.8-2H15zm13 6V8H17v6zm2-6v6h10V8zm-2 8h-4v7h4zm2 7v-7h10v7zm-2 2h-4v7h4zm2 7v-7h10v7zm-2 2H17v6h11zm2 6v-6h10v6zm-8-24v16H7.8V16zm-10.774 3h2.147l1.743 3.754L16.957 19h2.006L16.2 24l2.827 5H16.91l-1.899-3.93l-1.89 3.93h-2.148l2.874-5.018z"
							clip-rule="evenodd" />
					</svg>
				</button>
			</form>
		</div>
	</Teleport>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'regent-tracking-traceability-report',
		layout: 'console-layout',
	});

	const {
		searchRegNo,
		fetchTrackingCertificatesStatus,
		size,
		currentPage,
		trackingCertificates,
		totalPages,
		downloadReports,
		executeFetchTrackingCertificates,
		exportToExcel,
	} = useTrackingTraceabilityReports();
</script>
