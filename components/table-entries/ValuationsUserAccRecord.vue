<template>
	<tr class="hover:shadow-lg">
		<td class="whitespace-nowrap px-6 py-4 font-semibold text-pink-600">
			{{ props.username }}
		</td>
		<td
			class="inline-flex flex-col space-y-1 whitespace-nowrap px-6 py-4 text-xs text-gray-800">
			<span class="rounded-full bg-gray-200 px-2 font-semibold text-gray-500">{{
				props.userEmail === null ? 'Email N/A' : props.userEmail
			}}</span>
			<span class="w-fit rounded-full bg-gray-200 px-2 font-semibold text-gray-500">{{
				props.phoneNumber === null ? 'Phone N/A' : props.phoneNumber
			}}</span>
		</td>
		<td class="whitespace-nowrap px-6 py-4 font-semibold text-gray-600">
			{{ determinePrivilege() }}
		</td>
		<td class="whitespace-nowrap px-6 py-4 font-semibold text-gray-600">
			{{ props.corporateRole }}
		</td>
		<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
			<span class="inline-flex items-center space-x-1">
				<div
					class="size-3 rounded-full"
					:class="props.isActive === true ? 'bg-green-500' : 'bg-red-600'" />
				<span>{{ props.isActive === true ? 'Active' : 'Inactive' }}</span>
			</span>
		</td>
		<td>
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
					class="custom-dropdown -top-[80%]">
					<div
						class="space-y-1 py-1"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="options-menu">
						<NuxtLink
							:to="{
								name: 'valuation-update-user-details',
								query: {
									userId: props.userId,
								},
							}"
							class="flex items-center gap-x-3.5 rounded-lg px-3 py-2 text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none">
							Update Details
						</NuxtLink>
					</div>
				</div>
			</div>
		</td>
	</tr>
</template>

<script setup lang="ts">
	const props = defineProps<{
		userId: string;
		corpId: string;
		username: string;
		userEmail: string;
		phoneNumber: string;
		privilege: string[];
		corporateRole: string;
		isActive: boolean;
	}>();

	const isDropdownVisible = ref(false);
	const dropdownContainer = ref(null);

	const determinePrivilege = (): string => {
		let privilege = '';

		if (props.privilege.includes('ROLE_CORP_ADMIN')) {
			privilege = 'Admin User';
		} else if (props.privilege.includes('ROLE_CORP_NORM')) {
			privilege = 'Normal User';
		}

		return privilege;
	};

	function toggleDropdown() {
		isDropdownVisible.value = !isDropdownVisible.value;
	}

	function closeDropdown() {
		isDropdownVisible.value = false;
	}
</script>
