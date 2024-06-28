<template>
	<div class="py-10 bg-[#f6f9f2] responsive-view h-full">
		<div class="bg-white relative">
			<img
				src="/images/membership-types-img.jpg"
				alt="Membership Types Image"
				class="w-full h-[45rem] object-cover rounded-md" />
			<div class="absolute top-20 w-full text-center">
				<h1
					class="text-6xl py-3 italic font-semibold text-white antialiased">
					Membership Types
				</h1>
				<div
					class="mt-44 flex flex-col lg:flex-row items-center justify-center space-x-0 lg:space-x-10 space-y-10 lg:space-y-0">
					<MembershipTypesCard
						v-for="(membership, index) in membershipTypes"
						:key="index">
						<template #membershipType>
							<div class="w-1/2">
								<h1
									class="font-semibold underline underline-offset-[16px] group-hover:text-white">
									{{ membership.membership_name }}
								</h1>
							</div>
						</template>
						<template #benefitsAndPricing>
							<h1 class="group-hover:text-white">
								<span class="text-3xl">{{
									membership.membership_rate
								}}</span>
								/ Year
							</h1>
							<p class="group-hover:text-white">
								{{ membership.membership_description }}
							</p>
							<ul class="space-y-2 group-hover:text-white">
								<li
									class="flex space-x-3 items-center"
									v-for="(
										benefit, index
									) in cleanupMembershipBenefits(
										membership.benefits
									)"
									:key="index">
									<svg
										class="flex-shrink-0 size-4 mt-0.5 group-hover:text-white text-black"
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round">
										<polyline points="20 6 9 17 4 12" />
									</svg>
									<span>{{ benefit }}</span>
								</li>
							</ul>
						</template>
						<template #registrationLink>
							<NuxtLink
								:to="{
									name: 'membership-registration',
									query: {
										registrationType: 'roadside-assistance',
										// TODO: Ensure the registration cost is dynamically calculated
										registrationCost: Number(
											membership.membership_rate
										),
										membershipTypeId: membership.id,
										freeDistance: membership.free_distance,
									},
								}"
								class="w-fit p-4 rounded-md inline-flex space-x-2 items-center bg-black group-hover:bg-white group-hover:text-black text-white mt-2">
								<span
									><svg
										xmlns="http://www.w3.org/2000/svg"
										width="1.78em"
										height="0.7em"
										viewBox="0 0 16 9">
										<path
											fill="currentColor"
											d="M12.5 5h-9c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h9c.28 0 .5.22.5.5s-.22.5-.5.5" />
										<path
											fill="currentColor"
											d="M10 8.5a.47.47 0 0 1-.35-.15c-.2-.2-.2-.51 0-.71l3.15-3.15l-3.15-3.15c-.2-.2-.2-.51 0-.71c.2-.2.51-.2.71 0l3.5 3.5c.2.2.2.51 0 .71l-3.5 3.5c-.1.1-.23.15-.35.15Z" /></svg></span
								>Onboard Now
							</NuxtLink>
						</template>
					</MembershipTypesCard>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: "new-member",
		layout: "in-app-layout",
	});
	const membershipTypes: Ref<any[]> = ref([]);
	const { openToast } = useToast();
	const runtimeConfig = useRuntimeConfig();

	function cleanupMembershipBenefits(inputString: string) {
		// Step 1: Parse the string into an array
		let array = JSON.parse(inputString);

		// Step 2: Iterate over the array to clean each string
		let cleanedArray = array.map((item: string) => {
			// Remove unnecessary characters (e.g., backslashes)
			let cleanedItem = item.replace(/\\/g, "");
			// Ensure the string is properly formatted as a sentence
			cleanedItem =
				cleanedItem.charAt(0).toUpperCase() + cleanedItem.slice(1);
			return cleanedItem;
		});

		// Step 3: Return the cleaned array
		return cleanedArray;
	}

	try {
		await $fetch("/api/v1/control-unit/membershiptypes", {
			baseURL: runtimeConfig.public.AVA_BASE_URL,
			method: "GET",
			async onResponse({ response }) {
				if (response.status !== 200) {
					throw new Error("Failed to retrieve membership types");
				}
				membershipTypes.value = response._data;
			},
		});
	} catch (error) {
		console.log("An error occured: ", error);
		openToast(
			"Failed to load available memberships. Reload page!",
			"danger"
		);
	}
</script>
