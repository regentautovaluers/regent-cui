<template>
	<div class="py-10 h-fit responsive-view">
		<!-- top card with link to add new member -->
		<div
			class="flex flex-col md:flex-row items-center justify-between py-5 px-3 md:px-6 border-2 border-gray-200 shadow-sm space-y-2 md:space-y-0 rounded-lg">
			<div class="flex space-x-2 items-center w-full md:w-fit">
				<img
					class="inline-block size-[60px] rounded-full"
					src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
					alt="User Image" />
				<div class="flex flex-col">
					<span
						class="text-blue-600 font-semibold inline-flex items-center"
						>Hi, {{ getDetails.username }}
						<img
							src="/icons/misc/hand-wave.svg"
							alt="Hand Wave Icon"
							class="ml-1"
					/></span>
					<span>You Have {{ totalNumber }} Registered Members</span>
				</div>
			</div>
			<NuxtLink
				:to="{ name: 'new-member' }"
				class="bg-blue-600 text-white font-semibold text-sm p-4 rounded-md w-full md:w-fit text-center"
				>ADD A NEW MEMBER</NuxtLink
			>
		</div>
		<div class="mt-6 grid grid-cols-1">
			<!-- TODO: place 'lg:grid-cols-[0.75fr,auto]' into the classes list at this line -->
			<div class="p-2">
				<!-- search & filter controls -->
				<div
					class="flex items-center justify-between mb-6 overflow-x-auto flex-nowrap">
					<!-- search box -->
					<div class="relative flex-grow mr-10 max-w-[25%]">
						<input
							type="text"
							class="peer py-3 h-12 px-4 ps-11 bg-gray-100 border-transparent rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none min-w-full"
							placeholder="Search Name, Email or Phone Number"
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
							<div
								class="hs-dropdown relative inline-flex [--placement:bottom-right]">
								<button
									id="hs-dropdown-default"
									type="button"
									class="hs-dropdown-toggle py-3 px-4 inline-flex h-12 items-center gap-x-2 font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
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
											id="corporate-type"
											v-model="
												searchMembershipCategory
											" />
										<label
											for="corporate-type"
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
											id="individual-type"
											v-model="
												searchMembershipCategory
											" />
										<label
											for="individual-type"
											class="text-gray-500 ms-2 dark:text-gray-400"
											>Individual Registration</label
										>
									</div>
								</div>
							</div>
						</div>
						<button
							v-if="
								searchFilterTerm !== null ||
								searchMembershipCategory !== null
							"
							@click="
								() => {
									searchFilterTerm = null;
									searchMembershipCategory = null;
									remountTableValue++;
									loadedPages = 0;
									currentPage = 0;
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
							<div
								class="border rounded-lg shadow overflow-hidden">
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
												<MembersRecord
													:key="remountTableValue"
													:current-page="currentPage"
													:search-term="
														searchFilterTerm
													"
													:membership-category="
														searchMembershipCategory
													"
													@next-page-loaded="
														() =>
															(fetchingMoreData = false)
													"
													@provide-statistics="
														(totalMembers: number , totPages: number) =>
															{
																totalNumber = totalMembers; 
																totalPages = totPages;
																loadedPages++;
															}
													"
													@reset-statistics="
														() => {
															totalPages = 0;
															loadedPages = 0;
															currentPage = 0;
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
						>Showing {{ currentPage + 1 }} of
						{{ totalPages }} pages.</span
					>
					<div class="space-x-1">
						<button
							v-for="page in loadedPages"
							:key="page"
							@click="() => (currentPage = page - 1)"
							type="button"
							class="p-2 size-10 text-center text-sm font-semibold rounded-md border bg-blue-600 text-white hover:bg-blue-700">
							{{ page }}
						</button>
						<button
							v-if="loadedPages < totalPages"
							@click="
								() => {
									if (currentPage + 1 < totalPages) {
										currentPage++;
										loadedPages++;

										// show the loading indicator
										fetchingMoreData = true;
									}
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
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: "memberships-home",
		layout: "in-app-layout",
	});

	const totalNumber: Ref<number> = ref(0);
	const currentPage: Ref<number> = ref(0);
	const loadedPages: Ref<number> = ref(0);
	const totalPages: Ref<number> = ref(0);
	const { getDetails } = usePrincipal();
	const searchFilterTerm: Ref<string | null> = ref(null);
	const searchMembershipCategory: Ref<string | null> = ref(null);
	const fetchingMoreData: Ref<boolean> = ref(false);
	const remountTableValue: Ref<number> = ref(0);
</script>
