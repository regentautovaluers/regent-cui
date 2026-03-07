<template>
	<div class="space-y-3">
		<!-- preliminary info -->
		<div class="rounded-lg bg-gray-200/80 p-4 outline-none">
			<h1 class="col-span-2 font-bold text-gray-700">Request Information</h1>
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
					{{ updateAuthorizationLetterLoading ? 'Please Wait...' : 'Update Details' }}
				</button>
			</form>
		</div>

		<h1 class="font-bold text-gray-700">Request Updates</h1>
		<!-- comment -->
		<div
			class="borer-blue-200 min-h-32 space-y-2 rounded-lg border bg-blue-100 px-4 py-2 outline-none">
			<div
				v-if="authorityLetter.feedbackTrail && authorityLetter.feedbackTrail?.length > 0"
				v-for="(ft, idx) in authorityLetter.feedbackTrail"
				:key="idx"
				class="flex items-center space-x-3">
				<div class="flex items-center space-x-1">
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
		<!-- Preffered Regent Branch -->
		<div
			class="mt-4 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800"
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
				<h3 class="text-sm font-medium">Authority Letter Download Issue</h3>
			</div>

			<div class="my-2">
				<p class="text-sm">
					We are aware of a known issue that causes Regent's Authority Letter either:
				</p>
				<ol class="my-2 list-inside list-decimal ps-3 text-sm">
					<li>Showing up under the name 'Electronic'</li>
					<li>Not allowing downloads in some instances</li>
					<li>Not entirely being available even under the wrong name</li>
				</ol>
				<p class="text-sm">
					We dearly appologize for any inconvenience that these might have caused. As we
					work to resolve this issue,
					<span class="font-bold">if you are affected by issues 2 or 3</span> above,
					kindly use the <span class="italic">Regenerate Letter </span> button below to
					generate and download a letter on the go.
				</p>
			</div>
			<div class="flex">
				<button
					type="button"
					class="group inline-flex items-center space-x-2 rounded-lg border border-yellow-800 bg-transparent px-3 py-1.5 text-center text-yellow-800 hover:bg-yellow-900 hover:text-white focus:ring-4 focus:ring-yellow-300 focus:outline-none"
					@click.prevent="generateAuthorityLetter(authorityLetter)"
					:disabled="generateAuthorizationLetterLoading">
					<span class="text-sm font-medium">Regenerate Letter</span>
					<span
						class="icon-[svg-spinners--ring-resize] size-4 text-yellow-800 group-hover:text-white"
						v-if="generateAuthorizationLetterLoading"></span>
				</button>
			</div>
		</div>

		<!-- provided docs -->
		<div class="flex flex-wrap">
			<a
				v-for="(e, idx) in authorityLetter.uploadedDocuments"
				:key="idx"
				target="_blank"
				:href="(e as string).split(': ')[1]"
				class="mr-2 inline-flex w-fit items-center justify-between space-x-2 rounded-full border border-yellow-600 px-2 py-1 shadow-xs transition-colors duration-150 ease-in-out hover:bg-yellow-200">
				<span class="text-sm text-yellow-600">{{ (e as string).split(': ')[0] }}</span>
				<span
					class="icon-[material-symbols-light--sim-card-download] size-7 text-yellow-600"></span>
			</a>
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
	const { generateAuthorityLetter, generateAuthorizationLetterLoading } =
		useExportValuationAssets();
</script>
