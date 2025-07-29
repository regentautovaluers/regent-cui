<template>
	<div>
		<div class="my-2 flex-grow">
			<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
				<table class="w-full text-left text-gray-500">
					<thead class="bg-gray-100 text-sm text-gray-700 uppercase">
						<tr>
							<th
								scope="col"
								class="table-headers">
								Date Recorded
							</th>
							<!-- Details will show client name and their contact -->
							<th
								scope="col"
								class="table-headers">
								Creditor
							</th>
							<th
								scope="col"
								class="table-headers">
								Category of Secured Creditor
							</th>
							<th
								scope="col"
								class="table-headers">
								Period of Effectiveness (Days)
							</th>
							<th
								scope="col"
								class="table-headers">
								Amount
							</th>
						</tr>
					</thead>
					<tbody>
						<!-- the actual data -->
						<tr
							class="border-b bg-white text-sm hover:bg-gray-100"
							v-for="(entry, index) in props.entries"
							:key="index">
							<td class="p-5">
								{{ entry.inserted_at.split('T')[0] }}
							</td>
							<td class="p-5">
								{{ entry.creditors[index]?.name ?? 'Name N/A' }}
							</td>
							<td class="p-5">
								{{
									entry.creditors[index]?.category_of_secured_creditor ??
									'Category N/A'
								}}
							</td>
							<td class="p-5">
								{{ entry.period_of_effectiveness }}
							</td>
							<td class="p-5">
								{{
									Intl.NumberFormat('en-US', {
										minimumFractionDigits: 0,
										maximumFractionDigits: 0,
									}).format(Number(entry.currency_amounts[index]?.amount))
								}}
								{{ entry.currency_amounts[index]?.currency }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const props = defineProps({
		entries: { required: true, type: Array },
	});
</script>
