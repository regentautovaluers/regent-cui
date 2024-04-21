<template>
	<tr class="hover:shadow-lg">
		<td class="px-6 py-4 whitespace-nowrap font-semibold text-gray-600">
			{{ componentProps.clientName }}
		</td>
		<td class="px-6 py-4 whitespace-nowrap text-blue-600 font-semibold">
			{{
				`${capitalizeFirstLetter(
					componentProps.membershipCategory
				)} Member`
			}}
		</td>
		<td
			class="px-6 py-4 whitespace-nowrap text-center font-semibold text-pink-500">
			<NuxtLink
				:to="{
					name: 'membership-details',
					query: {
						id: componentProps.memberId,
					},
				}"
				>{{ componentProps.vehicleCount }}</NuxtLink
			>
		</td>
		<td
			class="px-6 py-6 whitespace-nowrap text-end font-semibold text-gray-600">
			{{
				!componentProps.clientPhone
					? "Phone Number Not Provided"
					: `+${componentProps.clientPhone}`
			}}
		</td>
		<td
			class="px-6 py-6 whitespace-nowrap text-end font-semibold text-gray-600">
			{{
				!componentProps.clientEmail
					? "Email Not Provided"
					: componentProps.clientEmail
			}}
		</td>
		<td class="text-center">
			<div class="hs-dropdown relative inline-flex [--placement:left]">
				<button
					id="hs-dropdown-default"
					type="button"
					class="hs-dropdown-toggle">
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
					class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg p-2 mt-2 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full border z-20"
					aria-labelledby="hs-dropdown-default">
					<NuxtLink
						v-if="
							getDetails.userlevel === 'admin' ||
							getDetails.userlevel === 'broker'
						"
						:to="{
							name: 'edit-member-details',
							query: {
								memberName: componentProps.clientName,
								memberPhone: componentProps.clientPhone,
								memberEmail: componentProps.clientEmail,
								memberId: componentProps.memberId,
							},
						}"
						class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
						Edit Details
					</NuxtLink>
					<NuxtLink
						:to="{
							name: 'membership-details',
							query: {
								id: componentProps.memberId,
							},
						}"
						class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
						View Vehicles
					</NuxtLink>
				</div>
			</div>
		</td>
	</tr>
</template>

<script setup lang="ts">
	const componentProps = defineProps<{
		clientName: string;
		membershipCategory: string;
		vehicleCount: string | number;
		memberId: string | number;
		clientPhone: string;
		clientEmail: string | null;
	}>();
	const { capitalizeFirstLetter } = useUtils();
	const { getDetails } = usePrincipal();
</script>
