<template>
	<tr class="hover:shadow-lg">
		<td class="px-6 py-4 whitespace-nowrap font-semibold text-gray-600">
			James Otieno
		</td>
		<td class="px-6 py-4 whitespace-nowrap text-blue-600 font-semibold">
			Individual
		</td>
		<td
			class="px-6 py-4 whitespace-nowrap text-center font-semibold text-pink-500">
			<NuxtLink
				:to="{
					name: 'membership-details',
					query: {
						clientName: 'James Otieno',
						numberOfVehicles: 5,
						clientPhone: '+254113883976',
						clientEmail: 'jamesotieno@gmail.com',
					},
				}"
				>5</NuxtLink
			>
		</td>
		<td
			class="px-6 text-center py-4 whitespace-nowrap w-full text-gray-500 font-medium inline-flex flex-col">
			<span class="text-start">+254 712345678</span>
			<span class="text-start">jamesotieno@gmail.com</span>
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
					<NuxtLink
						:to="{ name: 'edit-membership-details' }"
						class="flex items-center gap-x-3.5 p-3 rounded-t-lg text-sm text-blue-700 hover:bg-blue-300 focus:outline-none">
						Edit Details
					</NuxtLink>
					<NuxtLink
						class="flex items-center gap-x-3.5 p-3 rounded-b-lg text-sm text-blue-700 hover:bg-blue-300 focus:outline-none"
						:to="{
							name: 'membership-details',
							query: {
								clientName: 'James Otieno',
								numberOfVehicles: 5,
								clientPhone: '+254113883976',
								clientEmail: 'jamesotieno@gmail.com',
							},
						}"
						>View Memberships</NuxtLink
					>
				</div>
			</div>
		</td>
	</tr>
</template>

<script setup lang="ts"></script>
