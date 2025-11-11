<template>
	<!-- members listing -->
	<div
		class="laptop:p-4 laptop-lg:p-8 flex flex-1 flex-col rounded-lg border-2 bg-white p-2 outline-none">
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
			<div class="flex h-10 items-center justify-between space-x-2">
				<button
					class="group inline-flex h-[50px] w-fit cursor-pointer items-center justify-center rounded-lg border border-gray-400 px-2 outline-none hover:bg-gray-100"
					type="button"
					data-modal-target="add-corporate-branch-modal"
					data-modal-toggle="add-corporate-branch-modal">
					<span
						class="icon-[material-symbols-light--add-location-rounded] size-8 text-gray-400"></span>
					<span class="text-gray-400">Add New Branch</span>
				</button>
			</div>

			<!-- the table itself -->
			<div class="my-4 flex-grow">
				<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
					<table class="w-full text-left text-gray-500">
						<thead class="bg-gray-100 text-sm text-gray-700 uppercase">
							<tr>
								<th
									scope="col"
									class="table-headers ps-3">
									Branch Name
								</th>
								<th
									scope="col"
									class="table-headers laptop:table-cell hidden">
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
									class="py-4 ps-3 font-semibold whitespace-nowrap text-pink-600">
									{{ branch.branchName }}
								</td>
								<td class="laptop:table-cell hidden py-4">
									{{ branch.branchLocation }}
								</td>
								<td class="flex items-center justify-end px-4 py-4">
									<button
										type="button"
										class="cursor-pointer text-blue-600 hover:font-semibold hover:text-blue-700"
										:data-modal-target="`edit-corporate-branch-${branch.branchId}-modal`"
										:data-modal-toggle="`edit-corporate-branch-${branch.branchId}-modal`">
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
		<template
			v-if="corporateBranches && corporateBranches.length > 0"
			v-for="branch in corporateBranches">
			<ParentModal
				modal-title="Edit Branch"
				:modal-id="`edit-corporate-branch-${branch.branchId}-modal`">
				<EditCorporateBranch
					:branch-id="branch.branchId"
					:branch-name="branch.branchName"
					:branch-location="branch.branchLocation" />
			</ParentModal>
		</template>

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

	const { corporateBranches, fetchStatus, fetchError, reloadCorporateBranches } =
		useCorporateBranch();
</script>
