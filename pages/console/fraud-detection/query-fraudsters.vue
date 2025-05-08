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

		<!-- IA DB results -->
		<div
			v-if="iaDBResults"
			class="border-b border-dashed border-gray-300 py-5">
			<h1 class="mb-4 mt-8 text-lg">Showing Result From Identify Africa Database</h1>
			<IADatabaseFraudResultsCard
				:reg-no="iaDBResults.regNo"
				:year-of-manufacture="iaDBResults.vehicle.yearOfManufacture"
				:vehicle-make="iaDBResults.vehicle.carMake"
				:vehicle-model="iaDBResults.vehicle.carModel"
				:chassis-number="iaDBResults.vehicle.ChassisNo"
				:engine-number="iaDBResults.vehicle.engineNumber"
				:vehicle-color="iaDBResults.color"
                :fuel-type="iaDBResults.vehicle.fuel_type"
                :passenger-capacity="iaDBResults.vehicle.passengerCapacity" />
		</div>

		<!-- RAV DB results -->
		<template v-if="ravDBResults && ravDBResults.length > 0">
			<h1 class="mb-4 mt-8 text-lg">
				Showing {{ ravDBResults.length }} Results From Regent Auto Valuers Database
			</h1>
			<RAVDatabaseFraudResultsCard
				v-for="(r, idx) in ravDBResults"
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
				:defrauded-institution="r.corporateClientName" />
		</template>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'fraud-detection-query-fraudsters',
		layout: 'console-layout',
	});

	const {
		searchQuery,
		searchFraudsterLoading,
		searchIdentifyAfricaDatabase,
		ravDBResults,
		iaDBResults,
		searchFraudster,
	} = useFraudDetection();
</script>
