<template>
	<tr class="hover:shadow-lg">
		<td class="px-6 py-4 whitespace-nowrap font-semibold text-pink-600">
			KDF 345Y
		</td>
		<td class="px-6 py-4 whitespace-nowrap text-gray-600 font-semibold">
			11/03/2024
		</td>
		<td class="px-6 py-4 whitespace-nowrap text-gray-600 font-semibold">
			10/03/2025
		</td>
		<td
			class="px-6 text-center py-4 whitespace-nowrap w-full text-gray-500 font-medium inline-flex flex-col">
			<span class="text-start">Toyota</span>
			<span class="text-start">Camri</span>
		</td>
		<td
			class="px-6 py-4 whitespace-nowrap text-center font-semibold text-blue-500">
			Roadside Assistance
		</td>
		<td
			class="px-6 py-4 whitespace-nowrap text-center font-semibold text-green-500">
			Active
		</td>
		<td
			class="px-6 py-4 whitespace-nowrap text-center font-semibold text-pink-500">
			Paid
		</td>
		<td>
			<div class="hs-dropdown relative inline-flex [--placement:left]">
				<button
					id="hs-dropdown-hover-event"
					type="button"
					class="hs-dropdown-toggle py-3 px-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1.5em"
						height="2em"
						viewBox="0 0 24 24">
						<path
							fill="none"
							stroke="currentColor"
							stroke-linejoin="round"
							stroke-width="3.75"
							d="M12 12h.01v.01H12zm0-7h.01v.01H12zm0 14h.01v.01H12z" />
					</svg>
				</button>

				<div
					class="hs-dropdown-menu border transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg mt-2 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full font-semibold"
					aria-labelledby="hs-dropdown-hover-event">
					<!-- TODO: create page to edit membership -->
					<NuxtLink
						class="flex items-center gap-x-3.5 p-3 rounded-t-lg text-sm text-blue-700 hover:bg-blue-300 focus:outline-none"
						:to="{
							name: 'edit-membership-details',
							query: {
								membershipId: 'test-id',
								vehicleRegistration: 'KDF 345Y',
								vehicleMake: 'Toyota',
								vehicleModel: 'Camri',
								membershipStatus: 'Active',
								paymentStatus: 'Paid',
								clientName: componentProps.clientName,
							},
						}"
						>Edit Membership</NuxtLink
					>
					<button
						class="flex items-center gap-x-3.5 p-3 rounded-b-lg w-full text-sm text-red-700 hover:bg-red-300 focus:outline-none">
						Delete Membership
					</button>
				</div>
			</div>
		</td>
	</tr>
</template>

<script setup lang="ts">
	export interface ComponentProps {
		clientName: string;
	}

	const componentProps = defineProps<ComponentProps>();
</script>
