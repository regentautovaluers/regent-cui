<template>
	<form @submit.prevent="editDefaulterEntry(editDefaulter, entryId)">
		<div class="flex flex-col space-y-4 space-x-0 lg:flex-row lg:space-y-0 lg:space-x-4">
			<!-- Registration Number -->
			<div class="w-full lg:w-1/2">
				<label
					for="registration-number"
					class="generic-input-label generic-input-required-label text-xs"
					>Registration Number</label
				>
				<input
					type="text"
					id="registration-number "
					class="generic-input h-[50px]"
					placeholder="e.g KDH 908Y"
					required
					v-model="editDefaulter.registrationNumber" />
			</div>
			<!-- Chassis Number -->
			<div class="w-full lg:w-1/2">
				<label
					for="chassis-number"
					class="generic-input-label generic-input-required-label text-xs"
					>Chassis Number</label
				>
				<input
					type="text"
					id="chassis-number"
					class="generic-input h-[50px]"
					placeholder="e.g 318292GHJSk56FGFS"
					required
					v-model="editDefaulter.chassisNumber" />
			</div>
		</div>

		<div class="mt-5 flex flex-col space-y-4 space-x-0 lg:flex-row lg:space-y-0 lg:space-x-4">
			<!-- Engine Number -->
			<div class="w-full lg:w-1/2">
				<label
					for="engine-number"
					class="generic-input-label generic-input-required-label text-xs"
					>Engine Number</label
				>
				<input
					type="text"
					id="engine-number"
					class="generic-input h-[50px]"
					placeholder="e.g 123456XYZ"
					required
					v-model="editDefaulter.engineNumber" />
			</div>

			<!-- Vehicle Color -->
			<div class="w-full lg:w-1/2">
				<label
					for="vehicle-color"
					class="generic-input-label text-xs"
					>Vehicle Color</label
				>
				<input
					type="text"
					id="vehicle-color"
					class="generic-input h-[50px]"
					placeholder="e.g Red"
					v-model="editDefaulter.color" />
			</div>
			<!-- Vehicle Make -->
		</div>

		<div class="mt-5 flex flex-col space-y-4 space-x-0 lg:flex-row lg:space-y-0 lg:space-x-4">
			<!-- Vehicle Make -->
			<div class="w-full lg:w-1/2">
				<label
					for="vehicle-make"
					class="generic-input-label generic-input-required-label text-xs"
					>Vehicle Make</label
				>
				<input
					type="text"
					id="vehicle-make"
					class="generic-input h-[50px]"
					placeholder="e.g Mazda"
					required
					v-model="editDefaulter.make" />
			</div>
			<!-- Vehicle Model -->
			<div class="w-full lg:w-1/2">
				<label
					for="vehicle-model"
					class="generic-input-label generic-input-required-label text-xs"
					>Vehicle Model</label
				>
				<input
					type="text"
					id="vehicle-model"
					class="generic-input h-[50px]"
					placeholder="e.g Demio"
					required
					v-model="editDefaulter.model" />
			</div>
		</div>

		<!-- Incident Description -->
		<div class="mt-5">
			<label
				for="incident-description"
				class="generic-input-label text-xs"
				>Incident Description</label
			>
			<textarea
				id="incident-description"
				class="generic-text-area"
				rows="4"
				placeholder="Provide an optional extra description for this incident"
				v-model="editDefaulter.description"></textarea>
		</div>

		<div class="mt-5 flex flex-col space-y-4 space-x-0 lg:flex-row lg:space-y-0 lg:space-x-4">
			<!-- Date of the incident -->
			<div class="w-full lg:w-1/2">
				<label
					for="date-of-incident"
					class="generic-input-label text-xs"
					>Date of Incident</label
				>
				<!-- format yyyy-mm-dd -->
				<input
					type="date"
					id="date-of-incident"
					class="generic-input h-[50px]"
					placeholder="e.g 2024-01-17"
					pattern="\d{4}-\d{2}-\d{2}"
					v-model="editDefaulter.dateOfIncident" />
			</div>
			<!-- Amount Defaulted -->
			<div class="w-full lg:w-1/2">
				<label
					for="amount-defaulted"
					class="generic-input-label text-xs"
					>Amount Defaulted</label
				>
				<input
					type="text"
					id="amount-defaulted"
					class="generic-input h-[50px]"
					placeholder="e.g 15,000"
					v-model="editDefaulter.amountDefaulted" />
			</div>
		</div>
		<div class="mt-5 space-y-4">
			<!-- Relevant links -->
			<div class="relative">
				<label
					for="relevant-links"
					class="generic-input-label text-xs"
					>Relevant Link(s)</label
				>
				<input
					type="text"
					id="relevant-links"
					class="generic-input h-[50px]"
					placeholder="e.g link to a court case"
					v-model="relevantLink" />

				<button
					@click.prevent="
						() => {
							editDefaulter.relevantLinks.push(relevantLink as string);
						}
					"
					:disabled="!relevantLink"
					class="absolute top-1/2 right-3 size-7 -translate-y-[10%] cursor-pointer rounded-full bg-blue-600 text-white enabled:hover:bg-blue-700 disabled:bg-gray-400 disabled:text-slate-100"
					type="button">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="28"
						height="28"
						viewBox="0 0 32 32">
						<path
							fill="currentColor"
							d="M16 2A14.173 14.173 0 0 0 2 16a14.173 14.173 0 0 0 14 14a14.173 14.173 0 0 0 14-14A14.173 14.173 0 0 0 16 2m8 15h-7v7h-2v-7H8v-2h7V8h2v7h7Z" />
						<path
							fill="none"
							d="M24 17h-7v7h-2v-7H8v-2h7V8h2v7h7z" />
					</svg>
				</button>
			</div>
		</div>

		<div
			v-if="editDefaulter.relevantLinks.length > 0"
			class="mt-3 p-2">
			<h1 class="text-sm font-semibold text-gray-500">Provided Links</h1>
			<div class="flex flex-wrap items-center">
				<span
					v-for="(link, index) in editDefaulter.relevantLinks"
					:key="index"
					class="my-1 mr-2 flex w-fit items-center space-x-2 rounded-full border border-yellow-300 bg-yellow-50 px-2 py-1 text-sm whitespace-nowrap text-yellow-800">
					<a
						:href="link"
						target="_blank"
						>{{ link }}</a
					>
					<button
						class="inline-flex size-5 cursor-pointer items-center justify-center rounded-full border border-yellow-300"
						type="button"
						@click="
							() => {
								editDefaulter.relevantLinks.splice(index, 1);
							}
						">
						<span class="ic--round-close size-[16px]"></span>
					</button>
				</span>
			</div>
		</div>

		<!-- submit button -->
		<button
			type="submit"
			:class="[
				'generic-form-submit mt-4 w-full',
				editDefaulterLoading && 'skeleton skeleton-animated',
			]">
			{{ editDefaulterLoading ? 'Please Wait...' : 'Edit Entry' }}
		</button>
	</form>
</template>

<script setup lang="ts">
	const { getPrincipal } = useAuth();
	const props = defineProps({
		collateralEntry: {
			required: true,
		},
		entryId: {
			required: true,
			type: String,
		},
	});
	const {
		editDefaulterLoading,
		relevantLink,
		createFraudsterEntry,
		editDefaulterEntry,
		handleAppendingRelevantLink,
		handleRemovingRelevantLink,
	} = useFraudDetection();

	// edit fraud entry
	const editDefaulter = reactive({
		registrationNumber: (props.collateralEntry as any).registrationNumber,
		chassisNumber: (props.collateralEntry as any).chassisNumber,
		engineNumber: (props.collateralEntry as any).engineNumber,
		color: (props.collateralEntry as any).color,
		make: (props.collateralEntry as any).make,
		model: (props.collateralEntry as any).model,
		yearOfManufacture: (props.collateralEntry as any).yearOfManufacture,
		corporateClientId: getPrincipal.?.corpId,
		corporateClientName: getPrincipal.?.corpName,
		corpClientRepName: getPrincipal.?.username,
		corpClientEmail: getPrincipal.?.email,
		corpClientPhoneNumber: getPrincipal.?.phonenumber,
		description: (props.collateralEntry as any).description,
		relevantLinks: (props.collateralEntry as any).relevantLinks as string[],
		dateOfIncident: (props.collateralEntry as any).dateOfIncident,
		amountDefaulted: (props.collateralEntry as any).amountDefaulted,
	});
</script>
