<template>
	<!-- members listing -->
	<div>
		<!-- div to show when there is a fetch error -->
		<div
			class="flex h-full flex-col items-center justify-center space-y-4 rounded-lg border shadow-sm"
			v-if="fetchStatus === 'error' || fetchError">
			<BirdieNotFoundIcon />
			<h1 class="font-semibold text-gray-500">Failed to load data!</h1>
			<NuxtLink
				:to="{ name: 'ava-membership-types' }"
				class="generic-nuxt-link">
				Onboard AVA Member
			</NuxtLink>
		</div>

		<!-- div to show when there are no users -->
		<div
			class="flex h-full flex-col items-center justify-center space-y-4 rounded-lg border shadow-sm"
			v-else-if="fetchStatus === 'success' && usersList.length === 0">
			<BirdieNotFoundIcon />
			<h1 class="font-semibold text-gray-500">Oops! Seems like you have no users!</h1>
			<NuxtLink
				:to="{ name: 'ava-membership-types' }"
				class="generic-nuxt-link">
				Onboard AVA Member
			</NuxtLink>
		</div>

		<!-- div to show when there are members -->
		<div
			class="h-full"
			v-else>
			<!-- search & filter controls -->
			<div class="flex h-fit items-center justify-between">
				<form class="relative h-fit w-full md:w-[45%] lg:w-[30%]">
					<input
						type="text"
						class="generic-input"
						placeholder="Search Name, Email or Phone" />
					<button
						type="submit"
						class="absolute right-0 top-0 flex size-14 items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700">
						<SearchIcon />
					</button>
				</form>
			</div>

			<!-- the table itself -->
			<div class="my-4 flex-grow">
				<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
					<table class="w-full text-left text-gray-500">
						<thead class="bg-gray-100 text-sm uppercase text-gray-700">
							<tr>
								<th
									scope="col"
									class="table-headers">
									Full Name
								</th>
								<th
									scope="col"
									class="table-headers">
									Email
								</th>
								<th
									scope="col"
									class="table-headers">
									Privilege
								</th>
								<th
									scope="col"
									class="table-headers">
									Company Role
								</th>
								<th
									scope="col"
									class="table-headers">
									Account Status
								</th>
								<th
									scope="col"
									class="table-headers" />
							</tr>
						</thead>
						<tbody>
							<!-- actual data -->
							<tr
								class="border-b bg-white hover:bg-gray-100"
								v-for="(user, index) in usersList"
								:key="index">
								<td
									scope="row"
									class="whitespace-nowrap p-6 font-semibold text-pink-600">
									{{ user.username }}
								</td>
								<td class="p-6">{{ user.email }}</td>
								<td class="p-6 text-blue-600">
									{{
										user.userRoles.includes('ROLE_CORP_NORM')
											? 'Normal'
											: 'Admin'
									}}
								</td>
								<td class="p-6">{{ user.roleInOrganization }}</td>
								<td class="p-6">
									<div class="flex w-fit items-center space-x-2">
										<div
											class="size-3 rounded-full"
											:class="{
												'bg-green-500': user.accountEnabled,
												'bg-red-500': !user.accountEnabled,
											}" />
										<span>{{
											user.accountEnabled ? 'Active' : 'Inactive'
										}}</span>
									</div>
								</td>
								<td class="flex items-center justify-end p-6">
									<button
										:id="'dropdownTopButton' + index"
										:data-dropdown-toggle="'dropdownTop' + index"
										data-dropdown-placement="top"
										type="button">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="1em"
											height="1em"
											viewBox="0 0 16 16"
											class="size-6">
											<MenuKebabIcon />
										</svg>
									</button>
									<!-- Dropdown menu -->
									<div
										:id="'dropdownTop' + index"
										class="z-10 hidden w-44 divide-y divide-gray-100 rounded-lg border bg-white shadow-md">
										<ul
											class="py-2 text-gray-500"
											aria-labelledby="dropdownTopButton">
											<li>
												<button
													class="block w-full px-4 py-2 text-center hover:bg-gray-100"
													type="button"
													@click="
														() => {
															selectedIndexToEdit = index;
															isEditAccountModalOpen = true;
														}
													">
													Edit Details
												</button>
												<!-- TODO: Implement logic to reset password -->
												<button
													class="block w-full px-4 py-2 text-center hover:bg-gray-100"
													type="button">
													Reset Password
												</button>
											</li>
										</ul>
									</div>
								</td>
							</tr>

							<!-- loading state -->
							<tr
								class="border-b bg-white hover:bg-gray-100"
								v-if="fetchStatus === 'pending'"
								v-for="a in 8"
								:key="a">
								<td
									scope="row"
									class="whitespace-nowrap p-6 font-medium text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>username</span
									>
								</td>
								<td class="p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>useremail</span
									>
								</td>
								<td class="p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>user role</span
									>
								</td>
								<td class="p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>domain role</span
									>
								</td>
								<td class="p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>accactive</span
									>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<!-- page controls -->
			<div class="flex h-12 justify-end space-x-2 md:space-x-4">
				<button class="table-page-buttons">Previous</button>
				<button class="table-page-buttons">Next</button>
			</div>
		</div>
	</div>

	<!-- Modal to edit user -->
	<ParentModal
		modal-title="Edit Account"
		modal-id="edit-user-modal"
		v-if="isEditAccountModalOpen"
		@close-modal="
			() => {
				isEditAccountModalOpen = false;
				selectedIndexToEdit = -1;
			}
		">
		<EditUserAccount
			:user-id="usersList[selectedIndexToEdit].userId"
			:username="usersList[selectedIndexToEdit].username"
			:email="usersList[selectedIndexToEdit].email"
			:phone-number="usersList[selectedIndexToEdit].phoneNumber"
			:role-in-organization="usersList[selectedIndexToEdit].roleInOrganization"
			:branch-id="usersList[selectedIndexToEdit].branchId"
			:is-account-enabled="usersList[selectedIndexToEdit].accountEnabled"
			:user-role="usersList[selectedIndexToEdit].userRoles[0]" />
	</ParentModal>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'vehicle-valuation-manage-user',
	});

	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const usersList: Ref<any[]> = ref([]);
	const currentPage: Ref<number> = ref(0);
	const selectedIndexToEdit: Ref<any> = ref(-1);
	const isEditAccountModalOpen: Ref<boolean> = ref(false);
	const { status: fetchStatus, error: fetchError } = useFetch(
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
				size: 8,
			},
			server: false,
			lazy: false,
			watch: [currentPage],
			onResponse({ response }) {
				if (response.status === 200) {
					usersList.value = response._data.data;
				}
			},
		},
	);
</script>
