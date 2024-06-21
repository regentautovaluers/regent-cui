<template>
	<!-- start of completed valuations data table -->
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
									Name Of User
								</th>
								<th
									scope="col"
									class="px-6 py-3 text-start font-bold text-gray-500">
									Username
								</th>
								<th
									scope="col"
									class="px-6 py-3 text-start font-bold text-gray-500">
									User Level
								</th>
								<th
									scope="col"
									class="px-6 py-3 text-start font-bold text-gray-500">
									Active
								</th>
								<th
									scope="col"
									class="px-6 py-3 text-center font-bold text-gray-500">
									Creation Date
								</th>
								<th
									scope="col"
									class="px-6 py-3 text-end font-bold text-gray-500">
									Created By
								</th>
								<th
									scope="col"
									class="px-6 py-3 text-end" />
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200">
							<td
								v-if="getUserAccountsLoading"
								class="text-center py-4"
								colspan="100%">
								<LoadingIndicator
									:bar-length="`w-[30%]`"
									v-if="getUserAccountsLoading" />
								<br />
								<span
									class="text-gray-500 text-lg font-semibold"
									>Loading Your Data.</span
								>
							</td>
							<ErrorOrMissingData v-if="queryErrorOrEmpty" />
							<ValuationsUserAccRecord
								v-for="(
									record, index
								) in computedAccountDetails"
								:key="index"
								:corp="record.corp"
								:corp-user-id="record.corp_user_id"
								:name-of-user="record.name_of_user"
								:username="record.username"
								:user-level="record.userlevel"
								:is-active="record.active"
								:acc-creation-date="record.create_date"
								:acc-created-by="record.created_by" />
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
	<!-- end of data table -->
	<div class="mt-2 w-full rounded-sm flex justify-between items-center py-2">
		<span>Showing Page {{ currentPage + 1 }} of {{ totalPages }}</span>
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
</template>

<script setup lang="ts">
	definePageMeta({
		name: "valuation-manage-users",
	});
	const getUserAccountsLoading: Ref<boolean> = ref(false);
	const queryErrorOrEmpty: Ref<boolean> = ref(false);
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const { openToast } = useToast();
	const accountsList: Ref<any[]> = ref([]);
	const ITEMS_PER_PAGE: number = 10;
	const totalNumber: Ref<number> = ref(0);
	const totalPages: Ref<number> = ref(0);
	const currentPage: Ref<number> = ref(0);

	onMounted(async () => {
		getUserAccountsLoading.value = true;
		try {
			await $fetch("/ava/api/corp-users", {
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
						throw new Error("Failed to retrieve user accounts!");
					}

					const accountsResults: any[] = JSON.parse(response._data);
					if (accountsResults.length < 1) {
						openToast(
							"No user accounts found at the moment!",
							"warning"
						);
						queryErrorOrEmpty.value = true;
					} else {
						accountsList.value = accountsResults;
						openToast(
							"Successfully retrieved your user accounts",
							"success"
						);
					}
				},
			});
		} catch (error) {
			console.log("An error occured: ", error);
			openToast("Failed to load valuations. Reload page!", "danger");
			queryErrorOrEmpty.value = true;
		} finally {
			getUserAccountsLoading.value = false;
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

	const computedAccountDetails: ComputedRef<any[]> = computed(() => {
		totalNumber.value = accountsList.value.length;
		totalPages.value = Math.ceil(
			accountsList.value.length / ITEMS_PER_PAGE
		);

		// Calculate the start and end indices for the current page
		const startIndex = currentPage.value * ITEMS_PER_PAGE;
		const endIndex = startIndex + ITEMS_PER_PAGE;

		// Return only the items for the current page
		return accountsList.value.slice(startIndex, endIndex);
	});
</script>
