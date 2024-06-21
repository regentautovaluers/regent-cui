<template>
	<div class="py-10 bg-[#f6f9f2] responsive-view h-fit">
		<div class="bg-white w-full p-10 px-2 lg:px-10">
			<div
				class="flex flex-col lg:flex-row space-y-3 lg:space-y-0 items-center justify-between">
				<div
					class="text-sm md:text-base lg:text-lg border-b-1 space-x-4 w- lg:w-fit">
					<button
						@click="() => (currentView = 0)"
						:class="[
							'border-b-2 pb-1',
							currentView === 0
								? 'border-b-blue-600 text-blue-600'
								: 'border-b-inherit',
						]">
						<span>Create Authorization Letter</span>
					</button>
					<button
						@click="() => (currentView = 1)"
						:class="[
							'border-b-2 pb-1',
							currentView === 1
								? 'border-b-blue-600 text-blue-600'
								: 'border-b-inherit',
						]">
						<span>View Authorization Letters</span>
					</button>
				</div>
			</div>
			<div class="mt-16">
				<CreateAuthorizationLetter v-if="currentView === 0" />
				<!-- start of data table -->
				<div
					v-else-if="currentView === 1"
					class="flex flex-col">
					<div class="-m-1.5 overflow-x-auto">
						<div class="p-1.5 min-w-full inline-block align-middle">
							<div
								class="border rounded-lg shadow overflow-hidden">
								<table class="min-w-full divide-y">
									<thead>
										<tr>
											<th
												scope="col"
												class="px-6 py-3 text-start font-bold text-gray-500">
												Broker
											</th>
											<th
												scope="col"
												class="px-6 py-3 text-start font-bold text-gray-500">
												Customer
											</th>
											<th
												scope="col"
												class="px-6 py-3 text-start font-bold text-gray-500">
												Policy No.
											</th>
											<th
												scope="col"
												class="px-6 py-3 text-end font-bold text-gray-500">
												Registration No.
											</th>
											<th
												scope="col"
												class="px-6 py-3 text-end font-bold text-gray-500">
												Authorized By
											</th>
											<th
												scope="col"
												class="px-6 py-3 text-center font-bold text-gray-500">
												Date
											</th>
											<th
												scope="col"
												class="px-6 py-3 text-end font-bold text-gray-500">
												Authorization Ref No.
											</th>
											<th
												scope="col"
												class="px-6 py-3 text-end font-bold text-gray-500">
												Phone No.
											</th>
											<th
												scope="col"
												class="px-6 py-3 text-start font-bold text-gray-500">
												Regent Branch Email
											</th>
											<!-- <th
												scope="col"
												class="px-6 py-3 text-end" /> -->
										</tr>
									</thead>
									<tbody class="divide-y divide-gray-200">
										<td
											v-if="
												requestAuthorizationListLoading
											"
											class="text-center py-4"
											colspan="100%">
											<LoadingIndicator
												:bar-length="`w-[30%]`"
												v-if="
													requestAuthorizationListLoading
												" />
											<br />
											<span
												class="text-gray-500 text-lg font-semibold"
												>Loading Your Data.</span
											>
										</td>
										<ErrorOrMissingData
											v-if="fetchErrorOrEmpty" />
										<AuthorizationLettersRecord
											v-for="(
												record, index
											) in computedAuthorizationList"
											:key="index"
											:broker="toTitleCase(record.broker)"
											:customer="
												toTitleCase(record.customer)
											"
											:policy-no="record.policy_no"
											:registration-no="record.reg_no"
											:authorized-by="
												record.authorized_by
											"
											:date="record.add_date"
											:auth-ref-no="
												record.authorization_ref_no
											"
											:phone-no="record.phone_number"
											:regent-branch-email="
												record.regent_branch_email
											" />
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				<div
					class="mt-2 w-full rounded-sm flex justify-between items-center py-2"
					v-if="currentView === 1">
					<span
						>Showing Page {{ currentPage + 1 }} of
						{{ totalPages }}</span
					>
					<div
						class="space-x-1"
						v-if="totalPages > 1">
						<button
							@click="prevPage"
							class="p-2 text-center text-sm font-semibold rounded-md border bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-500"
							:disabled="currentPage === 0">
							Previous
						</button>

						<button
							@click="nextPage"
							class="p-2 text-center text-sm font-semibold rounded-md border bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-500"
							:disabled="currentPage === totalPages - 1">
							Next
						</button>
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
		name: "valuation-authorization-letter",
		layout: "in-app-layout",
	});

	const currentView: Ref<number> = ref(0);
	const { moreServicesData } = useMoreServicesNavData();
	const fetchErrorOrEmpty: Ref<boolean> = ref(false);
	const runtimeConfig = useRuntimeConfig();
	const { openToast } = useToast();
	const { getPrincipal } = useAuth();
	const requestAuthorizationListLoading: Ref<boolean> = ref(false);
	const authorizationList: Ref<any[]> = ref([]);
	const totalNumber: Ref<number> = ref(0);
	const totalPages: Ref<number> = ref(0);
	const ITEMS_PER_PAGE: number = 10;
	const currentPage: Ref<number> = ref(0);
	const { toTitleCase } = useUtils();

	onMounted(async () => {
		try {
			await $fetch("/ava/api/authorization/authorization_list", {
				method: "GET",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				query: {
					uname: runtimeConfig.app.VALUATION_BASE_UNAME,
					pwd: runtimeConfig.app.VALUATION_BASE_PASS,
					corp: getPrincipal.value.corpId,
				},
				async onResponse({ response }) {
					if (response.status !== 200) {
						throw new Error("Failed to retrieve tampered vehicles");
					}

					const authListResuls: any[] = JSON.parse(response._data);
					if (authListResuls.length < 1) {
						openToast("Search has no results!", "warning");
						fetchErrorOrEmpty.value = true;
					} else {
						authorizationList.value = authListResuls;
						openToast("Search valuations successfull", "success");
					}
				},
			});
		} catch (error) {
			console.log("An error occured: ", error);
			openToast(
				"Failed to load tampered vehicles. Reload page!",
				"danger"
			);
			fetchErrorOrEmpty.value = true;
		} finally {
			requestAuthorizationListLoading.value = false;
		}
	});

	// Add a method to navigate to the next page
	function nextPage() {
		if (currentPage.value < totalPages.value - 1) {
			currentPage.value++;
		}
	}

	// Add a method to navigate to the previous page
	function prevPage() {
		if (currentPage.value > 0) {
			currentPage.value--;
		}
	}

	const computedAuthorizationList: ComputedRef<any[]> = computed(() => {
		totalNumber.value = authorizationList.value.length;
		totalPages.value = Math.ceil(
			authorizationList.value.length / ITEMS_PER_PAGE
		);

		// Calculate the start and end indices for the current page
		const startIndex = currentPage.value * ITEMS_PER_PAGE;
		const endIndex = startIndex + ITEMS_PER_PAGE;

		// Return only the items for the current page
		return authorizationList.value.slice(startIndex, endIndex);
	});
</script>
