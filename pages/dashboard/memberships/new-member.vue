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
				<div class="mt-44 flex justify-center space-x-10">
					<MembershipTypesCard>
						<template #membershipType>
							<div class="w-1/2">
								<h1
									class="font-semibold underline underline-offset-[16px]">
									Roadside Assistance
								</h1>
							</div>
						</template>
						<template #benefitsAndPricing>
							<h1>3500 / Month</h1>
							<p>Roadside assistance that covers you for less</p>
							<ul class="space-y-2">
								<li
									class="flex space-x-3 items-center"
									v-for="a in 6">
									<svg
										class="flex-shrink-0 size-4 mt-0.5 text-white"
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
									<span>Sample Benefit comes here</span>
								</li>
							</ul>
						</template>
						<template #registrationLink>
							<NuxtLink
								:to="{
									name: 'membership-registration',
									query: {
										registrationType: 'roadside-assistance',
									},
								}"
								class="w-fit p-4 rounded-md inline-flex space-x-2 items-center">
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
</script>
