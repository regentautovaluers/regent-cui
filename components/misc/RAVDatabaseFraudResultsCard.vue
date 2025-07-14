<template>
	<div class="mt-4 h-fit min-h-32 rounded-md border border-gray-100 bg-white p-8 shadow-md">
		<h1 class="font-semibold">
			{{ props.regNo }} - (Year Of Manufacture) {{ props.yearOfManufacture }} -
			{{ props.vehicleMake }}
			{{ props.vehicleModel }}
		</h1>
		<div class="mt-2 flex h-12 items-center space-x-5 border-b border-gray-300">
			<div class="flex w-fit items-center space-x-2 text-sm text-gray-600">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M2 4h2v16H2zm4 0h1v16H6zm2 0h2v16H8zm3 0h2v16h-2zm3 0h2v16h-2zm3 0h1v16h-1zm2 0h3v16h-3z" />
				</svg>
				<span>Chassis No: {{ props.chassisNumber }}</span>
			</div>
			<div class="flex w-fit items-center space-x-2 text-sm text-gray-600">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M7 4v2h3v2H7l-2 2v3H3v-3H1v8h2v-3h2v3h3l2 2h8v-4h2v3h3V9h-3v3h-2V8h-6V6h3V4z" />
				</svg>
				<span class="text-gray-600">Engine No: {{ props.engineNumber }}</span>
			</div>
			<div class="flex w-fit items-center space-x-2 text-sm text-gray-600">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24">
					<g fill="none">
						<path
							d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
						<path
							fill="currentColor"
							d="M3 5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3h1a2 2 0 0 1 2 2v1.38a5 5 0 0 1-4.503 4.975l-5.497.55V14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2v-.095a2 2 0 0 1 1.801-1.99l5.498-.55A3 3 0 0 0 20 8.38V7h-1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" />
					</g>
				</svg>
				<span class="text-gray-600">Color: {{ props.vehicleColor }}</span>
			</div>
		</div>
		<div
			class="tablet:grid-cols-2 tablet:divide-x tablet:divide-y-0 grid min-h-20 grid-cols-1 divide-y divide-gray-300">
			<div class="min-h-full py-5">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="40"
					height="40"
					viewBox="0 0 16 16">
					<path
						fill="none"
						stroke="currentColor"
						d="M4 11h1m1 0h1M6 8h1M4 8h1M4 5h1m1 0h1m6.5 8.5h-11v-11h6v5h5zm-5-4h3v4h-3z"
						stroke-width="1" />
				</svg>
				<h1 class="my-2 text-sm font-semibold">Defrauded Institution</h1>
				<div
					class="mt-2 grid w-full grid-cols-2 gap-2 rounded-lg text-sm text-gray-600 xl:w-3/4">
					<div>
						<h1 class="font-semibold">Name</h1>
					</div>
					<div>
						<span>{{ props.defraudedInstitution }}</span>
					</div>
					<div>
						<h1 class="font-semibold">Defaulted Amount</h1>
					</div>
					<div>
						<span
							>{{
								Intl.NumberFormat('en-US', {
									minimumFractionDigits: 0,
									maximumFractionDigits: 0,
								}).format(Number(props.defaultedAmount))
							}}
							Ksh</span
						>
					</div>
					<div>
						<h1 class="font-semibold">Incident Date</h1>
					</div>
					<div>
						<span>{{ props.incidentDate }}</span>
					</div>
				</div>
			</div>
			<div class="p-5">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="40"
					height="40"
					viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M19.95 21q-3.125 0-6.187-1.35T8.2 15.8t-3.85-5.55T3 4.05V3h5.9l.925 5.025l-2.85 2.875q.55.975 1.225 1.85t1.45 1.625q.725.725 1.588 1.388T13.1 17l2.9-2.9l5 1.025V21z" />
				</svg>
				<h1 class="my-2 text-sm font-semibold">Contact Person</h1>
				<div
					class="mt-2 grid w-full grid-cols-2 gap-2 rounded-lg text-sm text-gray-600 xl:w-3/4">
					<div>
						<h1 class="font-semibold">Name</h1>
					</div>
					<div>
						<span>{{ props.contactPersonName }}</span>
					</div>
					<div>
						<h1 class="font-semibold">Email</h1>
					</div>
					<div>
						<span>{{ props.contactPersonEmail }}</span>
					</div>
					<div>
						<h1 class="font-semibold">Phone</h1>
					</div>
					<div>
						<span>{{ props.contactPersonPhone }}</span>
					</div>
				</div>
			</div>
		</div>
		<div
			class="text-sm text-gray-500 border-t py-4"
			v-if="props.incidentDescription">
			<h1 class="font-semibold">Incident Description</h1>
			<p>{{ props.incidentDescription }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
	const props = defineProps({
		regNo: {
			type: String,
			required: true,
		},
		yearOfManufacture: {
			type: Number,
			required: true,
		},
		vehicleMake: {
			type: String,
			required: true,
		},
		vehicleModel: {
			type: String,
			required: true,
		},
		chassisNumber: {
			type: String,
			required: true,
		},
		engineNumber: {
			type: String,
			required: true,
		},
		vehicleColor: {
			type: String,
			required: true,
		},
		defaultedAmount: {
			type: String,
			required: true,
		},
		incidentDate: {
			type: String,
			required: true,
		},
		defraudedInstitution: {
			type: String,
			required: true,
		},
		contactPersonName: {
			type: String,
			required: true,
		},
		contactPersonEmail: {
			type: String,
			required: true,
		},
		contactPersonPhone: {
			type: String,
			required: true,
		},
		incidentDescription: {
			type: String,
			required: true,
		},
	});
</script>
