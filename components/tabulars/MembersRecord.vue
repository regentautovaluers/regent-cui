<template>
	<tr class="hover:shadow-lg">
		<td class="px-6 py-4 whitespace-nowrap font-semibold text-gray-600">
			{{ componentProps.memberName }}
		</td>
		<td class="px-6 py-4 whitespace-nowrap text-blue-600 font-semibold">
			{{ capitalizeFirstLetter(componentProps.membershipCategory) }}
		</td>
		<td
			class="px-6 py-4 whitespace-nowrap text-center font-semibold text-pink-500">
			<NuxtLink
				:to="{
					name: 'membership-details',
					query: {
						clientName: componentProps.memberName,
						numberOfVehicles: componentProps.numberOfVehicles,
						clientPhone: componentProps.memberPhone,
						clientEmail: componentProps.memberEmail,
						id: componentProps.id,
					},
				}"
				>{{ componentProps.numberOfVehicles }}</NuxtLink
			>
		</td>
		<td
			class="px-6 text-center py-4 whitespace-nowrap w-full text-gray-500 font-medium inline-flex flex-col">
			<span class="text-start">{{ componentProps.memberPhone }}</span>
			<span class="text-start">{{ componentProps.memberEmail }}</span>
		</td>
		<td>
			<div class="hs-dropdown relative inline-flex [--placement:left]">
				<button
					@click="
						() => {
							console.log('dropdown button clicked');
						}
					"
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
						:to="{
							name: 'edit-member-details',
							query: {
								memberName: componentProps.memberName,
								memberPhone: componentProps.memberPhone,
								memberEmail: componentProps.memberEmail,
								memberId: componentProps.id,
							},
						}"
						class="flex items-center gap-x-3.5 p-3 rounded-t-lg text-sm text-blue-700 hover:bg-blue-300 focus:outline-none">
						Edit Details
					</NuxtLink>
					<NuxtLink
						class="flex items-center gap-x-3.5 p-3 rounded-b-lg text-sm text-blue-700 hover:bg-blue-300 focus:outline-none"
						:to="{
							name: 'membership-details',
							query: {
								clientName: componentProps.memberName,
								numberOfVehicles:
									componentProps.numberOfVehicles,
								clientPhone: componentProps.memberPhone,
								clientEmail: componentProps.memberEmail,
								id: componentProps.id,
							},
						}"
						>View Memberships</NuxtLink
					>
				</div>
			</div>
		</td>
	</tr>
</template>

<script setup lang="ts">
	export interface ComponentProps {
		memberName: string;
		numberOfVehicles: number;
		memberPhone?: string;
		memberEmail?: string;
		membershipCategory: string;
		id: number;
	}

	const componentProps = defineProps<ComponentProps>();

	function capitalizeFirstLetter(word: string): string {
		// Check if the word is not empty
		if (word && word.length > 0) {
			// Extract the first character and convert it to uppercase
			const firstLetter = word.charAt(0).toUpperCase();
			// Concatenate the rest of the string starting from the second character
			const restOfWord = word.slice(1);
			// Return the modified string
			return firstLetter + restOfWord;
		}
		// If the word is empty, return it as is
		return word;
	}
</script>
