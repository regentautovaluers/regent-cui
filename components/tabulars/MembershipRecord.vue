<template>
	<tr class="hover:shadow-lg">
		<td class="px-6 py-6 whitespace-nowrap font-semibold text-pink-600">
			{{ componentProps.vehicleRegistration }}
		</td>
		<td class="px-6 py-6 whitespace-nowrap text-gray-600 font-semibold">
			{{ componentProps.startDate }}
		</td>
		<td class="px-6 py-6 whitespace-nowrap text-gray-600 font-semibold">
			{{ componentProps.endDate }}
		</td>
		<td
			class="px-6 py-6 whitespace-nowrap text-center font-semibold text-blue-500">
			{{ componentProps.vehicleMake }}
		</td>
		<td
			class="px-6 py-6 whitespace-nowrap text-center font-semibold text-blue-500">
			{{ componentProps.vehicleModel }}
		</td>
		<td
			class="px-6 py-6 whitespace-nowrap text-center font-semibold text-blue-500">
			{{ componentProps.membershipName }}
		</td>
		<td
			class="px-6 py-6 whitespace-nowrap text-center font-semibold text-green-500">
			{{ componentProps.membershipStatus }}
		</td>
		<td
			class="px-6 py-6 whitespace-nowrap text-center font-semibold text-pink-500">
			{{ componentProps.paymentStatus }}
		</td>
		<td
			class="text-center"
			v-if="
				getDetails.userlevel === 'admin' ||
				getDetails.userlevel === 'broker'
			">
			<div class="hs-dropdown relative inline-flex [--placement:left]">
				<button
					id="hs-dropdown-default"
					type="button"
					class="hs-dropdown-toggle">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1.8em"
						height="1.8em"
						viewBox="0 0 24 24">
						<path
							fill="currentColor"
							fill-rule="evenodd"
							d="M10.5 5A1.5 1.5 0 0 1 12 3.5h.01a1.5 1.5 0 0 1 1.5 1.5v.01a1.5 1.5 0 0 1-1.5 1.5H12a1.5 1.5 0 0 1-1.5-1.5zm0 7a1.5 1.5 0 0 1 1.5-1.5h.01a1.5 1.5 0 0 1 1.5 1.5v.01a1.5 1.5 0 0 1-1.5 1.5H12a1.5 1.5 0 0 1-1.5-1.5zm1.5 5.5a1.5 1.5 0 0 0-1.5 1.5v.01a1.5 1.5 0 0 0 1.5 1.5h.01a1.5 1.5 0 0 0 1.5-1.5V19a1.5 1.5 0 0 0-1.5-1.5z"
							clip-rule="evenodd" />
					</svg>
				</button>

				<div
					class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg p-2 mt-2 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full border z-20 space-y-1"
					aria-labelledby="hs-dropdown-default">
					<NuxtLink
						v-if="
							getDetails.userlevel === 'admin' ||
							getDetails.userlevel === 'broker'
						"
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
								clientName: clientName,
							},
						}"
						class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
						Edit Vehicle
					</NuxtLink>
					<button
						class="w-full flex justify-between items-center gap-x-3.5 py-2 px-3 rounded-lg bg-red-500 hover:bg-red-600 focus:outline-none text-white"
						@click="deleteMembershipRecord(membershipId)">
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
	const deleteMembershipLoading: Ref<boolean> = ref(false);
	const componentProps = defineProps<{
		membershipId: number | any;
		vehicleRegistration: string;
		startDate: string;
		endDate: string;
		vehicleMake: string;
		vehicleModel: string;
		membershipName: string;
		membershipStatus: string;
		paymentStatus: string;
		clientName: string;
	}>();
	const runtimeConfig = useRuntimeConfig();
	const router = useRouter();
	const { openToast } = useToast();
	const emit = defineEmits(["provideClientDetails"]);
	const { getDetails } = usePrincipal();

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
							"Member details deleted successfully.",
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
