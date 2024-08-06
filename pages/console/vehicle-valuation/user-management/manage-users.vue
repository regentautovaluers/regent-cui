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
									Full Name
								</th>
								<th
									scope="col"
									class="px-6 py-3 text-start font-bold text-gray-500">
									Contact
								</th>
								<th
									scope="col"
									class="px-6 py-3 text-start font-bold text-gray-500">
									Privilege
								</th>
								<th
									scope="col"
									class="px-6 py-3 text-start font-bold text-gray-500">
									Role
								</th>
								<th
									scope="col"
									class="px-6 py-3 text-start font-bold text-gray-500">
									Account Status
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
								<span class="text-gray-500 text-lg font-semibold"
									>Loading Your Data.</span
								>
							</td>
							<ErrorOrMissingData v-if="queryErrorOrEmpty" />
							<ValuationsUserAccRecord
								v-for="(record, index) in accountsList"
								:key="index"
								:user-id="record.userId"
								:corp-id="getPrincipal.corpId"
								:username="record.username"
								:user-email="record.email"
								:phone-number="record.phoneNumber"
								:privilege="record.userRoles"
								:corporate-role="record.roleInOrganization"
								:is-active="record.accountEnabled" />
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
	<!-- end of data table -->
	<!-- <div class="mt-2 w-full rounded-sm flex justify-between items-center py-2">
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
	</div> -->
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'valuation-manage-users',
	});

	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const { openToast } = useToast();
	const accountsList: Ref<any[]> = ref([]);
	const currentPage: Ref<number> = ref(0);

	const { pending: getUserAccountsLoading, error: queryErrorOrEmpty } = useFetch(
		'/api/v1/auth/corp-account/get-accounts',
		{
			baseURL: runtimeConfig.public.VALUATION_BASE_URL,
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
			query: {
				corporateId: getPrincipal.value.corpId,
				page: currentPage.value,
				size: 100,
			},
			server: false,
			lazy: false,
			watch: [currentPage],
			onResponse({ response }) {
				if (response.status !== 200) {
				}

				if (response.status === 200) {
					accountsList.value = response._data.data;
				}
			},
		},
	);
</script>
