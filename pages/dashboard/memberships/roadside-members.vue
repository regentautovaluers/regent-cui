<template>
	<div class="py-10 h-fit responsive-view">
		<h1 class="my-5 text-2xl antialiased font-semibold">
			Roadside Assistance Members
		</h1>
		<!-- search & filter controls -->
		<div
			class="flex items-center justify-between mb-6 overflow-x-auto flex-nowrap">
			<!-- search box -->
			<div class="relative flex-grow mr-10">
				<input
					type="text"
					class="peer py-3 h-12 px-4 ps-11 bg-gray-200 border-transparent rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="Search Here" />
				<div
					class="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-2 peer-disabled:opacity-50 peer-disabled:pointer-events-none">
					<img
						src="/images/topnav/search-icon.svg"
						alt="Search Icon" />
				</div>
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
										Client Name
									</th>
									<th
										scope="col"
										class="px-6 py-3 text-start font-bold text-gray-500">
										Membership Category
									</th>
									<th
										scope="col"
										class="px-6 py-3 text-center font-bold text-gray-500">
										Vehicles
									</th>
									<th
										scope="col"
										class="px-6 py-3 text-start font-bold text-gray-500">
										Contacts
									</th>
									<th
										scope="col"
										class="px-6 py-3 text-end" />
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200">
								<Suspense>
									<template #default>
										<FilteredMembersRecord
											:current-page="currentPage"
											default-filter-flag="Roadside Assistance"
											@provide-statistics="
														(totalMembers: number , totPages: number) =>
															{
																totalNumber = totalMembers; 
																totalPages = totPages;
															}
													" />
									</template>

									<template #fallback>
										<MembersTableLoader
											v-for="a in 5"
											:key="a" />
									</template>
								</Suspense>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
		<!-- end of data table -->
		<div
			class="mt-2 w-full rounded-sm flex justify-between items-center py-2">
			<span
				>Showing {{ currentPage + 1 }} of {{ totalPages }} pages.</span
			>
			<div class="space-x-1">
				<button
					v-for="page in currentPage + 1"
					:key="page"
					@click="() => (currentPage = 0)"
					type="button"
					class="p-2 size-10 text-center text-sm font-semibold rounded-md border bg-blue-600 text-white hover:bg-blue-700">
					{{ page }}
				</button>
				<button
					v-if="totalPages > 1 && currentPage + 1 < totalPages"
					@click="
						() => {
							if (currentPage + 1 < totalPages) currentPage++;
						}
					"
					type="button"
					class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700">
					<span v-if="!fetchingMoreData">Next Page</span>
					<div
						v-if="fetchingMoreData"
						class="animate-spin inline-block size-5 border-[3px] border-white border-current border-t-transparent text-gray-800 rounded-full"
						role="status"
						aria-label="loading" />
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: "roadside-members",
		layout: "in-app-layout",
	});

	const totalNumber: Ref<number> = ref(0);
	const currentPage: Ref<number> = ref(0);
	const totalPages: Ref<number> = ref(0);
	const { getDetails } = usePrincipal();
	const searchFilterTerm: Ref<string> = ref("");
	const searchMembershipCategory: Ref<string | null> = ref(null);
	const fetchingMoreData: Ref<boolean> = ref(false);
</script>
