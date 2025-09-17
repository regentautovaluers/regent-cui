<template>
	<!-- members listing -->
	<div class="laptop:p-4 laptop-lg:p-8 flex flex-1 flex-col p-2">
		<!-- div to show when there is a fetch error -->
		<div
			class="flex h-full flex-1 flex-col items-center justify-center space-y-4 text-sm"
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
			class="flex h-full flex-1 flex-col items-center justify-center space-y-4 text-sm"
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
			<div class="flex h-10 items-center justify-between space-x-2">
				<button
					class="h-[50px] text-sm font-semibold text-blue-600 hover:text-blue-600"
					type="button"
					data-modal-target="add-corporate-branch-modal"
					data-modal-toggle="add-corporate-branch-modal">
					Add New Branch
				</button>

				<form
					class="tablet:mt-0 tablet:w-[50%] laptop-lg:w-[25%] relative mt-2 flex w-full items-center justify-between">
					<input
						type="text"
						class="generic-input h-[50px]"
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
										type="button"
										class="text-blue-600 hover:font-semibold hover:text-blue-700"
										data-modal-target="edit-corporate-branch-modal"
										data-modal-toggle="edit-corporate-branch-modal"
										@click="
											() => {
												selectedIndexToEdit = index;
											}
										">
										Edit
									</button>
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
			@close-modal="
				() => {
					selectedIndexToEdit = -1;
				}
			">
			<EditCorporateBranch
				v-if="corporateBranches && selectedIndexToEdit > -1"
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
	const { corporateBranches, fetchStatus, fetchError, reloadCorporateBranches } =
		useCorporateBranch();
</script>
