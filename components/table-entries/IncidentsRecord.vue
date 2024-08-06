<template>
	<tr class="hover:shadow-lg">
		<td class="px-6 py-6 whitespace-nowrap font-semibold text-pink-600">
			{{ props.regNo }}
		</td>
		<td class="px-6 py-6 whitespace-nowrap text-gray-600 font-semibold">
			{{ props.dateTime }}
		</td>
		<td class="px-6 py-6 whitespace-nowrap text-gray-600 font-semibold">
			{{ props.clientName }}
		</td>
		<td class="px-6 py-6 whitespace-nowrap text-center font-semibold text-blue-500">
			{{ props.clientPhone }}
		</td>
		<td class="px-6 py-6 whitespace-nowrap text-center font-semibold text-green-500">
			{{ props.serviceType }}
		</td>
		<td
			class="px-6 py-6 whitespace-nowrap text-ellipsis overflow-hidden text-end font-semibold text-pink-500">
			{{ props.location }}
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
						class="py-1"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="options-menu">
						<NuxtLink
							:to="{
								name: 'roadside-assistance-reports',
								params: {
									service_type: props.serviceType.toLowerCase(),
									id: props.requestId,
								},
							}"
							class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
							View Report
						</NuxtLink>
					</div>
				</div>
			</div>
		</td>
	</tr>
</template>

<script setup lang="ts">
	const props = defineProps<{
		index: number;
		requestId: number;
		regNo: string;
		dateTime: string;
		clientName: string;
		clientPhone: string;
		serviceType: string;
		location: string;
	}>();
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
		document.addEventListener('click', handleClickOutside);
	});

	onBeforeUnmount(() => {
		document.removeEventListener('click', handleClickOutside);
	});
</script>
