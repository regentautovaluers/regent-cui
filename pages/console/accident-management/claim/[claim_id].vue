<template>
	<div class="console-layout-spacing flex flex-1 flex-col">
		<NuxtLink
			:to="{ name: 'accident-management-home' }"
			class="my-2 inline-flex w-fit items-center space-x-1 text-sm text-blue-600 hover:underline">
			<span>&larr;</span>
			<span>Back to claims</span>
		</NuxtLink>

		<!-- fetch failed -->
		<div
			v-if="fetchClaimError"
			class="flex h-full flex-1 flex-col items-center justify-center space-y-4 rounded-lg border bg-white text-sm shadow-sm">
			<BirdieNotFoundIcon />
			<h1 class="font-semibold text-gray-500">This claim could not be loaded.</h1>
			<button
				class="inline-flex items-center space-x-2 rounded-lg border bg-transparent px-2 py-1 text-gray-500 hover:text-gray-600"
				@click="executeFetchClaim()">
				<span>Refresh</span>
				<RefreshIcon classes="size-6" />
			</button>
		</div>

		<!-- loading -->
		<div
			v-else-if="fetchClaimStatus === 'pending'"
			class="flex flex-1 flex-col space-y-3">
			<div
				v-for="a in 6"
				:key="`sk-${a}`"
				class="h-16 animate-pulse rounded-lg bg-gray-200"></div>
		</div>

		<!-- the claim -->
		<div
			v-else
			class="flex flex-1 flex-col space-y-4">
			<div class="flex flex-wrap items-center gap-3">
				<h1 class="text-xl font-semibold text-gray-700">
					{{ vehicle.regNo || 'Claim' }}
				</h1>
				<span
					class="inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium"
					:class="statusClasses(assessment.status)">
					{{ statusLabel(assessment.status) }}
				</span>

				<!--
					Always offered, never hidden. A button that disappears leaves the
					reader wondering whether the report exists; one that explains
					itself tells them it is coming and who to ask.
				-->
				<button
					type="button"
					class="ml-auto inline-flex items-center space-x-2 rounded-lg border px-3 py-1.5 text-sm font-medium"
					:class="
						reportIssued
							? 'border-blue-600 text-blue-700 hover:bg-blue-50'
							: 'border-gray-300 text-gray-500 hover:bg-gray-50'
					"
					:disabled="downloading"
					@click="openReport()">
					<span>{{
						downloading
							? 'Fetching...'
							: reportIssued
								? 'Download report'
								: 'Report not issued yet'
					}}</span>
				</button>
			</div>

			<p
				v-if="downloadProblem"
				role="status"
				class="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
				{{ downloadProblem }}
			</p>

			<div class="grid gap-4 laptop:grid-cols-3">
				<div class="space-y-4 laptop:col-span-2">
					<section class="rounded-lg border bg-white shadow-sm">
						<h2 class="border-b px-4 py-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
							Vehicle
						</h2>
						<dl class="grid grid-cols-2 gap-4 p-4 tablet:grid-cols-3">
							<div v-for="f in vehicleFields" :key="f.label">
								<dt class="text-xs uppercase tracking-wide text-gray-500">{{ f.label }}</dt>
								<dd class="mt-0.5 text-sm text-gray-800">{{ f.value || 'None' }}</dd>
							</div>
						</dl>
					</section>

					<section class="rounded-lg border bg-white shadow-sm">
						<h2 class="flex items-center justify-between border-b px-4 py-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
							<span>Damage</span>
							<span class="text-xs font-normal normal-case text-gray-500">
								{{ damages.length }} recorded
							</span>
						</h2>
						<div class="p-4">
							<p v-if="!damages.length" class="text-sm text-gray-500">
								No damage has been recorded on this claim.
							</p>
							<ul v-else class="divide-y">
								<li
									v-for="(d, i) in damages"
									:key="d.id ?? i"
									class="flex flex-wrap items-baseline gap-x-3 py-2">
									<span class="text-sm font-medium text-gray-800">{{ d.component || 'None' }}</span>
									<span class="text-xs text-gray-500">
										{{ [d.vehicleArea, d.side].filter(Boolean).join(' · ') || 'None' }}
									</span>
									<span
										v-if="d.severity"
										class="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700">
										{{ d.severity }}
									</span>
								</li>
							</ul>
						</div>
					</section>

					<section class="rounded-lg border bg-white shadow-sm">
						<h2 class="border-b px-4 py-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
							Photographs
						</h2>
						<div class="p-4">
							<p v-if="!photos.length" class="text-sm text-gray-500">
								No photographs are attached to this claim.
							</p>
							<!--
								carouselHeight and controlButtonsPosition are both declared
								required, and carouselHeight is appended to the container as a
								class -- omit it and the images, which are h-full, collapse to
								nothing. This component has no other caller in the codebase, so
								there was no working example to copy.
							-->
							<ImageCarousel
								v-else
								:images="photoUrls"
								carousel-height="h-96"
								control-buttons-position="bottom-4" />
						</div>
					</section>
				</div>

				<div class="space-y-4">
					<section class="rounded-lg border bg-white shadow-sm">
						<h2 class="border-b px-4 py-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
							Approved costs
						</h2>
						<dl class="space-y-2 p-4 text-sm">
							<div
								v-for="line in costLines"
								:key="line.label"
								class="flex justify-between gap-4">
								<dt class="text-gray-600">{{ line.label }}</dt>
								<dd class="tabular-nums text-gray-800">{{ formatAmount(line.value) }}</dd>
							</div>
							<div class="flex justify-between gap-4 border-t pt-2">
								<dt class="text-gray-700">Subtotal</dt>
								<dd class="tabular-nums text-gray-800">{{ formatAmount(cost.subtotal) }}</dd>
							</div>
							<div class="flex justify-between gap-4">
								<dt class="text-gray-600">VAT</dt>
								<dd class="tabular-nums text-gray-800">{{ formatAmount(cost.vatAmount) }}</dd>
							</div>
							<div class="flex justify-between gap-4 border-t-2 pt-2">
								<dt class="font-semibold text-gray-800">Grand total</dt>
								<dd class="font-semibold tabular-nums text-gray-800">
									{{ formatAmount(cost.grandTotal) }}
								</dd>
							</div>
						</dl>
					</section>

					<section class="rounded-lg border bg-white shadow-sm">
						<h2 class="border-b px-4 py-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
							Claim
						</h2>
						<dl class="space-y-3 p-4">
							<div v-for="f in claimFields" :key="f.label">
								<dt class="text-xs uppercase tracking-wide text-gray-500">{{ f.label }}</dt>
								<dd class="mt-0.5 text-sm text-gray-800">{{ f.value || 'None' }}</dd>
							</div>
						</dl>
					</section>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'accident-management-claim',
		layout: 'console-layout',
	});

	const route = useRoute();
	const claimId = computed(() => String(route.params.claim_id ?? ''));

	const { claim, fetchClaimStatus, fetchClaimError, executeFetchClaim } =
		useAccidentClaim(claimId);

	const assessment = computed(() => claim.value?.assessment ?? {});
	const vehicle = computed(() => claim.value?.vehicle ?? {});
	const damages = computed(() => claim.value?.damages ?? []);
	const photos = computed(() => claim.value?.photos ?? []);
	const cost = computed(() => claim.value?.cost ?? {});

	const photoUrls = computed(() =>
		photos.value.map((p: any) => p.remoteUrl).filter(Boolean),
	);

	/*
	 * The signed report.
	 *
	 * This is the one thing an insurer actually wants from a claim, and it was
	 * the feature accident-portal's insurer view had that this page did not.
	 *
	 * It goes through our own server, which fetches the file and refuses
	 * anything that is not a PDF before sending it back. That guard is not
	 * theoretical: accident-portal shipped a download that produced 1,648 bytes
	 * of HTML saved as `KCX-904M-v1.pdf`, because a missing file falls through
	 * to a single-page app answering 200 with `text/html`, and someone opened
	 * it expecting a report. Handing the browser a bare URL repeats that.
	 */
	const OFFICE_EMAIL = 'qualitycontrol@regentautovaluers.co.ke';

	const reportIssued = computed(
		() => Boolean(claim.value?.report?.pdfUrl ?? claim.value?.report?.pdf_url),
	);

	const downloading = ref(false);
	const downloadProblem = ref<string | null>(null);

	async function openReport() {
		downloadProblem.value = null;
		const reg = vehicle.value.regNo || 'this claim';

		if (!reportIssued.value) {
			const reference =
				assessment.value.claimNo || assessment.value.policyNo || reg;
			downloadProblem.value =
				`The signed report for ${reg} has not been released yet. Regent ` +
				`publishes it once the report is issued. Email ${OFFICE_EMAIL} ` +
				`quoting ${reference} if you need it sooner.`;
			return;
		}

		downloading.value = true;
		try {
			const blob = await $fetch<Blob>(
				'/api/accident-assessment/download-report',
				{ query: { claimId: claimId.value }, responseType: 'blob' },
			);

			/*
			 * The server answers JSON when there is no document to give: not
			 * issued yet, or a link that did not return a PDF. Opening that as a
			 * file is the exact fault this route exists to prevent, so the type is
			 * checked before anything is handed to the browser.
			 */
			if (blob.type.includes('application/json')) {
				const said = JSON.parse(await blob.text());
				downloadProblem.value =
					said.reason || 'The report could not be opened.';
				return;
			}

			// Only reached once the server has confirmed it really is a PDF.
			const url = URL.createObjectURL(blob);
			const opened = window.open(url, '_blank', 'noopener,noreferrer');
			if (!opened) {
				downloadProblem.value =
					'Your browser blocked the report tab. Allow pop-ups for this site, ' +
					'then try again.';
			}
			// Freed on the next tick rather than immediately: revoking it before
			// the new tab has read it hands over an empty document.
			window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
		} catch (err: any) {
			downloadProblem.value =
				err?.data?.metadata?.message ||
				err?.data?.message ||
				`The report for ${reg} could not be opened. Please try again.`;
		} finally {
			downloading.value = false;
		}
	}

	const vehicleFields = computed(() => [
		{ label: 'Registration', value: vehicle.value.regNo },
		{ label: 'Make', value: vehicle.value.make },
		{ label: 'Model', value: vehicle.value.model },
		{ label: 'Body type', value: vehicle.value.bodyType },
		{ label: 'Year', value: vehicle.value.mfgYear },
		{ label: 'Chassis / VIN', value: vehicle.value.chassisVin },
	]);

	const claimFields = computed(() => [
		{ label: 'Claim no.', value: assessment.value.claimNo },
		{ label: 'Policy no.', value: assessment.value.policyNo },
		{ label: 'Client', value: assessment.value.clientName },
		{ label: 'Assessor', value: assessment.value.assessorName },
		{ label: 'Inspection location', value: assessment.value.inspectionLocation },
	]);

	/** Only the lines that carry a figure; an empty row is noise on a report. */
	const costLines = computed(() =>
		[
			{ label: 'Parts', value: cost.value.parts },
			{ label: 'Labour', value: cost.value.labour },
			{ label: 'Panel beating', value: cost.value.panelBeating },
			{ label: 'Painting', value: cost.value.painting },
			{ label: 'Other', value: cost.value.misc },
		].filter((l) => Number(l.value) > 0),
	);

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

	const statusLabel = (s?: string) => (s && STATUS_LABEL[s]) || s || 'Unknown';
	const statusClasses = (s?: string) =>
		(s && STATUS_CLASSES[s]) || 'bg-gray-100 text-gray-700';

	/** A blank money cell reads as zero, and zero is a different claim. */
	const formatAmount = (value?: number) =>
		typeof value === 'number' && !Number.isNaN(value)
			? new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 }).format(value)
			: 'Not recorded';
</script>
