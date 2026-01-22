<template>
	<div
		class="tablet:justify-center flex h-screen flex-col bg-gray-400 bg-[url('/images/helicopter-image.jpg')] bg-cover bg-no-repeat bg-blend-multiply">
		<h1
			class="laptop:text-4xl mb-4 text-center text-2xl leading-none font-extrabold tracking-tight text-white">
			Membership Types
		</h1>
		<div
			class="tablet:flex-row tablet:justify-center tablet:space-x-4 flex flex-col space-y-4 p-2 md:space-y-0">
			<MembershipTypesCard
				v-for="(membership, index) in membershipTypes"
				:key="index">
				<template #membershipType>
					<div class="laptop:w-1/2 w-full">
						<h1 class="font-semibold underline group-hover:text-white">
							{{ membership.membership_name }}
						</h1>
					</div>
				</template>
				<template #benefitsAndPricing>
					<p class="group-hover:text-white">
						{{ membership.membership_description }}
					</p>
					<ul class="space-y-1 group-hover:text-white">
						<li
							class="flex items-center space-x-3"
							v-for="(benefit, index) in membership.benefits"
							:key="index">
							<svg
								class="mt-0.5 size-4 shrink-0 text-black group-hover:text-white"
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
							name: 'ava-membership-onboard',
							params: {
								membership_type: 'roadside-assistance',
							},
							query: {
								membershipType_id: membership.id,
							},
						}"
						class="mt-2 inline-flex w-fit items-center space-x-2 rounded-md bg-black p-4 text-white group-hover:bg-white group-hover:text-black">
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
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'ava-membership-types',
		layout: 'console-layout',
	});

	const { membershipTypes, fetchingMembershipTypes, errorFetchingMembershipTypes } =
		useAVAMembershipTypes();
</script>
