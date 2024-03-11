<template>
	<div class="py-10 h-fit responsive-view">
		<h1 class="my-5 text-2xl antialiased font-semibold">
			Emergency Rescue Members
		</h1>
		<!-- start of data table -->
		<div class="flex flex-col">
			<div class="-m-1.5 overflow-x-auto">
				<div class="p-1.5 min-w-full inline-block align-middle">
					<div class="border rounded-sm shadow overflow-hidden">
						<table class="min-w-full divide-y">
							<thead>
								<tr>
									<th
										scope="col"
										class="px-6 py-3 text-start font-bold text-gray-500">
										Client Name
									</th>
									<th
										scope="col"
										class="px-6 py-3 text-start font-bold text-gray-500">
										Start Date
									</th>
									<th
										scope="col"
										class="px-6 py-3 text-start font-bold text-gray-500">
										End Date
									</th>
									<th
										scope="col"
										class="px-6 py-3 text-start font-bold text-gray-500">
										Type
									</th>
									<th
										scope="col"
										class="px-6 py-3 text-center font-bold text-gray-500">
										Vehicles
									</th>
									<th
										scope="col"
										class="px-6 py-3 text-start font-bold text-gray-500">
										Contacts
									</th>
									<th
										scope="col"
										class="px-6 py-3 text-end" />
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200">
								<MembersRecord v-for="a in 10" />
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
		<!-- end of data table -->
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: "emergency-members",
		layout: "in-app-layout",
	});
</script>
