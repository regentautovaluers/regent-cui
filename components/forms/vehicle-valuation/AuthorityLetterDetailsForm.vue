<template>
	<div class="space-y-5">
		<!-- preliminary info -->
		<div class="grid h-fit grid-cols-2 gap-2 rounded-lg bg-gray-200/80 p-4 outline-none">
			<div class="col-span-2">
				<h1 class="font-bold text-gray-700">Request Information</h1>
			</div>
			<div class="flex h-12 items-center space-x-3">
				<h2 class="inline-flex items-center space-x-1">
					<span
						class="icon-[material-symbols-light--barcode-scanner] text-xl text-gray-700"></span>
					<span class="text-sm text-gray-500">Registration</span>
				</h2>
				<span class="text-gray-400">&VerticalBar;</span>
				<h3 class="text-sm font-semibold text-gray-700">
					{{ authorityLetter.registrationNumber }}
				</h3>
			</div>
			<div class="flex h-12 items-center space-x-3">
				<h2 class="inline-flex items-center space-x-1">
					<span
						class="icon-[material-symbols-light--settings-phone] text-xl text-gray-700"></span>
					<span class="text-sm text-gray-500">Phone</span>
				</h2>
				<span class="text-gray-400">&VerticalBar;</span>
				<h3 class="text-sm font-semibold text-gray-700">
					{{ authorityLetter.clientPhone }}
				</h3>
			</div>
			<div class="flex h-12 items-center space-x-3">
				<h2 class="inline-flex items-center space-x-1">
					<span
						class="icon-[material-symbols-light--person] text-xl text-gray-700"></span>
					<span class="text-sm text-gray-500">Client Name</span>
				</h2>
				<span class="text-gray-400">&VerticalBar;</span>
				<h3 class="text-sm font-semibold text-gray-700">
					{{ authorityLetter.clientName }}
				</h3>
			</div>
			<div class="flex h-12 items-center space-x-3">
				<h2 class="inline-flex items-center space-x-1">
					<span
						class="icon-[material-symbols-light--android-wifi-4-bar-question] text-xl text-gray-700"></span>
					<span class="text-sm text-gray-500">Status</span>
				</h2>
				<span class="text-gray-400">&VerticalBar;</span>
				<h3 class="text-sm font-semibold text-gray-700">
					{{ authorityLetter.assessmentStage ?? 'request received' }}
				</h3>
			</div>
		</div>

		<h1 class="font-bold text-gray-700">Request Information</h1>
		<!-- comment -->
		<div
			class="borer-blue-200 min-h-32 space-y-2 rounded-lg border bg-blue-100 px-4 py-2 outline-none">
			<div
				v-if="authorityLetter.feedbackTrail && authorityLetter.feedbackTrail?.length > 0"
				v-for="(ft, idx) in authorityLetter.feedbackTrail"
				:key="idx"
				class="flex items-start space-x-3">
				<div class="flex items-center space-x-1">
					<span class="icon-[material-symbols-light--person] size-6 text-gray-700"></span>
					<h3 class="space-x-1 text-sm font-semibold whitespace-nowrap text-gray-700">
						<span>{{ (ft.dateAdded as string).replace('T', ' ') }}</span>
						<span class="text-lg font-bold">&middot;</span>
						<span class="font-semibold">{{
							ft.addedByRegentUser?.username ?? ft.addedByCorporateUser?.username
						}}</span>
					</h3>
				</div>
				<span class="text-gray-700">&VerticalBar;</span>
				<p class="text-sm text-gray-600">
					{{ ft.feedback }}
				</p>
			</div>
			<p
				v-else
				class="text-xs text-gray-500">
				No previous comments for this device!
			</p>
		</div>

		<h1 class="font-bold text-gray-700">Available KYCs</h1>
		<!-- provided docs -->
		<div class="tablet:grid-cols-2 grid grid-cols-1 gap-4">
			<div
				class="flex h-14 items-center justify-between rounded-sm border border-yellow-500 bg-yellow-100 px-3 transition-colors duration-200 ease-linear hover:bg-yellow-200"
				v-if="
					authorityLetter.uploadedDocuments &&
					(authorityLetter.uploadedDocuments as string[]).length > 0
				"
				v-for="(e, idx) in authorityLetter.uploadedDocuments"
				:key="idx">
				<span class="text-sm font-semibold text-yellow-500">
					{{ (e as string).split(': ')[0] }}
				</span>
				<a
					target="_self"
					:href="(e as string).split(': ')[1]"
					class="inline-flex w-28 items-center justify-between rounded-full border border-yellow-600 bg-yellow-200 px-2 py-1 shadow-xs">
					<span class="text-sm text-yellow-600">Download</span>
					<span
						class="icon-[material-symbols-light--sim-card-download] size-6 text-yellow-600"></span>
				</a>
			</div>
		</div>

		<h1 class="font-bold text-gray-700">Update Details</h1>
		<form
			@submit.prevent="
				updateAuthorizationLetter(
					registrationNumber,
					clientName,
					clientPhone,
					authorityLetter.letterId,
				)
			">
			<div class="flex flex-col space-y-4 space-x-0 lg:flex-row lg:space-y-0 lg:space-x-4">
				<!-- Registration Number -->
				<div class="w-full lg:w-1/3">
					<label
						for="registration-number"
						class="generic-input-label generic-input-required-label"
						>Registration Number</label
					>
					<input
						type="text"
						id="registration-number"
						class="generic-input"
						placeholder="e.g KDH 908Y"
						required
						v-model="registrationNumber" />
				</div>
				<!-- Client Name -->
				<div class="w-full lg:w-1/3">
					<label
						for="client-name"
						class="generic-input-label generic-input-required-label"
						>Client Name</label
					>
					<input
						type="text"
						id="client-name"
						class="generic-input"
						placeholder="e.g Janet Wangari Thuo"
						required
						v-model="clientName" />
				</div>
				<!-- Client Phone Number -->
				<div class="w-full lg:w-1/3">
					<label
						for="client-phone"
						class="generic-input-label generic-input-required-label"
						>Client Phone Number</label
					>
					<input
						type="text"
						id="client-phone"
						class="generic-input"
						placeholder="e.g 254789261947"
						required
						v-model="clientPhone" />
				</div>
			</div>

			<!-- submit button -->
			<button
				type="submit"
				:disabled="updateAuthorizationLetterLoading"
				:class="[
					'generic-form-submit mt-4 w-full md:w-1/3',
					updateAuthorizationLetterLoading && 'skeleton skeleton-animated',
				]">
				{{ updateAuthorizationLetterLoading ? 'Please Wait...' : 'Submit Request' }}
			</button>
		</form>
	</div>
</template>

<script setup lang="ts">
	const { authorityLetter } = defineProps<{
		authorityLetter: any;
	}>();

	const registrationNumber: Ref<string> = ref(authorityLetter.registrationNumber);
	const clientName: Ref<string> = ref(authorityLetter.clientName);
	const clientPhone: Ref<string> = ref(authorityLetter.clientPhone);
	const { updateAuthorizationLetterLoading, updateAuthorizationLetter } = useAuthorityLetters();
</script>
