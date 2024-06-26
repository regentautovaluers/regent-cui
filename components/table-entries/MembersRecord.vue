<template>
	<tr class="hover:shadow-lg">
		<td class="px-6 py-6 whitespace-nowrap font-semibold text-gray-600">
			{{ componentProps.clientName }}
		</td>
		<td class="px-6 py-6 whitespace-nowrap text-blue-600 font-semibold">
			{{
				`${capitalizeFirstLetter(
					componentProps.membershipCategory
				)} Member`
			}}
		</td>
		<td
			class="px-6 py-6 whitespace-nowrap text-center font-semibold text-pink-500">
			<NuxtLink
				:to="{
					name: 'membership-details',
					query: {
						id: componentProps.memberId,
					},
				}"
				>{{ componentProps.vehicleCount }}</NuxtLink
			>
		</td>
		<td
			class="px-6 py-6 whitespace-nowrap text-end font-semibold text-gray-600">
			{{
				!componentProps.clientPhone
					? "Phone Number Not Provided"
					: `+${componentProps.clientPhone}`
			}}
		</td>
		<td
			class="px-6 py-6 whitespace-nowrap text-end font-semibold text-gray-600">
			{{
				!componentProps.clientEmail
					? "Email Not Provided"
					: componentProps.clientEmail
			}}
		</td>
		<td class="text-center">
			<div
				class="relative inline-block text-left"
				ref="dropdownContainer">
				<button @click="toggleDropdown">
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
					v-if="isDropdownVisible"
					@click.stop
					class="custom-dropdown">
					<div
						class="py-1"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="options-menu">
						<NuxtLink
							v-if="
								getPrincipal.userlevel === 'admin' ||
								getPrincipal.userlevel === 'broker'
							"
							:to="{
								name: 'edit-member-details',
								query: {
									memberName: componentProps.clientName,
									memberPhone: componentProps.clientPhone,
									memberEmail: componentProps.clientEmail,
									memberId: componentProps.memberId,
								},
							}"
							class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
							Edit Details
						</NuxtLink>
						<NuxtLink
							:to="{
								name: 'membership-details',
								query: {
									id: componentProps.memberId,
								},
							}"
							class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
							View Vehicles
						</NuxtLink>
					</div>
				</div>
			</div>
		</td>
	</tr>
</template>

<script setup lang="ts">
	const componentProps = defineProps<{
		clientName: string;
		membershipCategory: string;
		vehicleCount: string | number;
		memberId: string | number;
		clientPhone: string;
		clientEmail: string | null;
	}>();
	const { capitalizeFirstLetter } = useUtils();
	const { getPrincipal } = useAuth();
	const isDropdownVisible = ref(false);
	const dropdownContainer = ref(null);

	function toggleDropdown() {
		isDropdownVisible.value = !isDropdownVisible.value;
	}

	function closeDropdown() {
		isDropdownVisible.value = false;
	}

	function handleClickOutside(event: MouseEvent) {
		if (!event.target) return;
		// Check if the click is outside the dropdown container
		if (!dropdownContainer.value.contains(event.target as Node)) {
			closeDropdown();
		}
	}

	onMounted(() => {
		document.addEventListener("click", handleClickOutside);
	});

	onBeforeUnmount(() => {
		document.removeEventListener("click", handleClickOutside);
	});
</script>
