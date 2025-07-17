<template>
	<div class="h-full rounded-md bg-white p-8 shadow-sm">
		<div class="w-1/2 place-self-center">
			<div
				id="alert-additional-content-4"
				class="my-5 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800"
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
					<h3 class="text-sm font-semibold">Verify Collateral</h3>
				</div>

				<p class="mt-2 text-sm">
					Use the form below to search for collateral. Provide at least one field or all
					fields if possible to widen the search scope.
				</p>
			</div>
			<SearchDefaultersForm
				:search-loading="searchDefaulterLoading"
				@initiate-search="
					({ regNo, engineNo, chassisNo }) => {
						searchDefaulter('defaulter-db', regNo, engineNo, chassisNo);
					}
				" />
		</div>

		<!-- IA Vehicle Details results -->
		<div
			v-if="iaVehicleDetails"
			class="border-b border-dashed border-gray-300 py-5">
			<h1 class="mt-8 mb-4 font-semibold text-yellow-500">
				Showing Result From Identify Africa Database
			</h1>
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
			<h1 class="mt-8 mb-4 font-semibold text-yellow-500">
				Details of owner to whom vehicle was registered
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
			<h1 class="mt-8 mb-4 font-semibold text-yellow-500">
				Where this vehicle been used as collateral
			</h1>
			<IAVehicleColateralResultsCard :entries="iaVehicleCollateralDetails" />
		</div>

		<!-- RAV fraud results -->
		<template v-if="ravDefaulterDetails && ravDefaulterDetails.length > 0">
			<RAVDatabaseFraudResultsCard
				v-for="(r, idx) in ravDefaulterDetails"
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
				:contact-person-phone="r.corpClientPhoneNumber"
				:incident-description="r.description" />
		</template>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'collateral-verification-query-collateral',
		layout: 'console-layout',
	});

	const {
		searchDefaulterLoading,
		iaVehicleDetails,
		iaVehicleCollateralDetails,
		iaVehicleOwnerDetails,
		ravDefaulterDetails,
		searchCollateralType,
		searchDefaulter,
		collateralSearchOptions,
	} = useCollateralVerificiation();

	onMounted(() => (searchCollateralType.value = collateralSearchOptions));
</script>
