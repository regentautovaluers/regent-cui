<template>
	<div class="h-full">
		<div class="flex flex-col items-center justify-between space-y-3 lg:flex-row lg:space-y-0">
			<div
				class="border-b-1 w- space-x-4 text-sm font-semibold text-gray-500 md:text-base lg:w-fit lg:text-lg">
				<button
					@click="() => (activeView = 0)"
					:class="[
						'border-b-2',
						activeView === 0 ? 'border-b-blue-600 text-blue-600' : 'border-b-inherit',
					]">
					<span>Create Authority Letter</span>
				</button>
				<button
					@click="() => (activeView = 1)"
					:class="[
						'border-b-2',
						activeView === 1 ? 'border-b-blue-600 text-blue-600' : 'border-b-inherit',
					]">
					<span>View Authority Letters</span>
				</button>
			</div>
			<!-- <NuxtLink
				:to="{ name: 'memberships-home' }"
				class="w-full rounded-md bg-blue-600 p-4 text-center text-sm font-semibold text-white md:w-fit"
				>VIEW ALL MEMBERS</NuxtLink
			> -->
		</div>
		<div class="mt-6">
			<CreateAuthorizationLetter v-if="activeView === 0" />
			<div
				class="my-4 flex-grow"
				v-if="activeView === 1">
				<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
					<table class="w-full text-left text-gray-500">
						<thead class="bg-gray-100 text-sm uppercase text-gray-700">
							<tr>
								<th
									scope="col"
									class="table-headers">
									Reg No.
								</th>
								<!-- Details will show client name and their contact -->
								<th
									scope="col"
									class="table-headers">
									Client Details
								</th>
								<th
									scope="col"
									class="table-headers">
									Regent Branch
								</th>
								<th
									scope="col"
									class="table-headers">
									Policy Number
								</th>
								<th
									scope="col"
									class="table-headers">
									Agency / Broker
								</th>
								<th
									scope="col"
									class="table-headers">
									Authorized By
								</th>
								<th
									scope="col"
									class="table-headers" />
							</tr>
						</thead>
						<tbody>
							<!-- loading state -->
							<tr class="border-b bg-white hover:bg-gray-100" v-for="a in 10" :key="a">
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
									<span class="animate-pulse rounded-lg bg-gray-300">regenthq</span>
								</td>
								<td class="p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>domain role</span
									>
								</td>
								<td class="p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>agency</span
									>
								</td>
								<td class="p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>authorizedby</span
									>
								</td>
								<td></td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<!-- page controls -->
			<div class="flex h-12 items-center justify-between">
				<h1 class="text-sm font-semibold text-gray-500 md:text-base">
					Showing {{ 1 }} of Y pages.
				</h1>
				<div class="h-full space-x-2 md:space-x-4">
					<button class="table-page-buttons">Previous</button>
					<button class="table-page-buttons">Next</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'vehicle-valuation-authorization-letter',
		layout: 'console-layout',
	});

	const activeView = ref(0);
</script>
