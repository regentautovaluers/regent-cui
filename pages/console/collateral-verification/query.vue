<template>
	<form
		@submit.prevent="searchDefaulter"
		class="mt-5 w-full">
		<h3 class="text-base font-semibold text-gray-500">Search From Database Type:</h3>
		<div
			class="tablet:grid-cols-3 laptop:grid-cols-4 desktop:grid-cols-5 mt-3 grid grid-cols-2 gap-4">
			<template
				v-for="(option, index) in searchCollateralTypeOptions"
				:key="index">
				<!-- render a label for checks with no modal -->
				<label
					v-if="!option.opensInModal"
					:for="option.id"
					:class="[
						'inline-flex h-18 w-full cursor-pointer items-center justify-center space-x-2 rounded-md border p-3 text-gray-500 hover:bg-blue-100/50 hover:text-blue-500 active:scale-105',
						{
							'bg-blue-600 text-white': searchCollateralType.id === option.id,
						},
					]">
					<input
						type="radio"
						name="search-option"
						:id="option.id"
						:value="option"
						v-model="searchCollateralType"
						hidden />
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="25"
						height="25"
						viewBox="0 0 32 32">
						<path
							fill="currentColor"
							d="M16 2H8.25A3.25 3.25 0 0 0 5 5.25v21.5A3.25 3.25 0 0 0 8.25 30h15.5A3.25 3.25 0 0 0 27 26.75V13h-7.75A3.25 3.25 0 0 1 16 9.75zm10.863 9a3.25 3.25 0 0 0-.815-1.366l-6.682-6.682A3.25 3.25 0 0 0 18 2.136V9.75c0 .69.56 1.25 1.25 1.25z" />
					</svg>
					<span class="text-sm font-semibold text-inherit">{{ option.name }}</span>
				</label>

				<!-- render a button for checks with a modal -->
				<button
					v-else
					type="button"
					@click="searchCollateralType = option"
					:class="[
						'inline-flex h-18 w-full cursor-pointer items-center justify-center space-x-2 rounded-md border p-3 text-gray-500 hover:bg-blue-100/50 hover:text-blue-500 active:scale-105',
						{
							'bg-blue-600 text-white': searchCollateralType.id === option.id,
						},
					]"
					:data-modal-target="`verify-${option.id}-modal`"
					:data-modal-toggle="`verify-${option.id}-modal`">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="25"
						height="25"
						viewBox="0 0 32 32">
						<path
							fill="currentColor"
							d="M16 2H8.25A3.25 3.25 0 0 0 5 5.25v21.5A3.25 3.25 0 0 0 8.25 30h15.5A3.25 3.25 0 0 0 27 26.75V13h-7.75A3.25 3.25 0 0 1 16 9.75zm10.863 9a3.25 3.25 0 0 0-.815-1.366l-6.682-6.682A3.25 3.25 0 0 0 18 2.136V9.75c0 .69.56 1.25 1.25 1.25z" />
					</svg>
					<span class="text-sm font-semibold text-inherit">{{ option.name }}</span>
				</button>
			</template>
		</div>
		<div
			class="laptop:w-1/2 laptop-lg:w-1/3 relative mt-5 flex w-full items-center justify-between"
			v-if="
				searchCollateralTypeOptions
					.filter((e) => !e.opensInModal)
					.includes(searchCollateralType)
			">
			<input
				type="text"
				class="generic-input"
				:placeholder="searchCollateralType.prompt"
				v-model="searchDefaulterQuery" />
			<button
				type="submit"
				class="generic-search-submit-button">
				<FormSubmissionLoader
					class="size-6 animate-spin text-white"
					v-if="searchDefaulterLoading" />
				<SearchIcon v-else />
			</button>
		</div>
	</form>

	<!-- IA Vehicle Details results -->
	<div
		v-if="iaVehicleDetails"
		class="border-b border-dashed border-gray-300 py-5">
		<h1 class="mt-8 mb-4 text-lg font-semibold text-yellow-500">
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
		<h1 class="mt-8 mb-4 text-lg font-semibold text-yellow-500">
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
		<h1 class="mt-8 mb-4 text-lg font-semibold text-yellow-500">
			Where this vehicle been used as collateral
		</h1>
		<IAVehicleColateralResultsCard :entries="iaVehicleCollateralDetails" />
	</div>

	<!-- RAV fraud results -->
	<template v-if="ravDefaulterDetails && ravDefaulterDetails.length > 0">
		<h1 class="mt-8 mb-4 font-semibold text-yellow-500">
			Showing {{ ravDefaulterDetails.length }} Result(s) From Regent Auto Valuers Database
		</h1>
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
			:contact-person-phone="r.corpClientPhoneNumber" />
	</template>

	<!-- Verify National ID -->
	<ParentModal
		modal-id="verify-national-id-modal"
		modal-title="Verify National ID">
		<NationalIDVerficiationForm />
	</ParentModal>

	<!-- Verify Alien ID -->
	<ParentModal
		modal-id="verify-alien-id-modal"
		modal-title="Verify Alien ID">
		<AlienIDVerficiationForm />
	</ParentModal>

	<!-- Verify Driving License -->
	<ParentModal
		modal-id="verify-driving-license-modal"
		modal-title="Verify Driving License">
		<VerifyDrivingLicenseForm />
	</ParentModal>

	<!-- Verify KRA PIN -->
	<ParentModal
		modal-id="verify-kra-pin-modal"
		modal-title="Verify KRA PIN">
		<VerifyKRAPinForm />
	</ParentModal>

	<!-- Verify Business -->
	<ParentModal
		modal-id="verify-business-modal"
		modal-title="Verify Business">
		<h1>Verify Business</h1>
	</ParentModal>

	<!-- Verify Bank Account -->
	<ParentModal
		modal-id="verify-bank-account-modal"
		modal-title="Verify Bank Account">
		<VerifyBankAccountForm />
	</ParentModal>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'collateral-verification-query',
		layout: 'console-layout',
	});

	const {
		searchDefaulterQuery,
		responseData,
		collateralCheckLoading,
		searchDefaulterLoading,
		fetchBankListStatus,
		executeFetchBankList,
		bankList,
		searchCollateralType,
		searchCollateralTypeOptions,
		iaVehicleDetails,
		iaVehicleCollateralDetails,
		iaVehicleOwnerDetails,
		ravDefaulterDetails,
		verifyCollateral,
		searchDefaulter,
	} = useCollateralVerification();
</script>
