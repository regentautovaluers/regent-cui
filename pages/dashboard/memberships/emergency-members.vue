<template>
	<div class="py-10 h-fit responsive-view">
		<h1 class="my-5 text-2xl antialiased font-semibold">
			Emergency Rescue Members
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
			<!-- filter controls -->
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
								name="hs-default-radio"
								class="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
								id="hs-default-radio" />
							<label
								for="hs-default-radio"
								class="text-gray-500 ms-2 dark:text-gray-400"
								>Corporate Registration</label
							>
						</div>
						<div
							class="flex hover:bg-gray-200 p-2 rounded-lg items-center">
							<input
								type="radio"
								name="hs-default-radio"
								class="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
								id="hs-checked-radio"
								checked />
							<label
								for="hs-checked-radio"
								class="text-gray-500 ms-2 dark:text-gray-400"
								>Individual Registration</label
							>
						</div>
					</div>
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
										<MembersRecord
											default-filter-flag="Emergency Evacuation"
											@total-number="
												(totalMembers: number) =>
													(totalNumber = totalMembers)
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
		<div class="mt-2 w-full rounded-sm flex justify-between py-2">
			<span>Showing from {{ totalNumber }} possible members.</span>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: "emergency-members",
		layout: "in-app-layout",
	});

	const totalNumber: Ref<number> = ref(0);
	const searchFilterTerm: Ref<string> = ref("");
	const searchMembershipCategory: Ref<string | null> = ref(null);
</script>
