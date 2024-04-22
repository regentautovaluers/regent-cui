<template>
	<div class="py-10 bg-[#f6f9f2] responsive-view h-fit">
		<div class="bg-white w-full p-10 px-2 lg:px-10">
			<!-- search & filter controls -->
			<div
				class="flex items-center justify-between mb-6 overflow-x-auto flex-nowrap">
				<!-- search box -->
				<div class="relative flex-grow mr-10 max-w-[30%]">
					<input
						type="text"
						class="peer py-3 h-14 px-4 ps-11 bg-gray-200 border-transparent rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none min-w-full"
						placeholder="Search Registration, Booking Number, Make e.t.c"
						v-model="searchFilterTerm" />
					<div
						class="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-2 peer-disabled:opacity-50 peer-disabled:pointer-events-none">
						<img
							src="/images/topnav/search-icon.svg"
							alt="Search Icon" />
					</div>
				</div>
				<div class="flex items-center space-x-2">
					<div class="flex flex-nowrap items-center space-x-3">
						<!-- filter by Membership type -->
						<!-- <div
								class="hs-dropdown relative inline-flex [--placement:bottom-right]">
								<button
									id="hs-dropdown-default"
									type="button"
									class="hs-dropdown-toggle py-3 px-4 inline-flex h-12 items-center gap-x-2 font-medium rounded-lg border border-gray-200 text-gray-800 shadow-sm"
									:class="
										!searchMembershipCategory
											? 'bg-white text-black'
											: 'bg-blue-600 text-white'
									">
									Membership Category
									<svg
										class="hs-dropdown-open:rotate-180 size-4"
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round">
										<path d="m6 9 6 6 6-6" />
									</svg>
								</button>
								<div
									class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg p-2 mt-2 dark:bg-gray-800 dark:border dark:border-gray-700 dark:divide-gray-700 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full space-y-2"
									aria-labelledby="hs-dropdown-default">
									<div
										class="flex hover:bg-gray-200 p-2 rounded-lg items-center">
										<input
											type="radio"
											name="membership-category"
											value="corporate"
											class="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
											v-model="
												searchMembershipCategory
											" />
										<label
											class="text-gray-500 ms-2 dark:text-gray-400"
											>Corporate Registration</label
										>
									</div>
									<div
										class="flex hover:bg-gray-200 p-2 rounded-lg items-center">
										<input
											type="radio"
											name="membership-category"
											value="individual"
											class="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
											v-model="
												searchMembershipCategory
											" />
										<label
											class="text-gray-500 ms-2 dark:text-gray-400"
											>Individual Registration</label
										>
									</div>
								</div>
							</div> -->
					</div>
					<button
						v-if="searchFilterTerm !== null"
						@click="
							() => {
								searchFilterTerm = null;
							}
						"
						title="Clear Filters"
						class="bg-gray-300 inline-flex items-center justify-center p-2 rounded-full size-10">
						<Icon
							name="material-symbols:close"
							class="text-lg" />
					</button>
				</div>
			</div>
			<!-- start of data table -->
			<div class="flex flex-col">
				<div class="-m-1.5 overflow-x-auto">
					<div class="p-1.5 min-w-full inline-block align-middle">
						<div class="border rounded-lg shadow overflow-hidden">
							<table class="min-w-full divide-y">
								<thead>
									<tr>
										<th
											scope="col"
											class="px-6 py-3 text-start font-bold text-gray-500">
											Registration No.
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-start font-bold text-gray-500">
											Make & Model
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-center font-bold text-gray-500">
											Booking No.
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-end font-bold text-gray-500">
											Valuation Date
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-end font-bold text-gray-500">
											Assessed Value
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-end font-bold text-gray-500">
											Market Value
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-end font-bold text-gray-500">
											Market Value
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-end font-bold text-gray-500">
											Customer
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-end font-bold text-gray-500">
											Regent Branch
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-end" />
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-200">
									<ErrorOrMissingData
										v-if="fetchErrorOrEmpty" />
									<ValuationsTableLoader
										v-if="fetchLoading"
										v-for="a in 5" />
									<ValuationsRecord
										v-if="
											tamperedVehicles.length >= 1 &&
											!fetchLoading
										"
										v-for="(
											vehicle, index
										) in tamperedVehicles"
										:key="index"
										:index="index"
										:registration="vehicle.reg_no"
										:vehicleMake="vehicle.make"
										:vehicle-model="vehicle.model"
										:booking-num="
											vehicle.vehicle_booking_no
										"
										:serial-num="vehicle.serial_no"
										:date-added="vehicle.add_date"
										:customer-name="vehicle.customer_name"
										:regent-branch="vehicle.regent_branch"
										:nb-remarks="vehicle.nb"
										:assessed-value="
											vehicle.vehicle_assessed_value
										" />
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
		<h1 class="text-3xl font-bold mt-7 lg:mx-10">Explore More Services</h1>
		<div
			class="w-full flex justify-between space-x-4 lg:space-x-0 lg:px-10 whitespace-nowrap overflow-x-auto overflow-y-hidden"
			style="
				::-webkit-scrollbar-thumb {
					border-radius: 10px;
				}

				/* Hide scrollbar for Chrome, Safari and Opera */
				::-webkit-scrollbar {
					display: none;
				}

				/* Hide scrollbar for IE, Edge and Firefox */
				.no-scrollbar {
					-ms-overflow-style: none; /* IE and Edge */
					scrollbar-width: none; /* Firefox */
				}
			">
			<NuxtLink
				v-for="(service, index) in moreServicesData"
				class="flex flex-col whitespace-normal p-6 rounded-2xl hover:shadow-lg hover:bg-white h-64 w-72 min-w-72 max-w-72 transition-transform hover:scale-105"
				:key="index"
				:to="{ name: service.pageName }"
				><img
					:src="service.icon"
					alt="Service Icon Link"
					class="w-16" />
				<h1 class="text-2xl font-bold mt-3">
					{{ service.title }}
				</h1>
				<p class="text-lg">{{ service.description }}</p></NuxtLink
			>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: "valuation-tampered-vehicles",
		layout: "in-app-layout",
	});

	const searchFilterTerm: Ref<string | null> = ref(null);
	const page: Ref<number> = ref(0);
	const size: Ref<number> = ref(10);
	const tamperedVehicles: Ref<any[]> = ref([]);
	const fetchLoading: Ref<boolean> = ref(false);
	const fetchErrorOrEmpty: Ref<boolean> = ref(false);
	const runtimeConfig = useRuntimeConfig();
	const { getDetails } = usePrincipal();
	const { openToast } = useToast();
	const { moreServicesData } = useMoreServicesNavData();

	onMounted(async () => {
		fetchLoading.value = true;
		try {
			await $fetch(
				`${runtimeConfig.public.AVA_BASE_URL}/ava/api/tampered_vehicles`,
				{
					method: "POST",
					query: {
						uname: runtimeConfig.app.AVA_BASE_UNAME,
						pwd: runtimeConfig.app.AVA_BASE_PASS,
						corp: getDetails.company,
					},
					async onResponse({ response }) {
						if (response.status !== 200) {
							throw new Error(
								"Failed to retrieve tampered vehicles"
							);
						}

						tamperedVehicles.value = response._data;
					},
				}
			);
		} catch (error) {
			console.log("An error occured: ", error);
			openToast(
				"Failed to load tampered vehicles. Reload page!",
				"danger"
			);
			fetchErrorOrEmpty.value = true;
		} finally {
			fetchLoading.value = false;
		}
	});
</script>
