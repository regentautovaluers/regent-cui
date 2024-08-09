<template>
	<tr class="hover:shadow-lg">
		<td class="whitespace-nowrap px-6 py-6 font-semibold text-pink-600">
			{{ componentProps.vehicleRegNo }}
		</td>
		<td class="whitespace-nowrap px-6 py-6 font-semibold text-gray-600">
			{{ componentProps.vehicleMake }}
		</td>
		<td class="whitespace-nowrap px-6 py-6 text-start font-semibold text-blue-500">
			{{ componentProps.vehicleModel }}
		</td>
		<td
			class="overflow-hidden text-ellipsis whitespace-nowrap px-6 py-6 text-end font-semibold text-pink-500">
			{{ componentProps.bookingNo }}
		</td>
		<td class="whitespace-nowrap px-6 py-6 text-center font-semibold text-green-500">
			{{ componentProps.valuationDate }}
		</td>
		<td
			class="overflow-hidden text-ellipsis whitespace-nowrap px-6 py-6 text-center font-semibold text-pink-500">
			{{ componentProps.vehicleAssessedValue }}
		</td>
		<td class="whitespace-nowrap px-6 py-6 font-semibold text-gray-600">
			{{ componentProps.clientName }}
		</td>
		<td
			class="overflow-hidden text-ellipsis whitespace-nowrap px-6 py-6 text-start font-semibold text-pink-500">
			{{ componentProps.regentBranch }}
		</td>
		<td
			class="overflow-hidden text-ellipsis whitespace-nowrap px-6 py-6 text-start font-semibold text-pink-500">
			{{ componentProps.attachedNote }}
		</td>
		<!-- <td>
			<div
				class="relative inline-block text-left"
				ref="dropdownContainer">
				<button @click="toggleDropdown">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1.8em"
						height="1.8em"
						viewBox="0 0 24 24">
						<path
							fill="currentColor"
							fill-rule="evenodd"
							d="M10.5 5A1.5 1.5 0 0 1 12 3.5h.01a1.5 1.5 0 0 1 1.5 1.5v.01a1.5 1.5 0 0 1-1.5 1.5H12a1.5 1.5 0 0 1-1.5-1.5zm0 7a1.5 1.5 0 0 1 1.5-1.5h.01a1.5 1.5 0 0 1 1.5 1.5v.01a1.5 1.5 0 0 1-1.5 1.5H12a1.5 1.5 0 0 1-1.5-1.5zm1.5 5.5a1.5 1.5 0 0 0-1.5 1.5v.01a1.5 1.5 0 0 0 1.5 1.5h.01a1.5 1.5 0 0 0 1.5-1.5V19a1.5 1.5 0 0 0-1.5-1.5z"
							clip-rule="evenodd" />
					</svg>
				</button>
				<div
					v-if="isDropdownVisible"
					@click.stop
					class="custom-dropdown -top-[80%]">
					<div
						class="py-1"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="options-menu">
						<NuxtLink
							:to="{
								name: 'valuation-view-report',
								query: {
									registration: componentProps.vehicleRegNo,
									id: componentProps.vehicleId,
								},
							}"
							class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
							View Report
						</NuxtLink>
					</div>
				</div>
			</div>
		</td> -->
	</tr>
</template>

<script setup lang="ts">
	const componentProps = defineProps<{
		vehicleRegNo: string;
		vehicleMake: string;
		vehicleModel: string;
		bookingNo: string;
		valuationDate: string;
		vehicleAssessedValue: string;
		clientName: string;
		regentBranch: string;
		attachedNote: string;
	}>();
</script>
