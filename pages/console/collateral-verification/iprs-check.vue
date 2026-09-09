<template>
	<div
		class="laptop:grid-cols-[20%_80%] laptop:p-4 laptop:flex-1 grid grid-cols-1 rounded-lg border-2 bg-white p-2 outline-none">
		<div
			class="laptop-lg:border-b-0 laptop-lg:border-r-[1px] laptop:h-full h-fit border-b-[1px] p-2">
			<h1 class="text-sm font-semibold text-blue-600">What are you looking to verify?</h1>
			<h2 class="text-sm text-gray-500">
				<span>Click on any of these, then submit the relevant form to view findings.</span
				><span
					>Kindly note that you have
					<b>{{ getCollateralVerificationTokenInfo?.balance ?? 'N/A' }}</b> search tokens
					left. Checks you are not allowed to perform with this limit will be
					disabled!</span
				>
			</h2>
			<div
				id="accordion-flush"
				data-accordion="collapse"
				data-active-classes="bg-blue-600 font-semibold text-slate-100"
				data-inactive-classes="text-gray-500"
				class="laptop:space-y-4 laptop:space-x-0 laptop:flex-col hide-scrollbar my-2 flex space-x-4 overflow-x-scroll">
				<!-- National ID -->
				<div class="min-w-72 space-y-2">
					<button
						
						type="button"
						class="laptop:w-full flex h-14 w-full items-center justify-between gap-3 rounded-lg border border-gray-200 p-4 text-xs font-medium text-gray-500 disabled:bg-gray-200"
						data-accordion-target="#accordion-flush-body-3"
						aria-controls="accordion-flush-body-3"
						@click="() => (checkType = 'national-id')">
						<span>National ID</span>
						<svg
							data-accordion-icon
							class="size-[8px] shrink-0 rotate-180"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 10 6">
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5 5 1 1 5" />
						</svg>
					</button>
					<div
						id="accordion-flush-body-3"
						class="hidden"
						aria-labelledby="accordion-flush-heading-1">
						<div class="rounded-lg border p-2 py-5 shadow-sm">
							<form
								class="space-y-2"
								@submit.prevent="
									verifyCollateral({
										corporateId: getPrincipal()?.corpOrganization.corpId,
										idNumber: searchQuery,
									})
								">
								<input
									type="text"
									class="generic-input h-[50px]"
									placeholder="Provide National ID"
									v-model="searchQuery"
									pattern="[0-9]*" />
								<!-- submit button -->
								<button
									type="submit"
									:class="[
										'generic-form-submit h-[50px] shadow-none',
										collateralCheckLoading && 'skeleton skeleton-animated',
									]">
									{{ collateralCheckLoading ? 'Please Wait...' : 'Search' }}
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="flex flex-1 flex-col p-2">
			<h1 class="text-sm font-bold text-gray-500">Results will show here</h1>

			<!-- RAV fraud results -->
			<div
				class="my-5 border-b border-dashed border-gray-300"
				v-if="ravDefaulterDetails && ravDefaulterDetails.length > 0">
				<h1 class="text-sm font-bold text-blue-600">Results from Our DB</h1>
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
			</div>

			<!-- national ID results -->
			<div
				class="mt-5 space-y-2 text-sm text-gray-500"
				v-if="responseData && checkType == 'national-id'">
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">First Name</span>
					<span>{{ responseData.First_Name ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Last Name</span>
					<span>{{ responseData.Surname ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Other Name</span>
					<span>{{ responseData.Other_Name ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Gender</span>
					<span>{{ responseData.gender ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Date of Birth</span>
					<span>{{ responseData.dob ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Citizenship</span>
					<span>{{ responseData.citizenship ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Serial Number</span>
					<span>{{ responseData.id_number ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Is Valid</span>
					<span>{{ responseData.valid ?? 'N/A' }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'collateral-iprs-check',
		layout: 'console-layout',
	});

	// extra search fields
	const searchQuery: Ref<string> = ref('');

	// from composable
	const {
		searchDefaulterQuery,
		searchDefaulterLoading,
		iaVehicleDetails,
		iaVehicleCollateralDetails,
		iaVehicleOwnerDetails,
		searchCollateralType,
		checkType,
		collateralCheckLoading,
		responseData,
		ravDefaulterDetails,
		verifyCollateral,
		searchDefaulter,
	} = useCollateralVerificiation();

	const { shouldAllowSearch, getCollateralVerificationTokenInfo } =
		useCollateralVerificationTokensManagement();
	const { getPrincipal } = useAuth();

	watch([checkType, searchCollateralType], (_newValue) => {
		responseData.value = null;
		searchDefaulterQuery.value = '';
		searchQuery.value = '';
		ravDefaulterDetails.value = [];
		iaVehicleOwnerDetails.value = null;
		iaVehicleCollateralDetails.value = null;
		iaVehicleDetails.value = null;
	});
</script>
