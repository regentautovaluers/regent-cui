<template>
	<tr class="hover:shadow-lg">
		<td class="px-6 py-4 whitespace-nowrap font-semibold text-pink-600">
			{{ componentProps.vehicleRegistration }}
		</td>
		<td class="px-6 py-4 whitespace-nowrap text-gray-600 font-semibold">
			{{ formatServerProvidedDate(componentProps.membershipStartDate) }}
		</td>
		<td class="px-6 py-4 whitespace-nowrap text-gray-600 font-semibold">
			{{ formatServerProvidedDate(componentProps.membershipEndDate) }}
		</td>
		<td
			class="px-6 text-center py-4 whitespace-nowrap w-full text-gray-500 font-medium inline-flex flex-col">
			<span class="text-start">{{ componentProps.vehicleMake }}</span>
			<span class="text-start">{{ componentProps.vehicleModel }}</span>
		</td>
		<td
			class="px-6 py-4 whitespace-nowrap text-center font-semibold text-blue-500">
			{{ capitalizeFirstLetterOfEachWord(componentProps.membershipType) }}
		</td>
		<td
			class="px-6 py-4 whitespace-nowrap text-center font-semibold text-green-500">
			{{ capitalizeFirstLetter(componentProps.membershipStatus) }}
		</td>
		<td
			class="px-6 py-4 whitespace-nowrap text-center font-semibold text-pink-500">
			{{ capitalizeFirstLetter(componentProps.paymentStatus) }}
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
						>Edit Vehicle</NuxtLink
					>
					<button
						class="flex items-center gap-x-3.5 p-3 rounded-b-lg w-full text-sm text-red-700 hover:bg-red-300 focus:outline-none"
						@click="deleteMembershipRecord">
						<span>Delete Vehicle</span>
						<div
							v-if="deleteMembershipLoading"
							class="animate-spin inline-block size-5 border-[3px] border-white border-current border-t-transparent text-gray-800 rounded-full"
							role="status"
							aria-label="loading" />
					</button>
				</div>
			</div>
		</td>
	</tr>
</template>

<script setup lang="ts">
	const componentProps = defineProps<{
		vehicleRegistration: string;
		membershipStartDate: string;
		membershipEndDate: string;
		vehicleMake: string;
		vehicleModel: string;
		membershipStatus: string;
		paymentStatus: string;
		membershipType: string;
		membershipId: number;
	}>();
	const deleteMembershipLoading: Ref<boolean> = ref(false);
	const runtimeConfig = useRuntimeConfig();
	const router = useRouter();
	const { openToast } = useToast();
	const { formatServerProvidedDate } = useUtils();

	function capitalizeFirstLetterOfEachWord(sentence: string): string {
		// Check if the sentence is not empty
		if (sentence && sentence.length > 0) {
			// Split the sentence into words
			const words = sentence.split(" ");
			// Capitalize the first letter of each word
			const capitalizedWords = words.map((word) => {
				if (word && word.length > 0) {
					const firstLetter = word.charAt(0).toUpperCase();
					const restOfWord = word.slice(1);
					return firstLetter + restOfWord;
				}
				return word;
			});
			// Join the words back together with spaces
			return capitalizedWords.join(" ");
		}
		// If the sentence is empty, return it as is
		return sentence;
	}

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

	async function deleteMembershipRecord() {
		deleteMembershipLoading.value = true;
		try {
			await $fetch(
				`${runtimeConfig.public.DEV_TIME_HOST}/api/v1/membershipVehicles/${componentProps.membershipId}`,
				{
					method: "DELETE",
					async onResponse({ response }) {
						if (response.status !== 204) {
							throw new Error("Membership details not deleted.");
						}

						openToast(
							"Member details deleted successfully. Page should redirect!",
							"success"
						);

						router.back();
					},
				}
			);
		} catch (error) {
			console.log("Error encountered. Reason: ", error);
			openToast("Failed to delete member details. Try again!", "danger");
		} finally {
			deleteMembershipLoading.value = false;
		}
	}
</script>
