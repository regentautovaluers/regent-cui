<template>
	<div class="space-y-2">
		<!-- preliminary info -->
		<div class="rounded-lg bg-gray-200/80 p-3 outline-none">
			<h1 class="col-span-2 text-sm font-bold text-gray-700">Request Information</h1>
			<form
				@submit.prevent="
					updateAuthorizationLetter(
						registrationNumber,
						clientName,
						clientPhone,
						authorityLetter.letterId,
					)
				">
				<div
					class="flex flex-col space-y-4 space-x-0 lg:flex-row lg:space-y-0 lg:space-x-4">
					<!-- Registration Number -->
					<div class="w-full lg:w-1/2">
						<label
							for="registration-number"
							class="generic-input-label generic-input-required-label"
							>Reg. Number</label
						>
						<input
							type="text"
							id="registration-number"
							class="generic-input"
							placeholder="e.g KDH 908Y"
							required
							v-model="registrationNumber" />
					</div>

					<!-- Client Phone Number -->
					<div class="w-full lg:w-1/2">
						<label
							for="client-phone"
							class="generic-input-label generic-input-required-label"
							>Phone Number</label
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

				<!-- Client Name -->
				<div class="mt-2">
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

				<!-- submit button -->
				<button
					type="submit"
					:disabled="updateAuthorizationLetterLoading"
					:class="[
						'generic-form-submit mt-4 w-full md:w-1/3',
						updateAuthorizationLetterLoading && 'skeleton skeleton-animated',
					]">
					{{ updateAuthorizationLetterLoading ? 'Please Wait...' : 'Update Details' }}
				</button>
			</form>
		</div>

		<h1 class="text-sm font-bold text-gray-700">Request Updates</h1>
		<!-- comment -->
		<div
			class="borer-blue-200 min-h-32 space-y-2 rounded-lg border bg-blue-100 p-3 outline-none">
			<div
				v-if="authorityLetter.feedbackTrail && authorityLetter.feedbackTrail?.length > 0"
				v-for="(ft, idx) in authorityLetter.feedbackTrail"
				:key="idx"
				class="flex items-center space-x-3">
				<h3
					class="inline-flex flex-col space-x-1 text-sm font-semibold whitespace-nowrap text-gray-700">
					<span class="text-xs">{{ (ft.dateAdded as string).replace('T', ' ') }}</span>
					<span class="font-medium">{{
						ft.addedByRegentUser?.username ?? ft.addedByCorporateUser?.username
					}}</span>
				</h3>
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
	</div>
</template>

<script setup lang="ts">
	import type { AuthorityLetter } from '~/types/corporate-valuations/authority-letters';

	const { authorityLetter } = defineProps<{
		authorityLetter: AuthorityLetter;
	}>();

	const registrationNumber: Ref<string> = ref(authorityLetter.registrationNumber);
	const clientName: Ref<string> = ref(authorityLetter.clientName);
	const clientPhone: Ref<string> = ref(authorityLetter.clientPhone);
	const { updateAuthorizationLetterLoading, updateAuthorizationLetter } = useAuthorityLetters();
</script>
