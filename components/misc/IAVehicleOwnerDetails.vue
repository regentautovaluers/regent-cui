<template>
	<div>
		<div class="my-2 flex-grow">
			<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
				<table class="w-full text-left text-gray-500">
					<thead class="bg-gray-100 text-sm uppercase text-gray-700">
						<tr>
							<th
								scope="col"
								class="table-headers">
								Name
							</th>
							<!-- Details will show client name and their contact -->
							<th
								scope="col"
								class="table-headers">
								ID Number
							</th>
							<th
								scope="col"
								class="table-headers">
								Address
							</th>
							<th
								scope="col"
								class="table-headers">
								Phone Number
							</th>
							<th
								scope="col"
								class="table-headers">
								Town
							</th>
							<th
								scope="col"
								class="table-headers">
								Ownership Type
							</th>
						</tr>
					</thead>
					<tbody>
						<!-- the actual data -->
						<tr class="border-b bg-white hover:bg-gray-100">
							<td class="p-5">
								{{ props.name }}
							</td>
							<td class="p-5">
								{{ props.idNumber }}
							</td>
							<td class="p-5">
								{{ props.address }}
							</td>
							<td class="p-5">
								{{ props.phoneNumer }}
							</td>
							<td class="p-5">
								{{ props.town }}
							</td>
							<td class="p-5">
								{{ props.ownerType }}
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
		name: {
			required: false,
			type: String,
			default: 'N/A',
		},
		idNumber: {
			required: false,
			type: String,
			default: 'N/A',
		},
		address: {
			required: false,
			type: String,
			default: 'N/A',
		},
		phoneNumer: {
			required: false,
			type: String,
			default: 'N/A',
		},
		town: {
			required: false,
			type: String,
			default: 'N/A',
		},
		ownerType: {
			required: false,
			type: String,
			default: 'N/A',
		},
	});
</script>
