<template>
	<tr
		class="hover:shadow-lg"
		v-for="(record, index) in memberVehiclesList"
		:key="index">
		<td class="px-6 py-4 whitespace-nowrap font-semibold text-pink-600">
			{{ record.registration }}
		</td>
		<td class="px-6 py-4 whitespace-nowrap text-gray-600 font-semibold">
			{{ formatServerProvidedDate(record.start_date) }}
		</td>
		<td class="px-6 py-4 whitespace-nowrap text-gray-600 font-semibold">
			{{ formatServerProvidedDate(record.end_date) }}
		</td>
		<td
			class="px-6 text-center py-4 whitespace-nowrap w-full text-gray-500 font-medium inline-flex flex-col">
			<span class="text-start">{{ record.make }}</span>
			<span class="text-start">{{ record.model }}</span>
		</td>
		<td
			class="px-6 py-4 whitespace-nowrap text-center font-semibold text-blue-500">
			{{
				capitalizeFirstLetterOfEachWord(
					record.membershipType.membership_name
				)
			}}
		</td>
		<td
			class="px-6 py-4 whitespace-nowrap text-center font-semibold text-green-500">
			{{ capitalizeFirstLetter(record.membership_status) }}
		</td>
		<td
			class="px-6 py-4 whitespace-nowrap text-center font-semibold text-pink-500">
			{{ capitalizeFirstLetter(record.payment_status) }}
		</td>

		<td>
			<div class="inline-flex rounded-lg shadow-sm">
				<NuxtLink
					:to="{
						name: 'edit-membership-details',
						query: {
							membershipId: record.id,
							vehicleRegistration: record.registration,
							vehicleMake: record.make,
							vehicleModel: record.model,
							membershipStatus: record.membership_status,
							paymentStatus: record.payment_status,
							clientName:
								memberVehiclesList[0].membership.full_name,
						},
					}"
					class="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-full first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 whitespace-nowrap overflow-hidden text-overflow-ellipsis">
					Edit Vehicle
				</NuxtLink>
				<button
					class="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-full first:ms-0 last:rounded-e-full text-sm font-medium focus:z-10 border border-gray-200 bg-red-500 text-white hover:bg-red-600 whitespace-nowrap overflow-hidden text-overflow-ellipsis"
					@click="deleteMembershipRecord(record.id)">
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
	const deleteMembershipLoading: Ref<boolean> = ref(false);
	const runtimeConfig = useRuntimeConfig();
	const router = useRouter();
	const { openToast } = useToast();
	const { formatServerProvidedDate } = useUtils();
	const route = useRoute();
	const memberVehiclesList: Ref<any[]> = ref([]);
	const emit = defineEmits(["provideClientDetails"]);

	try {
		await $fetch(
			`${runtimeConfig.public.DEV_TIME_HOST}/api/v1/membershipVehicles/membership/${route.query.id}`,
			{
				method: "GET",
				async onResponse({ response }) {
					if (response.status !== 200) {
						throw new Error(
							"Failed to retrieve corporate's members"
						);
					}
					memberVehiclesList.value = response._data;
					emit(
						"provideClientDetails",
						memberVehiclesList.value[0].membership.full_name,
						!memberVehiclesList.value[0].membership.userEmail
							? "Email not provided"
							: memberVehiclesList.value[0].membership.userEmail,
						memberVehiclesList.value[0].membership.phone_number,
						memberVehiclesList.value.length
					);
				},
			}
		);
	} catch (error) {
		console.log("An error occured: ", error);
		openToast("Failed to load your members. Reload page!", "danger");
	}

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

	async function deleteMembershipRecord(membershipId: number) {
		deleteMembershipLoading.value = true;
		try {
			await $fetch(
				`${runtimeConfig.public.DEV_TIME_HOST}/api/v1/membershipVehicles/${membershipId}`,
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
