<template>
	<div class="py-10 h-fit responsive-view">
		<!-- top card with link to add new member -->
		<div
			class="flex flex-col md:flex-row items-center justify-between py-5 px-3 md:px-6 border-2 border-gray-200 shadow-sm space-y-2 md:space-y-0">
			<div class="flex space-x-2 items-center w-full md:w-fit">
				<img
					class="inline-block size-[60px] rounded-full"
					src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
					alt="User Image" />
				<div class="flex flex-col">
					<span class="text-blue-600 font-semibold"
						>Hi, {{ getDetails.username }}</span
					>
					<span>You Have 4050 Registered Members</span>
				</div>
			</div>
			<NuxtLink
				:to="{ name: 'new-member' }"
				class="bg-blue-600 text-white font-semibold text-sm p-4 rounded-md w-full md:w-fit text-center"
				>ADD A NEW MEMBER</NuxtLink
			>
		</div>
		<div class="mt-6 grid grid-cols-1 lg:grid-cols-[0.75fr,auto]">
			<div class="p-2">
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
								Membership Type
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
								class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg p-2 mt-2 dark:bg-gray-800 dark:border dark:border-gray-700 dark:divide-gray-700 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full"
								aria-labelledby="hs-dropdown-default">
								<a
									class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:bg-gray-700"
									href="#">
									Newsletter
								</a>
								<a
									class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:bg-gray-700"
									href="#">
									Purchases
								</a>
							</div>
						</div>

						<!-- TODO: filter by date/ period -->
						<div
							class="hs-dropdown relative inline-flex [--placement:bottom-right]">
							<button
								id="hs-dropdown-default"
								type="button"
								class="hs-dropdown-toggle py-3 px-4 inline-flex h-12 items-center gap-x-2 font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
								Filter Period
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
								class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg p-2 mt-2 dark:bg-gray-800 dark:border dark:border-gray-700 dark:divide-gray-700 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full"
								aria-labelledby="hs-dropdown-default">
								<a
									class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:bg-gray-700"
									href="#">
									Newsletter
								</a>
								<a
									class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:bg-gray-700"
									href="#">
									Purchases
								</a>
							</div>
						</div>
					</div>
				</div>
				<!-- start of data table -->
				<div class="flex flex-col">
					<div class="-m-1.5 overflow-x-auto">
						<div class="p-1.5 min-w-full inline-block align-middle">
							<div
								class="border rounded-sm shadow overflow-hidden">
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
										<!-- TODO: remeber to fixup the number of vehicles here to not be hardcoded -->
										<MembersRecord
											v-for="(
												member, index
											) in membersList"
											:key="index"
											:member-name="member.full_name"
											:membership-category="
												member.category
											"
											:id="member.id"
											:number-of-vehicles="
												member.membershipVehicleCount
											"
											:member-email="
												!member.userEmail
													? 'Email not provided'
													: member.userEmail
											"
											:member-phone="
												!member.phone_number
													? 'Phone number not provided'
													: member.phone_number
											" />
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				<!-- end of data table -->
				<div class="mt-2 w-full rounded-sm flex justify-between py-2">
					<span
						>Showing {{ pageSize }} of
						{{ totalNumber }} members.</span
					>
				</div>
			</div>
			<div class="bg-green-700 p-2"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: "memberships-home",
		layout: "in-app-layout",
	});
	const pageSize: Ref<number> = ref(10);
	const totalNumber: Ref<number> = ref(0);
	const { getDetails } = usePrincipal();
	const page: Ref<number> = ref(0);
	const size: Ref<number> = ref(205);
	const { openToast } = useToast();
	const runtimeConfig = useRuntimeConfig();
	const membersList: Ref<object[] | null> = ref(null);

	onMounted(async () => {
		try {
			await $fetch(
				`${runtimeConfig.public.DEV_TIME_HOST}/api/v1/memberships`,
				{
					method: "GET",
					query: {
						corporateId: getDetails.acc_id,
						page: page.value,
						size: size.value,
					},
					async onResponse({ response }) {
						if (response.status !== 200) {
							throw new Error(
								"Failed to retrieve corporate's members"
							);
						}
						membersList.value = response._data.memberships;
					},
				}
			);
		} catch (error) {
			console.log("An error occured: ", error);
			openToast("Failed to load your members. Reload page!", "danger");
		}
	});
</script>
