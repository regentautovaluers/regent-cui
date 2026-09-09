<template>
	<div class="console-layout-spacing flex flex-1 flex-col">
		<!-- header -->
		<div class="my-2 flex flex-wrap items-end justify-between gap-2">
			<div>
				<h1 class="text-xl font-semibold text-gray-700">Accident Claims</h1>
				<p class="text-sm text-gray-500">
					{{ totalClaims }}
					{{ totalClaims === 1 ? 'claim' : 'claims' }} raised against your policies
				</p>
			</div>
		</div>

		<!-- div to show when there is a fetch error -->
		<div
			v-if="fetchClaimsError"
			class="flex h-full flex-1 flex-col items-center justify-center space-y-4 rounded-lg border bg-white text-sm shadow-sm">
			<BirdieNotFoundIcon />
			<h1 class="font-semibold text-gray-500">Failed to load data!</h1>
			<button
				class="inline-flex items-center space-x-2 rounded-lg border bg-transparent px-2 py-1 text-gray-500 hover:text-gray-600"
				@click="executeFetchClaims()">
				<span>Refresh</span>
				<RefreshIcon classes="size-6" />
			</button>
		</div>

		<!-- div to show when the insurer has no claims at all -->
		<div
			v-else-if="fetchClaimsStatus === 'success' && !claims.length && !searchTerm"
			class="flex h-full flex-1 flex-col items-center justify-center space-y-4 rounded-lg border bg-white text-sm shadow-sm">
			<BirdieNotFoundIcon />
			<h1 class="font-semibold text-gray-500">
				No accident claims have been raised against your policies yet.
			</h1>
		</div>

		<!-- div to show when there are claims -->
		<div
			v-else
			class="flex h-full flex-1 flex-col">
			<!-- search controls -->
			<div class="tablet:space-x-0 my-2 flex h-fit items-center justify-between space-x-2">
				<form
					class="tablet:mt-0 tablet:w-[50%] laptop-lg:w-[30%] relative flex h-[50px] w-full items-center justify-between"
					@submit.prevent="applySearch()">
					<input
						type="text"
						class="generic-input h-full"
						placeholder="Search registration or claim number."
						v-model="searchTerm" />
					<button
						type="submit"
						class="generic-search-submit-button">
						<SearchIcon classes="size-5" />
					</button>
				</form>

				<button
					v-if="searchTerm || status"
					class="inline-flex items-center space-x-2 rounded-lg border bg-transparent px-3 py-2 text-sm text-gray-500 hover:text-gray-600"
					@click="clearFilters()">
					<span>Clear</span>
				</button>
			</div>

			<!-- table -->
			<div class="thin-scrollbar w-full overflow-x-auto rounded-lg border bg-white shadow-sm">
				<table class="w-full text-left text-sm">
					<thead class="table-headers">
						<tr>
							<th class="px-4 py-3">Registration</th>
							<th class="tablet:table-cell hidden px-4 py-3">Claim No.</th>
							<th class="laptop:table-cell hidden px-4 py-3">Client</th>
							<th class="laptop:table-cell hidden px-4 py-3">Assessor</th>
							<th class="px-4 py-3 text-right">Approved (KES)</th>
							<th class="laptop-lg:table-cell hidden px-4 py-3">Updated</th>
							<th class="px-4 py-3">Status</th>
						</tr>
					</thead>
					<tbody>
						<!-- loading skeletons -->
						<tr
							v-if="fetchClaimsStatus === 'pending'"
							v-for="a in 10"
							:key="`skeleton-${a}`"
							class="animate-pulse border-t">
							<td
								v-for="c in 7"
								:key="`cell-${c}`"
								class="px-4 py-3">
								<div class="h-3 w-24 rounded bg-gray-300"></div>
							</td>
						</tr>

						<!-- a search that matched nothing: distinct from having no claims -->
						<tr v-else-if="!claims.length">
							<td
								colspan="7"
								class="px-4 py-10 text-center text-gray-500">
								No claim matches “{{ searchTerm }}”.
							</td>
						</tr>

						<tr
							v-else
							v-for="(claim, index) in claims"
							:key="claim.id ?? index"
							class="border-t hover:bg-gray-50">
							<td class="px-4 py-3 font-medium">
								<NuxtLink
									:to="{
										name: 'accident-management-claim',
										params: { claim_id: claim.id },
									}"
									class="text-blue-600 hover:underline">
									{{ claim.regNo || 'None' }}
								</NuxtLink>
							</td>
							<td class="tablet:table-cell hidden px-4 py-3 text-gray-600">
								{{ claim.claimNo || 'None' }}
							</td>
							<td class="laptop:table-cell hidden px-4 py-3 text-gray-600">
								{{ claim.clientName || 'None' }}
							</td>
							<td class="laptop:table-cell hidden px-4 py-3 text-gray-600">
								{{ claim.assessorName || 'None' }}
							</td>
							<td class="px-4 py-3 text-right tabular-nums text-gray-700">
								{{ formatAmount(claim.grandTotal) }}
							</td>
							<td class="laptop-lg:table-cell hidden px-4 py-3 text-gray-500">
								{{ formatDate(claim.updatedAt) }}
							</td>
							<td class="px-4 py-3">
								<span
									class="inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium"
									:class="statusClasses(claim.status)">
									{{ statusLabel(claim.status) }}
								</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- pagination -->
			<div
				v-if="totalPages > 1"
				class="my-3 flex items-center justify-between text-sm">
				<span class="text-gray-500">Page {{ page }} of {{ totalPages }}</span>
				<div class="flex space-x-2">
					<button
						class="rounded-lg border px-3 py-1 text-gray-600 disabled:opacity-40"
						:disabled="page <= 1"
						@click="page--">
						Previous
					</button>
					<button
						class="rounded-lg border px-3 py-1 text-gray-600 disabled:opacity-40"
						:disabled="page >= totalPages"
						@click="page++">
						Next
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { AccidentReportStatus } from '~/types/accident-assessment/accident-claim';

	definePageMeta({
		name: 'accident-management-home',
		layout: 'console-layout',
	});

	const {
		page,
		searchTerm,
		status,
		claims,
		totalClaims,
		totalPages,
		fetchClaimsStatus,
		fetchClaimsError,
		executeFetchClaims,
		applySearch,
		clearFilters,
	} = useAccidentClaims();

	/**
	 * The assessor's vocabulary, kept identical to the service's. "Returned"
	 * rather than "Rejected": the job goes back for correction, and the harsher
	 * word misdescribes what happened.
	 */
	const STATUS_LABEL: Record<string, string> = {
		assigned: 'Assigned',
		in_progress: 'In progress',
		draft: 'Draft',
		submitted: 'Submitted',
		under_review: 'Under review',
		approved: 'Approved',
		rejected: 'Returned',
		issued: 'Issued',
		closed: 'Closed',
	};

	const STATUS_CLASSES: Record<string, string> = {
		assigned: 'bg-gray-100 text-gray-700',
		in_progress: 'bg-blue-50 text-blue-700',
		draft: 'bg-gray-100 text-gray-700',
		submitted: 'bg-blue-50 text-blue-700',
		under_review: 'bg-amber-50 text-amber-800',
		approved: 'bg-green-50 text-green-700',
		rejected: 'bg-red-50 text-red-700',
		issued: 'bg-green-50 text-green-700',
		closed: 'bg-gray-100 text-gray-600',
	};

	const statusLabel = (s?: AccidentReportStatus) =>
		(s && STATUS_LABEL[s]) || s || 'Unknown';

	const statusClasses = (s?: AccidentReportStatus) =>
		(s && STATUS_CLASSES[s]) || 'bg-gray-100 text-gray-700';

	/**
	 * A blank money cell reads as zero, and zero is a different claim. Say so
	 * explicitly when there is no approved figure yet.
	 */
	const formatAmount = (value?: number) =>
		typeof value === 'number' && !Number.isNaN(value)
			? new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 }).format(value)
			: 'Not yet costed';

	const formatDate = (value?: string) => {
		if (!value) return 'None';
		const d = new Date(value);
		return Number.isNaN(d.getTime()) ? 'None' : d.toLocaleDateString('en-GB');
	};
</script>
