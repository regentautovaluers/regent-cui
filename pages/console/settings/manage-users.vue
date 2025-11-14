<template>
	<div
		class="laptop:p-4 laptop-lg:p-8 flex flex-1 flex-col rounded-lg border-2 bg-white p-2 outline-none">
		<!-- members listing -->
		<!-- div to show when there is a fetch error -->
		<div
			class="flex h-full flex-1 flex-col items-center justify-center space-y-4 text-sm"
			v-if="fetchStatus === 'error'">
			<BirdieNotFoundIcon />
			<h1 class="font-semibold text-gray-500">Failed to load data!</h1>
			<button
				class="inline-flex items-center space-x-2 rounded-lg border bg-transparent px-2 py-1 text-gray-500 hover:text-gray-600"
				@click="refreshPage">
				<span>Refresh</span>
				<RefreshIcon classes="size-6" />
			</button>
		</div>

		<!-- div to show when there are no users -->
		<div
			class="flex h-full flex-1 flex-col items-center justify-center space-y-4 text-sm"
			v-else-if="fetchStatus === 'success' && usersList?.length === 0">
			<BirdieNotFoundIcon />
			<h1 class="font-semibold text-gray-500">Oops! Seems like you have no users!</h1>
			<NuxtLink
				:to="{ name: 'vehicle-valuation-add-user' }"
				class="generic-nuxt-link">
				Add User
			</NuxtLink>
		</div>

		<!-- div to show when there are members -->
		<div
			class="justify-betwee flex flex-1 flex-col"
			v-else>
			<!-- search & filter controls -->
			<div class="flex h-fit items-center justify-between">
				<form
					class="tablet:mt-0 tablet:w-[50%] laptop-lg:w-[25%] relative mt-2 flex w-full items-center justify-between"
					@submit.prevent="executeFetchUsers()">
					<input
						type="text"
						class="generic-input"
						placeholder="Search Name, Email or Phone"
						v-model.trim="searchSlug" />
					<button
						type="submit"
						class="generic-search-submit-button">
						<SearchIcon />
					</button>
				</form>
			</div>

			<!-- the table itself -->
			<div class="mt-5 flex-grow">
				<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
					<table class="w-full text-left text-gray-500">
						<thead class="bg-gray-100 text-sm text-gray-700 uppercase">
							<tr>
								<th
									scope="col"
									class="table-headers ps-3">
									User
								</th>
								<th
									scope="col"
									class="table-headers tablet:table-cell hidden">
									Privilege
								</th>
								<th
									scope="col"
									class="table-headers tablet:table-cell hidden">
									Company Role
								</th>
								<th
									scope="col"
									class="table-headers mobile-lg:table-cell hidden">
									Status
								</th>
								<th
									scope="col"
									class="table-headers" />
							</tr>
						</thead>
						<tbody>
							<!-- loading state -->
							<tr
								class="border-b bg-white hover:bg-gray-100"
								v-if="fetchStatus === 'pending'"
								v-for="a in 10"
								:key="a">
								<td
									scope="row"
									class="p-6 font-medium whitespace-nowrap text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>username</span
									>
								</td>
								<td class="tablet:table-cell hidden p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>user role</span
									>
								</td>
								<td class="tablet:table-cell hidden p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>domain role</span
									>
								</td>
								<td class="mobile-lg:table-cell hidden p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>accactive</span
									>
								</td>
								<td class="p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>accactive</span
									>
								</td>
							</tr>
							<!-- actual data -->
							<tr
								class="border-b bg-white text-sm hover:bg-gray-100"
								v-else
								v-for="(user, index) in usersList"
								:key="index">
								<td
									scope="row"
									class="py-4 ps-3">
									<span>{{ user.email }}</span
									><br /><span class="font-semibold text-pink-600">{{
										user.username
									}}</span>
								</td>
								<td class="tablet:table-cell hidden py-4 text-blue-600">
									{{
										user.userRoles.includes('ROLE_CORP_NORM')
											? 'Normal'
											: 'Admin'
									}}
								</td>
								<td class="tablet:table-cell hidden py-4">
									{{ user.roleInOrganization }}
								</td>
								<td class="mobile-lg:table-cell hidden py-4">
									<div class="flex w-fit items-center space-x-2">
										<div
											class="size-3 rounded-full"
											:class="{
												'bg-green-500': user.accountEnabled,
												'bg-red-500': !user.accountEnabled,
											}"></div>
										<span>{{
											user.accountEnabled ? 'Active' : 'Inactive'
										}}</span>
									</div>
								</td>
								<td class="py-4 pe-3">
									<button
										:id="'dropdownLeftButton' + index"
										:data-dropdown-toggle="'dropdownLeft' + index"
										data-dropdown-placement="left"
										type="button">
										<MenuKebabIcon />
									</button>
									<!-- Dropdown menu -->
									<div
										:id="'dropdownLeft' + index"
										class="z-10 hidden w-44 rounded-lg border bg-white shadow-md">
										<ul
											class="py-2 text-gray-500"
											aria-labelledby="dropdownLeftButton">
											<li>
												<button
													class="block w-full px-4 py-2 text-center hover:bg-gray-100"
													type="button"
													:data-modal-target="`edit-user-${user.userId}-modal`"
													:data-modal-toggle="`edit-user-${user.userId}-modal`">
													Edit Details
												</button>
											</li>
										</ul>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<!-- page controls -->
			<div
				class="tablet:flex-row tablet:min-h-12 tablet:h-12 mt-5 flex h-16 min-h-16 flex-col items-center justify-between">
				<h1 class="text-sm font-semibold text-gray-500">
					Showing {{ page + 1 }} of {{ totalPages }} pages.
				</h1>
				<div
					class="tablet:w-fit tablet:block flex h-full w-full justify-center space-x-2 md:space-x-4">
					<button
						class="table-page-buttons"
						@click="page -= 1"
						:disabled="page === 0 || totalPages == 1">
						Previous
					</button>
					<button
						class="table-page-buttons"
						@click="page += 1"
						:disabled="page === totalPages - 1 || totalPages == 1">
						Next
					</button>
				</div>
			</div>
		</div>

		<!-- Modal to edit user -->
		<template
			v-if="usersList && usersList.length > 0"
			v-for="(u, idx) in usersList"
			:key="idx">
			<ParentModal
				modal-title="Edit Account"
				:modal-id="`edit-user-${u.userId}-modal`">
				<EditUserAccount
					:key="idx"
					:user-id="u.userId"
					:username="u.username"
					:email="u.email"
					:phone-number="u.phoneNumber"
					:role-in-organization="u.roleInOrganization"
					:branch-id="u.branchId"
					:is-account-enabled="u.accountEnabled"
					:user-role="u.userRoles[0]" />
			</ParentModal>
		</template>

		<!-- edit user account -->
		<ParentModal
			modal-title="Edit Account"
			modal-id="edit-user-modal">
			<EditUserAccount
				v-if="usersList"
				v-for="(u, idx) in usersList"
				:key="idx"
				:user-id="u.userId"
				:username="u.username"
				:email="u.email"
				:phone-number="u.phoneNumber"
				:role-in-organization="u.roleInOrganization"
				:branch-id="u.branchId"
				:is-account-enabled="u.accountEnabled"
				:user-role="u.userRoles[0]" />
		</ParentModal>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'vehicle-valuation-manage-user',
	});

	const { page, totalPages, usersList, fetchStatus, executeFetchUsers, searchSlug } =
		useUserAccounts();
</script>
