<template>
	<!-- members listing -->
	<div>
		<!-- div to show when there is a fetch error -->
		<div
			class="flex h-full flex-col items-center justify-center space-y-4 rounded-lg border shadow-sm"
			v-if="(fetchStatus === 'error' || fetchError) && corporateBranches.length === 0">
			<BirdieNotFoundIcon />
			<h1 class="font-semibold text-gray-500">Failed to load data!</h1>
			<button
				class="generic-nuxt-link"
				@click="reloadCorporateBranches()">
				Reload Page
			</button>
		</div>

		<!-- div to show when there are no users -->
		<div
			class="flex h-full flex-col items-center justify-center space-y-4 rounded-lg border shadow-sm"
			v-else-if="fetchStatus === 'success' && !corporateBranches">
			<BirdieNotFoundIcon />
			<h1 class="text-sm font-semibold text-gray-500">
				Oops! Seems like you have no branches!
			</h1>
			<button
				class="generic-nuxt-link text-sm"
				type="button"
				data-modal-target="add-corporate-branch-modal"
				data-modal-toggle="add-corporate-branch-modal">
				Add New Branch
			</button>
		</div>

		<!-- div to show when there are members -->
		<div
			class="h-full"
			v-else>
			<!-- search & filter controls -->
			<div class="flex h-12 items-center justify-end space-x-2">
				<form
					class="tablet:mt-0 tablet:w-[50%] laptop-lg:w-[25%] relative mt-2 flex w-full items-center justify-between">
					<input
						type="text"
						class="generic-input"
						placeholder="Search Name, Email or Phone" />
					<button
						type="submit"
						class="generic-search-submit-button">
						<SearchIcon />
					</button>
				</form>
			</div>

			<!-- the table itself -->
			<div class="my-4 flex-grow">
				<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
					<table class="w-full text-left text-gray-500">
						<thead class="bg-gray-100 text-sm text-gray-700 uppercase">
							<tr>
								<th
									scope="col"
									class="table-headers">
									Branch Name
								</th>
								<th
									scope="col"
									class="table-headers">
									Branch Location
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
									<span class="animate-pulse rounded-lg bg-gray-300">name</span>
								</td>
								<td class="p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>location</span
									>
								</td>
							</tr>
							<!-- actual data -->
							<tr
								class="border-b bg-white text-sm hover:bg-gray-100"
								v-for="(branch, index) in corporateBranches"
								:key="index"
								v-else>
								<td
									scope="row"
									class="p-6 font-semibold whitespace-nowrap text-pink-600">
									{{ branch.branchName }}
								</td>
								<td class="p-6">{{ branch.branchLocation }}</td>
								<td class="flex items-center justify-end p-6">
									<button
										:id="'dropdownLeftButton' + index"
										:data-dropdown-toggle="'dropdownLeft' + index"
										data-dropdown-placement="left"
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
										:id="'dropdownLeft' + index"
										class="z-10 hidden w-44 divide-y divide-gray-100 rounded-lg border bg-white shadow-md">
										<ul
											class="py-2 text-gray-500"
											aria-labelledby="dropdownLeftButton">
											<li>
												<button
													class="block w-full px-4 py-2 text-center hover:bg-gray-100"
													type="button"
													data-modal-target="edit-corporate-branch-modal"
													data-modal-toggle="edit-corporate-branch-modal"
													@click="
														() => {
															selectedIndexToEdit = index;
															isEditCorpBranchModalOpen = true;
														}
													">
													Edit Branch
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
									class="p-6 font-medium whitespace-nowrap text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>branchname</span
									>
								</td>
								<td class="p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>branchlocation</span
									>
								</td>
								<td class="p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>branchlocation</span
									>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<!-- Modal to edit corporate branch -->
		<ParentModal
			modal-title="Edit Branch"
			modal-id="edit-corporate-branch-modal"
			modal-placement="center-center"
			v-if="isEditCorpBranchModalOpen"
			@close-modal="
				() => {
					isEditCorpBranchModalOpen = false;
					selectedIndexToEdit = -1;
				}
			">
			<EditCorporateBranch
				:branch-id="corporateBranches[selectedIndexToEdit].branchId"
				:branch-name="corporateBranches[selectedIndexToEdit].branchName"
				:branch-location="corporateBranches[selectedIndexToEdit].branchLocation" />
		</ParentModal>

		<!-- Modal to add corporate branch -->
		<ParentModal
			modal-title="Add Branch"
			modal-id="add-corporate-branch-modal">
			<AddCorporateBranch />
		</ParentModal>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'corp-branches',
	});

	const selectedIndexToEdit: Ref<any> = ref(-1);
	const isEditCorpBranchModalOpen: Ref<boolean> = ref(false);
	const { corporateBranches, fetchStatus, fetchError, reloadCorporateBranches } =
		useCorporateBranch();
</script>
