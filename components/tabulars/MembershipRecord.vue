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
			<div class="inline-flex rounded-lg shadow-sm">
				<NuxtLink
					:to="{
						name: 'edit-membership-details',
						query: {
							membershipId: componentProps.membershipId,
							vehicleRegistration:
								componentProps.vehicleRegistration,
							vehicleMake: componentProps.vehicleMake,
							vehicleModel: componentProps.vehicleModel,
							membershipStatus: componentProps.membershipStatus,
							paymentStatus: componentProps.paymentStatus,
							clientName: $route.query.clientName,
						},
					}"
					class="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-full first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 whitespace-nowrap overflow-hidden text-overflow-ellipsis">
					Edit Vehicle
				</NuxtLink>
				<button
					class="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-full first:ms-0 last:rounded-e-full text-sm font-medium focus:z-10 border border-gray-200 bg-red-500 text-white  hover:bg-red-600 whitespace-nowrap overflow-hidden text-overflow-ellipsis"
					@click="deleteMembershipRecord">
					<span>Delete Vehicle</span>
					<div
						v-if="deleteMembershipLoading"
						class="animate-spin inline-block size-5 border-[3px] border-white border-current border-t-transparent text-gray-800 rounded-full"
						role="status"
						aria-label="loading" />
				</button>
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
