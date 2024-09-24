<template>
	<div class="flex h-full flex-col">
		<div class="flex h-fit items-center justify-between">
			<div class="space-x-4 font-semibold text-gray-500 md:text-base lg:text-lg">
				<button
					@click="() => (activeView = 'complete')"
					:class="[
						'border-b-2',
						activeView == 'complete'
							? 'border-b-blue-600 text-blue-600'
							: 'border-b-inherit',
					]">
					<span>Completed</span>
				</button>
				<button
					@click="() => (activeView = 'pending')"
					:class="[
						'border-b-2',
						activeView === 'pending'
							? 'border-b-blue-600 text-blue-600'
							: 'border-b-inherit',
					]">
					<span>Pending</span>
				</button>
			</div>

			<!-- search box -->
			<div class="relative flex w-full items-center justify-between md:w-[45%] lg:w-[25%]">
				<input
					type="text"
					class="generic-input"
					placeholder="Search Registration Number Here" />
				<button
					type="submit"
					class="absolute right-0 top-0 flex size-14 items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700">
					<SearchIcon />
				</button>
			</div>

			<!-- other filters -->
			<div></div>
		</div>

		<div class="h-[53rem]">
			<!-- div to show when there is a fetch error -->
			<!-- <div
				class="flex h-full flex-col items-center justify-center space-y-4 rounded-lg border shadow-sm">
				<BirdieNotFoundIcon />
				<h1 class="font-semibold text-gray-500">Failed to load data!</h1>
				<button
					class="inline-flex items-center space-x-2 rounded-lg border bg-transparent px-2 py-1 text-gray-500 hover:text-gray-600"
					@click="refreshPage">
					<span>Refresh</span>
					<RefreshIcon classes="size-6" />
				</button>
			</div> -->

			<!-- div to show when there are no authorization letters -->
			<!-- <div
				class="flex h-full flex-col items-center justify-center space-y-4 rounded-lg border shadow-sm">
				<BirdieNotFoundIcon />
				<h1 class="font-semibold text-gray-500">
					Oops! Seems like you have no authority letters!
				</h1>
			</div> -->

			<!-- div to show when there are authority letters -->
			<div class="flex h-full flex-col">
				<!-- search & filter controls -->

				<div class="my-2 flex-grow">
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
										Client Name
									</th>
									<th
										scope="col"
										class="table-headers">
										Vehicle Model
									</th>
									<th
										scope="col"
										class="table-headers">
										Date
									</th>
									<th
										scope="col"
										class="table-headers">
										Value
									</th>
									<th
										scope="col"
										class="table-headers">
										Note Value
									</th>
									<th
										scope="col"
										class="table-headers">
										Booking No.
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
									v-for="a in 10"
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
											>regenthq</span
										>
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
									<td class="p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>bookingstage</span
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
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'vehicle-valuation-home',
		layout: 'console-layout',
	});

	const { activeView } = useCorporateValuations();
</script>
