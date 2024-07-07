<template>
	<div class="py-5 bg-[#f6f9f2] responsive-view h-full">
		<div class="bg-white w-full p-10 px-2 lg:px-10">
			<div class="flex items-center justify-end py-4">
				<button
					type="button"
					class="py-3 px-4 mt-7 w-full lg:w-1/4 text-lg items-center gap-x-2 font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
					@click="() => (showAddToFleetsForm = !showAddToFleetsForm)">
					{{ showAddToFleetsForm ? "Hide Form" : "Create New Fleet" }}
				</button>
			</div>
			<div v-show="showAddToFleetsForm">
				<h1 class="my-4 text-2xl antialiased font-semibold">
					Add To Your Fleets
				</h1>
				<p class="text-lg text-gray-500">
					Note that each fleet you add will appear as one of your
					corporate options for a bulk membership registration.
				</p>
				<CreateNewFleet />
			</div>
			<div class="flex justify-center py-4">
				<hr
					class="border-gray-300 dark:border-white"
					v-show="showAddToFleetsForm" />
			</div>

			<h1 class="my-4 mt-6 text-2xl antialiased font-semibold">
				Already Added Fleets
			</h1>
			<!-- start of data table -->
			<div class="flex flex-col">
				<div class="-m-1.5 overflow-x-auto">
					<div class="p-1.5 min-w-full inline-block align-middle">
						<div class="border rounded-lg shadow overflow-hidden">
							<table class="min-w-full divide-y">
								<thead>
									<tr>
										<th
											scope="col"
											class="px-6 py-3 text-start font-bold text-gray-500">
											Fleet Name
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-start font-bold text-gray-500">
											Contact Person Name
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-center font-bold text-gray-500">
											Contact Person Email
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-start font-bold text-gray-500">
											Contact Person Phone
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-start font-bold text-gray-500">
											Registered Memberships
										</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-200">
									<ErrorOrMissingData
										v-if="fetchErrorOrEmpty" />
									<FleetRecord
										v-for="(
											fleet, index
										) in corporateFleets"
										:key="index"
										:fleet-name="fleet.fleetname"
										:contact-name="fleet.contact_full_name"
										:contact-email="fleet.contact_email"
										:contact-phone="
											fleet.contact_phone_number
										"
										:registered-members="fleet.memberCount"
										:fleet-id="fleet.id" />
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			<!-- end of data table -->
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: "manage-fleets",
		layout: "in-app-layout",
	});

	const { getPrincipal } = useAuth();
	const { openToast } = useToast();
	const runtimeConfig = useRuntimeConfig();
	const corporateFleets: Ref<Object[] | null> = ref(null);
	const showAddToFleetsForm: Ref<boolean> = ref(false);
	const fetchErrorOrEmpty: Ref<boolean> = ref(false);

	await useFetch(`/api/v1/fleets/corporate/${getPrincipal.value.corpId}`, {
		baseURL: runtimeConfig.public.AVA_BASE_URL,
		method: "GET",
		server: false,
		lazy: false,

		onResponse({ response }) {
			if (response.status !== 200) {
				openToast("Failed to retrieve fleets. Try again!", "danger");
			}

			corporateFleets.value = response._data;
			if (corporateFleets.value && corporateFleets.value?.length > 0) {
				fetchErrorOrEmpty.value = false;
			} else {
				fetchErrorOrEmpty.value = true;
			}
		},
	});
</script>
