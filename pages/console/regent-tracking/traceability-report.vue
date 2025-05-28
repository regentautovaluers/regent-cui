<template>
	<!-- traceability reports -->
	<div class="console-layout-spacing">
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
			<h1 class="font-semibold text-gray-500">Oops! Seems like you have no incidents!</h1>
			<NuxtLink
				:to="{ name: 'ra-towing-request' }"
				class="generic-nuxt-link">
				Make Towing Request
			</NuxtLink>
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
									Installation Date
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
									Comments
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
								<td class="max-w-48 py-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>demolocation</span
									>
								</td>
								<td></td>
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
								<td class="p-4 text-blue-600">
									{{ certificate.installationDate }}
								</td>
								<td class="p-4 font-semibold text-pink-600">
									{{ certificate.regno }}
								</td>
								<td class="inline-flex flex-col p-4">
									<span>{{ certificate.installationDate ?? 'Email N/A' }}</span>
									<span
										class="w-fit rounded-lg bg-pink-200 px-1 text-sm text-pink-600"
										>{{ certificate.renewalDate }}</span
									>
								</td>
								<td></td>
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
		executeFetchTrackingCertificates,
	} = useTrackingTraceabilityReports();
</script>
