<template>
	<div
		class="laptop:grid-cols-[20%_80%] laptop:p-4 laptop-lg:p-8 laptop:flex-1 grid grid-cols-1 p-2">
		<div
			class="laptop-lg:border-b-0 laptop-lg:border-r-[1px] laptop:h-full h-fit border-b-[1px] p-2">
			<h1 class="text-sm font-semibold text-blue-600">What are you looking to verify?</h1>
			<h2 class="text-xs text-gray-500">
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
				<!-- vehicle registration -->
				<div class="min-w-72 space-y-2">
					<button
						:disabled="!shouldAllowSearch('vehicle-reg')"
						type="button"
						class="laptop:w-full flex h-14 w-full items-center justify-between gap-3 rounded-lg border border-gray-200 p-4 text-xs font-medium text-gray-500 disabled:bg-gray-200"
						data-accordion-target="#accordion-flush-body-1"
						aria-controls="accordion-flush-body-1"
						@click="
							() => {
								searchCollateralType = {
									id: 'vehicle-reg',
									name: 'Vehicle Plate',
									prompt: 'Enter vehicle reg number.',
									opensInModal: false,
								};
							}
						">
						<span>Vehicle Plate</span>
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
						id="accordion-flush-body-1"
						class="hidden"
						aria-labelledby="accordion-flush-heading-1">
						<div class="rounded-lg border p-2 py-5 shadow-sm">
							<form
								class="space-y-2"
								@submit.prevent="searchDefaulter()">
								<!-- search input -->
								<input
									type="text"
									class="generic-input h-[50px]"
									placeholder="Enter vehicle reg number"
									v-model="searchDefaulterQuery" />

								<!-- submit button -->
								<button
									type="submit"
									:class="[
										'generic-form-submit h-[50px] shadow-none',
										searchDefaulterLoading && 'skeleton skeleton-animated',
									]">
									{{ searchDefaulterLoading ? 'Please Wait...' : 'Search' }}
								</button>
							</form>
						</div>
					</div>
				</div>

				<!-- loan collateral -->
				<div class="min-w-72 space-y-2">
					<button
						:disabled="!shouldAllowSearch('loan-collateral')"
						type="button"
						class="laptop:w-full flex h-14 w-full items-center justify-between gap-3 rounded-lg border border-gray-200 p-4 text-xs font-medium text-gray-500 disabled:bg-gray-200"
						data-accordion-target="#accordion-flush-body-2"
						aria-controls="accordion-flush-body-2"
						@click="
							() => {
								searchCollateralType = {
									id: 'loan-collateral',
									name: 'Loan Collateral',
									prompt: 'Enter vehicle chassis number.',
									opensInModal: false,
								};
							}
						">
						<span>Loan Collateral</span>
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
						id="accordion-flush-body-2"
						class="hidden"
						aria-labelledby="accordion-flush-heading-1">
						<div class="rounded-lg border p-2 py-5 shadow-sm">
							<form
								class="space-y-2"
								@submit.prevent="searchDefaulter()">
								<!-- search input -->
								<input
									type="text"
									class="generic-input h-[50px]"
									placeholder="Enter vehicle chassis number"
									v-model="searchDefaulterQuery" />

								<!-- submit button -->
								<button
									type="submit"
									:class="[
										'generic-form-submit h-[50px] shadow-none',
										searchDefaulterLoading && 'skeleton skeleton-animated',
									]">
									{{ searchDefaulterLoading ? 'Please Wait...' : 'Search' }}
								</button>
							</form>
						</div>
					</div>
				</div>

				<!-- National ID -->
				<div class="min-w-72 space-y-2">
					<button
						:disabled="!shouldAllowSearch('national-id')"
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
									verifyCollateral(
										{
											idNumber: searchQuery,
										},
										'verify-national-id',
									)
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

				<!-- Alien ID -->
				<div class="min-w-72 space-y-2">
					<button
						:disabled="!shouldAllowSearch('alien-id')"
						type="button"
						class="laptop:w-full flex h-14 w-full items-center justify-between gap-3 rounded-lg border border-gray-200 p-4 text-xs font-medium text-gray-500 disabled:bg-gray-200"
						data-accordion-target="#accordion-flush-body-4"
						aria-controls="accordion-flush-body-4"
						@click="() => (checkType = 'alien-id')">
						<span>Alien ID</span>
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
						id="accordion-flush-body-4"
						class="hidden"
						aria-labelledby="accordion-flush-heading-1">
						<div class="rounded-lg border p-2 py-5 shadow-sm">
							<form
								class="space-y-2"
								@submit.prevent="
									verifyCollateral(
										{
											idNumber: searchQuery,
										},
										'verify-alien-id',
									)
								">
								<input
									type="text"
									class="generic-input h-[50px]"
									placeholder="Provide Alien ID"
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

				<!-- Driving license -->
				<div class="min-w-72 space-y-2">
					<button
						:disabled="!shouldAllowSearch('driving-license')"
						type="button"
						class="laptop:w-full flex h-14 w-full items-center justify-between gap-3 rounded-lg border border-gray-200 p-4 text-xs font-medium text-gray-500 disabled:bg-gray-200"
						data-accordion-target="#accordion-flush-body-5"
						aria-controls="accordion-flush-body-5"
						@click="() => (checkType = 'driving-license')">
						<span>Driving License</span>
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
						id="accordion-flush-body-5"
						class="hidden"
						aria-labelledby="accordion-flush-heading-1">
						<div class="rounded-lg border p-2 py-5 shadow-sm">
							<form
								class="space-y-2"
								@submit.prevent="
									verifyCollateral(
										{
											idNumber: searchQuery,
										},
										'verify-driving-license',
									)
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

				<!-- KRA Pin -->
				<div class="min-w-72 space-y-2">
					<button
						:disabled="!shouldAllowSearch('kra-pin')"
						type="button"
						class="laptop:w-full flex h-14 w-full items-center justify-between gap-3 rounded-lg border border-gray-200 p-4 text-xs font-medium text-gray-500 disabled:bg-gray-200"
						data-accordion-target="#accordion-flush-body-6"
						aria-controls="accordion-flush-body-6"
						@click="() => (checkType = 'kra-pin')">
						<span>KRA PIN</span>
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
						id="accordion-flush-body-6"
						class="hidden"
						aria-labelledby="accordion-flush-heading-1">
						<div class="rounded-lg border p-2 py-5 shadow-sm">
							<form
								class="space-y-2"
								@submit.prevent="
									verifyCollateral(
										{
											pinNumber: searchQuery,
										},
										'verify-kra-pin',
									)
								">
								<input
									type="text"
									class="generic-input h-[50px]"
									placeholder="Provide KRA Pin"
									v-model="searchQuery"
									pattern="[0-9,a-z,A-Z]*" />
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

				<!-- Business -->
				<div class="min-w-72 space-y-2">
					<button
						:disabled="!shouldAllowSearch('business')"
						type="button"
						class="laptop:w-full flex h-14 w-full items-center justify-between gap-3 rounded-lg border border-gray-200 p-4 text-xs font-medium text-gray-500 disabled:bg-gray-200"
						data-accordion-target="#accordion-flush-body-8"
						aria-controls="accordion-flush-body-8"
						@click="() => (checkType = 'business')">
						<span>Business</span>
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
						id="accordion-flush-body-8"
						class="hidden"
						aria-labelledby="accordion-flush-heading-1">
						<div class="rounded-lg border p-2 py-5 shadow-sm">
							<form
								class="space-y-2"
								@submit.prevent="
									verifyCollateral(
										{
											businessRegNumber: searchQuery,
										},
										'verify-business',
									)
								">
								<input
									type="text"
									class="generic-input h-[50px]"
									placeholder="Provide Business Reg Number"
									v-model="searchQuery" />
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

				<!-- Bank Account -->
				<div class="min-w-72 space-y-2">
					<button
						:disabled="!shouldAllowSearch('bank-account')"
						type="button"
						class="laptop:w-full flex h-14 w-full items-center justify-between gap-3 rounded-lg border border-gray-200 p-4 text-xs font-medium text-gray-500 disabled:bg-gray-200"
						data-accordion-target="#accordion-flush-body-7"
						aria-controls="accordion-flush-body-7"
						@click="() => (checkType = 'bank-account')">
						<span>Bank Account</span>
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
						id="accordion-flush-body-7"
						class="hidden"
						aria-labelledby="accordion-flush-heading-1">
						<div class="rounded-lg border p-2 py-5 shadow-sm">
							<form
								class="space-y-2"
								@submit.prevent="
									verifyCollateral(
										{
											bankId: bankId,
											accountNumber: accountNumber,
										},
										'verify-bank-account',
									)
								">
								<div class="relative flex w-full flex-col">
									<label
										for="target-brank"
										class="generic-input-label"
										>Select a Bank</label
									>
									<select
										:class="[
											'generic-input',
											fetchBankListStatus === 'error'
												? 'border-yellow-300 focus:border-yellow-600 focus:ring-yellow-600'
												: 'border-gray-300',
										]"
										id="target-brank"
										v-model="bankId"
										required>
										<option
											v-for="(bank, index) in bankList"
											:key="index"
											:value="bank.id">
											{{ bank.name }}
										</option>
									</select>
									<FormSubmissionLoader
										class="absolute top-[52%] right-6 mr-2 size-5 animate-spin text-gray-500"
										v-if="fetchBankListStatus === 'pending'" />
									<WarningIndicator
										class="absolute top-[52%] right-6 mr-2 size-5 text-yellow-500"
										v-else />
								</div>
								<input
									type="text"
									class="generic-input h-[50px]"
									placeholder="Provide Account Number"
									v-model="accountNumber" />
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
			<!-- IA Vehicle Details results -->
			<div
				v-if="iaVehicleDetails"
				class="border-b border-dashed border-gray-300 py-5">
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
				class="my-5 border-b border-dashed border-gray-300">
				<h1 class="text-sm font-bold text-blue-600">Results from Loan Collateral DB</h1>
				<IAVehicleColateralResultsCard :entries="iaVehicleCollateralDetails" />
			</div>

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
					<span>{{ responseData.first_name ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Last Name</span>
					<span>{{ responseData.last_name ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Other Name</span>
					<span>{{ responseData.other_name ?? 'N/A' }}</span>
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

			<!-- national ID results -->
			<div
				class="mt-5 space-y-2 text-sm text-gray-500"
				v-if="responseData && checkType == 'alien-id'">
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">First Name</span>
					<span>{{ responseData.first_name ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Last Name</span>
					<span>{{ responseData.last_name ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Other Name</span>
					<span>{{ responseData.other_name ?? 'N/A' }}</span>
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

			<!-- driving license verification output -->
			<div
				class="mt-5 space-y-2 text-sm text-gray-500"
				v-if="responseData && checkType == 'driving-license'">
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Points</span>
					<span>{{ responseData.points ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">National ID</span>
					<span>{{ responseData.address ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Status</span>
					<span>{{ responseData.status ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Date of Issue</span>
					<span>{{ responseData.date_of_issue ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Smart DL Booking Test Center</span>
					<span>{{ responseData.smartDLBookingTestCenter ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Phone Number</span>
					<span>{{ responseData.phoneNumber ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">City</span>
					<span>{{ responseData.city ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">KRA PIN</span>
					<span>{{ responseData.kra ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Date of Birth</span>
					<span>{{ responseData.date_of_birth ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">ID Type</span>
					<span>{{ responseData.id_type ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">License Number</span>
					<span>{{ responseData.license_number ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Blood Group</span>
					<span>{{ responseData.blood_group ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Sex</span>
					<span>{{ responseData.sex ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Email</span>
					<span>{{ responseData.email ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">DL Class</span>
					<span>{{ responseData.dlclass ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Nationality</span>
					<span>{{ responseData.nationality ?? 'N/A' }}</span>
				</div>
			</div>

			<!-- verify KRA PIN output -->
			<div
				class="mt-5 space-y-2 text-sm text-gray-500"
				v-if="responseData && checkType == 'kra-pin'">
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Business Certificate ID</span>
					<span>{{ responseData.Business_Certificate_Id ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Email Address</span>
					<span>{{ responseData.Email_Addresses ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Locality</span>
					<span>{{ responseData.Locality ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Pin Number</span>
					<span>{{ responseData.PINNo ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Partnership</span>
					<span>{{ responseData.Partnership ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Is Paye</span>
					<span>{{ responseData.Paye ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Station</span>
					<span>{{ responseData.Station ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Tax Payer Name</span>
					<span>{{ responseData.TaxpayerName ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">TOT</span>
					<span>{{ responseData.Tot ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Trading Business Name</span>
					<span>{{ responseData.Trading_Business_Name ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">VAT</span>
					<span>{{ responseData.Vat ?? 'N/A' }}</span>
				</div>
			</div>

			<!-- verify Business output -->
			<div
				class="mt-5 space-y-2 text-sm text-gray-500"
				v-if="responseData && checkType == 'business'">
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Status</span>
					<span>{{ responseData.status ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Registration Date</span>
					<span>{{ responseData.registration_date ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Postal Address</span>
					<span>{{ responseData.postal_address ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Physical Address</span>
					<span>{{ responseData.physical_address ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Phone Number</span>
					<span>{{ responseData.phone_number ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Registration Number</span>
					<span>{{ responseData.registration_number ?? 'N/A' }}</span>
				</div>

				<!-- share capital -->
				<div
					class="flex items-center justify-between border-b py-2"
					v-if="(responseData.share_capital as []).length === 0">
					<span class="font-semibold">Share Capital</span>
					<span>{{ 'N/A' }}</span>
				</div>
				<div
					v-else
					class="tablet:grid-cols-2 mt-2 grid grid-cols-1 gap-3">
					<span class="col-span-full font-semibold">Share Capital</span>
					<div
						v-for="(share, index) in responseData.share_capital"
						:key="index"
						class="flex min-h-28 flex-col justify-center rounded-lg border p-4 shadow-md">
						<h1 class="text-center font-bold">{{ share.name }}</h1>
						<div class="mt-2 flex space-x-2">
							<div class="flex h-full w-1/2 flex-col">
								<h1 class="text-xs">No. Of Shares</h1>
								<span class="text-lg font-semibold">{{
									share.number_of_shares
								}}</span>
							</div>
							<div class="flex h-full w-1/2 flex-col">
								<h1 class="text-xs">Nominal Value</h1>
								<span class="text-lg font-semibold">{{
									share.number_of_shares
								}}</span>
							</div>
						</div>
					</div>
				</div>

				<!-- partners -->
				<div
					class="flex items-center justify-between border-b py-2"
					v-if="(responseData.partners as []).length === 0">
					<span class="font-semibold">Partners</span>
					<span>{{ 'N/A' }}</span>
				</div>
				<div
					v-else
					class="tablet:grid-cols-2 mt-2 grid grid-cols-1 gap-3">
					<span class="col-span-full font-semibold">Partners</span>
					<div
						v-for="(partner, index) in responseData.partners"
						:key="index"
						class="flex min-h-32 flex-col items-center rounded-lg border p-4 shadow-md">
						<span class="text-sm font-semibold"
							>{{ partner.name }} ({{ partner.gender }})</span
						>
						<span class="text-xs"
							>({{ (partner.type as string).replaceAll('_', ' ') }})</span
						>
						<span class="text-xs">ID Number: {{ partner.id_number }}</span>
						<div class="mt-2 w-full border-t text-center">
							<h1 class="font-semibold">Shares</h1>
							<span v-if="(partner.shares as []).length == 0"> No Shares </span>
							<span
								v-else
								v-for="(shares, index) in partner.shares"
								:key="index"
								class="text-sm">
								{{ shares.name }} - {{ shares.number_of_shares }}
							</span>
						</div>
						<span></span>
					</div>
				</div>
			</div>

			<!-- verify bank output -->
			<div
				class="mt-5 space-y-2 text-sm text-gray-500"
				v-if="responseData && checkType == 'bank-account'">
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Holder's Name</span>
					<span>{{ responseData.name ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Account Number</span>
					<span>{{ responseData.account_number ?? 'N/A' }}</span>
				</div>
				<div class="flex items-center justify-between border-b py-2">
					<span class="font-semibold">Bank Name</span>
					<span>{{ responseData.bank_name ?? 'N/A' }}</span>
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
	const bankId: Ref<string> = ref('');
	const accountNumber: Ref<string> = ref('');

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
		fetchBankListStatus,
		executeFetchBankList,
		bankList,
		ravDefaulterDetails,
		verifyCollateral,
		searchDefaulter,
	} = useCollateralVerificiation();

	const { shouldAllowSearch, getCollateralVerificationTokenInfo } =
		useCollateralVerificationTokensManagement();

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
