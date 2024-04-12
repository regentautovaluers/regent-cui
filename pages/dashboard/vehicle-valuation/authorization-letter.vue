<template>
	<div class="py-10 bg-[#f6f9f2] responsive-view h-fit">
		<div class="bg-white w-full p-10 px-2 lg:px-10">
			<div
				class="flex flex-col lg:flex-row space-y-3 lg:space-y-0 items-center justify-between">
				<div
					class="text-sm md:text-base lg:text-lg border-b-1 space-x-4 w- lg:w-fit">
					<button
						@click="() => (currentView = 0)"
						:class="[
							'border-b-2 pb-1',
							currentView === 0
								? 'border-b-blue-600 text-blue-600'
								: 'border-b-inherit',
						]">
						<span>Create Authorization Letter</span>
					</button>
					<button
						@click="() => (currentView = 1)"
						:class="[
							'border-b-2 pb-1',
							currentView === 1
								? 'border-b-blue-600 text-blue-600'
								: 'border-b-inherit',
						]">
						<span>View Authorization Letters</span>
					</button>
				</div>
			</div>
			<div class="mt-16">
				<CreateAuthorizationLetter v-if="currentView === 0" />
				<!-- start of data table -->
				<div
					v-else-if="currentView === 1"
					class="flex flex-col">
					<div class="-m-1.5 overflow-x-auto">
						<div class="p-1.5 min-w-full inline-block align-middle">
							<div
								class="border rounded-lg shadow overflow-hidden">
								<table class="min-w-full divide-y">
									<thead>
										<tr>
											<th
												scope="col"
												class="px-6 py-3 text-start font-bold text-gray-500">
												Broker
											</th>
											<th
												scope="col"
												class="px-6 py-3 text-start font-bold text-gray-500">
												Customer
											</th>
											<th
												scope="col"
												class="px-6 py-3 text-center font-bold text-gray-500">
												Policy No.
											</th>
											<th
												scope="col"
												class="px-6 py-3 text-end font-bold text-gray-500">
												Registration No.
											</th>
											<th
												scope="col"
												class="px-6 py-3 text-end font-bold text-gray-500">
												Authorized By
											</th>
											<th
												scope="col"
												class="px-6 py-3 text-end font-bold text-gray-500">
												Date
											</th>
											<th
												scope="col"
												class="px-6 py-3 text-end font-bold text-gray-500">
												Authorization Ref No.
											</th>
											<th
												scope="col"
												class="px-6 py-3 text-end font-bold text-gray-500">
												Phone No.
											</th>
											<th
												scope="col"
												class="px-6 py-3 text-end font-bold text-gray-500">
												Regent Branch
											</th>
											<th
												scope="col"
												class="px-6 py-3 text-end" />
										</tr>
									</thead>
									<tbody
										class="divide-y divide-gray-200"></tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<h1 class="text-3xl font-bold mt-7 lg:mx-10">Explore More Services</h1>
		<div
			class="w-full flex justify-between space-x-4 lg:space-x-0 lg:px-10 whitespace-nowrap overflow-x-auto overflow-y-hidden"
			style="
				::-webkit-scrollbar-thumb {
					border-radius: 10px;
				}

				/* Hide scrollbar for Chrome, Safari and Opera */
				::-webkit-scrollbar {
					display: none;
				}

				/* Hide scrollbar for IE, Edge and Firefox */
				.no-scrollbar {
					-ms-overflow-style: none; /* IE and Edge */
					scrollbar-width: none; /* Firefox */
				}
			">
			<NuxtLink
				v-for="(service, index) in moreServicesData"
				class="flex flex-col whitespace-normal p-6 rounded-2xl hover:shadow-lg hover:bg-white h-64 w-72 min-w-72 max-w-72 transition-transform hover:scale-105"
				:key="index"
				:to="{ name: service.pageName }"
				><img
					:src="service.icon"
					alt="Service Icon Link"
					class="w-16" />
				<h1 class="text-2xl font-bold mt-3">
					{{ service.title }}
				</h1>
				<p class="text-lg">{{ service.description }}</p></NuxtLink
			>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: "valuation-authorization-letter",
		layout: "in-app-layout",
	});

	type moreServices = {
		icon: string;
		title: string;
		description: string;
		pageName: string;
	};

	const currentView: Ref<number> = ref(0);
	const moreServicesData: moreServices[] = [
		{
			icon: "/icons/sidenav/roadside-ass-icon.svg",
			title: "Roadside Assistance",
			description: "Prompt roadside support for your clients",
			pageName: "ava-home",
		},
		{
			icon: "/icons/sidenav/acc-management-icon.svg",
			title: "Accident Management",
			description: "Simplify accident claims for your clients",
			pageName: "",
		},
		{
			icon: "/icons/sidenav/emergency-services-icon.svg",
			title: "Emergency Evacuation",
			description:
				"Ensure your clients' safety with swift evacuation services",
			pageName: "",
		},
		{
			icon: "/icons/sidenav/garage-icon.svg",
			title: "Garage Services",
			description:
				"Comperehensive auto care solutions at our trusted garages",
			pageName: "",
		},
		{
			icon: "/icons/sidenav/support-icon.svg",
			title: "Platform Support",
			description:
				"Need something? Ask us for it through our support page",
			pageName: "dashboard-support",
		},
	];
</script>
