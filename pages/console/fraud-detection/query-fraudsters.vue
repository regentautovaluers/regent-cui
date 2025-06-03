<template>
	<div class="mt-10">
		<h1 class="text-center text-4xl font-semibold">Query Database</h1>
		<h2 class="mt-5 text-center text-xl text-gray-500">
			Query our extensive fraud database with over 23,000 flagged vehicles
		</h2>

		<form
			@submit.prevent="searchFraudster"
			class="mt-5 flex w-full flex-col items-center">
			<!-- Relevant -->
			<div class="w-full lg:w-1/2">
				<input
					type="text"
					id="relevant-links"
					class="generic-input h-16 text-lg"
					placeholder="Enter Vehicle's Registration Number, Chassis Number, Engine Number..."
					v-model="searchQuery"
					required />
			</div>

			<h3 class="mt-10 text-xl font-semibold">Search From Database</h3>
			<div class="mt-3 flex items-center space-x-5">
				<div class="flex items-center">
					<input
						checked
						id="rav-db"
						type="radio"
						name="forward-search-to-ia"
						:value="false"
						class="size-7 rounded-md border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
						v-model="searchIdentifyAfricaDatabase" />
					<label
						for="rav-db"
						class="font-base ms-2 w-full py-4 text-lg text-gray-500"
						>Regent Auto Valuers Database</label
					>
				</div>
				<div class="flex items-center">
					<input
						id="ia-db"
						type="radio"
						name="forward-search-to-ia"
						:value="true"
						class="size-7 rounded-md border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
						v-model="searchIdentifyAfricaDatabase" />
					<label
						for="ia-db"
						class="font-base ms-2 w-full py-4 text-lg text-gray-500"
						>Identify Africa Database</label
					>
				</div>
			</div>

			<!-- submit button -->
			<button
				type="submit"
				class="generic-form-submit mt-4 w-full md:w-1/3">
				<FormSubmissionLoader
					classes="mr-2 size-6 animate-spin text-white"
					v-if="searchFraudsterLoading" />
				{{ searchFraudsterLoading ? 'Processing' : 'Search Database' }}
			</button>
		</form>

		<!-- IA Vehicle Details results -->
		<div
			v-if="iaVehicleDetails"
			class="border-b border-dashed border-gray-300 py-5">
			<h1 class="mb-4 mt-8 text-lg font-semibold text-yellow-500">
				Showing Result From Identify Africa Database
			</h1>

			<!-- Notice on IA DB Results -->
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
					<h3 class="text-lg font-medium">Consumer Notice</h3>
				</div>
				<div class="mb-4 mt-2">
					<p>
						Identify Africa allows you to cross check the vehicle details as they were
						recorded as the vehicle was being registered at the relevant government
						level, alongside where the vehicle has been used as collateral, e.g. for a
						loan. The data may not be up to date as it relies on proper jurisdictional
						procedures e.g. when selling a vehicle, for this record to be updated.
						Consumption of this data is at your own discretion.
					</p>
				</div>
			</div>

			<IAVehicleDetailsResultsCard
				:reg-no="iaVehicleDetails.regNo"
				:year-of-manufacture="iaVehicleDetails.yearOfManufacture"
				:vehicle-make="iaVehicleDetails.carMake"
				:vehicle-model="iaVehicleDetails.carModel"
				:chassis-number="iaVehicleDetails.ChassisNo"
				:engine-number="iaVehicleDetails.engineNumber"
				:vehicle-color="iaVehicleDetails.color"
				:fuel-type="iaVehicleDetails.fuel_type"
				:passenger-capacity="iaVehicleDetails.passengerCapacity" />
		</div>

		<!-- vehicle owner results -->
		<div
			v-if="iaVehicleOwnerDetails"
			class="border-b border-dashed border-gray-300 pb-5">
			<h1 class="mb-4 mt-8 text-lg font-semibold text-yellow-500">
				Details of owner when vehicle was registered
			</h1>
			<IAVehicleOwnerDetails
				:name="`${iaVehicleOwnerDetails.FIRSTNAME} ${iaVehicleOwnerDetails.LASTNAME}`"
				:id-number="iaVehicleOwnerDetails.ID_NUMBER"
				:address="iaVehicleOwnerDetails.ADDRESS"
				:phone-numer="iaVehicleOwnerDetails.TELNO"
				:town="iaVehicleOwnerDetails.TOWN"
				:owner-type="iaVehicleOwnerDetails.OWNER_TYPE" />
		</div>

		<!-- collateral results -->
		<div
			v-if="iaVehicleCollateralDetails"
			class="border-b border-dashed border-gray-300 pb-5">
			<h1 class="mb-4 mt-8 text-lg font-semibold text-yellow-500">
				Where this vehicle been used as collateral
			</h1>
			<IAVehicleColateralResultsCard :entries="iaVehicleCollateralDetails" />
		</div>

		<!-- RAV fraud results -->
		<template v-if="ravFraudDetails && ravFraudDetails.length > 0">
			<h1 class="mb-4 mt-8 text-lg font-semibold text-yellow-500">
				Showing {{ ravFraudDetails.length }} Result(s) From Regent Auto Valuers Database
			</h1>
			<!-- Notice on RAVDB resulr -->
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
					<h3 class="text-lg font-medium">Consumer Notice</h3>
				</div>
				<div class="mb-4 mt-2">
					<p>
						According to our fraud database, this vehicle has been flagged for fraud
						cases a total of {{ ravFraudDetails.length }} time(s). Kindly be aware that
						this data is being presented to you as it currently exists in our database,
						and thus, records may not be up to date. Consumption of this data is at your
						own discretion.
					</p>
				</div>
			</div>
			<RAVDatabaseFraudResultsCard
				v-for="(r, idx) in ravFraudDetails"
				:key="idx"
				:reg-no="r.registrationNumber"
				:year-of-manufacture="r.yearOfManufacture"
				:vehicle-make="r.make"
				:vehicle-model="r.model"
				:chassis-number="r.chassisNumber"
				:engine-number="r.engineNumber"
				:vehicle-color="r.color"
				:defaulted-amount="r.amountDefaulted"
				:incident-date="r.dateOfIncident"
				:defrauded-institution="r.corporateClientName"
				:contact-person-name="r.corporateClientName"
				:contact-person-email="r.corpClientEmail"
				:contact-person-phone="r.corpClientPhoneNumber" />
		</template>
	</div>
</template>

<script setup lang="ts">
	import IAVehicleColateralResultsCard from '~/components/misc/IAVehicleColateralResultsCard.vue';
	import IAVehicleDetailsResultsCard from '~/components/misc/IAVehicleDetailsResultsCard.vue';

	definePageMeta({
		name: 'fraud-detection-query-fraudsters',
		layout: 'console-layout',
	});

	const {
		searchQuery,
		searchFraudsterLoading,
		searchIdentifyAfricaDatabase,
		ravFraudDetails,
		iaVehicleDetails,
		iaVehicleCollateralDetails,
		iaVehicleOwnerDetails,
		searchFraudster,
	} = useFraudDetection();
</script>
