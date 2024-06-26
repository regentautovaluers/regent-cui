<template>
	<tr class="hover:shadow-lg">
		<td class="px-6 py-4 whitespace-nowrap font-semibold text-pink-600">
			{{ componentProps.fleetName }}
		</td>
		<td class="px-6 py-4 whitespace-nowrap text-gray-600 font-semibold">
			{{ componentProps.contactName }}
		</td>
		<td
			class="px-6 py-4 whitespace-nowrap text-gray-600 text-center font-semibold">
			{{ componentProps.contactEmail }}
		</td>
		<td
			class="px-6 py-4 whitespace-nowrap text-center font-semibold text-blue-500">
			{{ componentProps.contactPhone }}
		</td>
		<td
			class="px-6 py-4 whitespace-nowrap text-center font-semibold text-pink-500">
			<NuxtLink
				:to="{
					// name: 'membership-details',
					// query: {
					// 	clientName: componentProps.memberName,
					// 	numberOfVehicles: componentProps.numberOfVehicles,
					// 	clientPhone: componentProps.memberPhone,
					// 	clientEmail: componentProps.memberEmail,
					// 	id: componentProps.id,
					// },
				}"
				>{{ componentProps.registeredMembers }}</NuxtLink
			>
		</td>

		<!-- <td>
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
					<NuxtLink
						class="flex items-center gap-x-3.5 p-3 rounded-t-lg text-sm text-blue-700 hover:bg-blue-300 focus:outline-none"
						:to="{
							name: 'edit-membership-details',
							query: {
								membershipId: componentProps.membershipId,
								vehicleRegistration:
									componentProps.vehicleRegistration,
								vehicleMake: componentProps.vehicleMake,
								vehicleModel: componentProps.vehicleModel,
								membershipStatus:
									componentProps.membershipStatus,
								paymentStatus: componentProps.paymentStatus,
								clientName: $route.query.clientName,
							},
						}"
						>Edit Membership</NuxtLink
					>
					<button
						class="flex items-center gap-x-3.5 p-3 rounded-b-lg w-full text-sm text-red-700 hover:bg-red-300 focus:outline-none"
						@click="deleteMembershipRecord">
						<span>Delete Membership</span>
						<div
							v-if="deleteMembershipLoading"
							class="animate-spin inline-block size-5 border-[3px] border-white border-current border-t-transparent text-gray-800 rounded-full"
							role="status"
							aria-label="loading" />
					</button>
				</div>
			</div>
		</td> -->
	</tr>
</template>

<script setup lang="ts">
	export interface ComponentProps {
		fleetName: string;
		contactName: string;
		contactEmail: string;
		contactPhone: string;
		registeredMembers: string;
		fleetId: string;
	}

	const componentProps = defineProps<ComponentProps>();
</script>
