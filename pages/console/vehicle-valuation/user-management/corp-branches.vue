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
			v-else-if="fetchStatus === 'success' && corporateBranches.length === 0">
			<BirdieNotFoundIcon />
			<h1 class="font-semibold text-gray-500">Oops! Seems like you have no branches!</h1>
			<button
				class="generic-nuxt-link"
				@click="isAddCorpBranchModalOpen = true">
				Add New Branch
			</button>
		</div>

		<!-- div to show when there are members -->
		<div
			class="h-full"
			v-else>
			<!-- search & filter controls -->
			<div class="flex h-12 items-center justify-end space-x-2">
				<button
					class="h-full w-fit rounded-lg border border-blue-600 bg-blue-600 px-2 text-center text-sm font-semibold text-white md:text-base"
					@click="isAddCorpBranchModalOpen = true">
					New Branch
				</button>
				<button
					class="inline-flex h-full items-center space-x-2 rounded-lg border bg-transparent px-2 text-gray-500 hover:text-gray-600"
					@click="reloadCorporateBranches">
					<span>Refresh</span>
					<RefreshIcon classes="size-6" />
				</button>
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
							<!-- actual data -->
							<tr
								class="border-b bg-white hover:bg-gray-100"
								v-for="(branch, index) in corporateBranches"
								:key="index">
								<td
									scope="row"
									class="whitespace-nowrap p-6 font-semibold text-pink-600">
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
									class="whitespace-nowrap p-6 font-medium text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>branchname</span
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
	</div>

	<!-- Modal to edit corporate branch -->
	<ParentModal
		modal-title="Edit Branch"
		modal-id="edit-user-modal"
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
		modal-id="add-corporate-modal"
		v-if="isAddCorpBranchModalOpen"
		@close-modal="isAddCorpBranchModalOpen = false">
		<AddCorporateBranch />
	</ParentModal>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'corp-branches',
	});

	const selectedIndexToEdit: Ref<any> = ref(-1);
	const isEditCorpBranchModalOpen: Ref<boolean> = ref(false);
	const isAddCorpBranchModalOpen: Ref<boolean> = ref(false);
	const { corporateBranches, fetchStatus, fetchError, reloadCorporateBranches } =
		useCorporateBranch();
</script>
