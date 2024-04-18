<template>
	<tr class="hover:shadow-lg">
		<td class="px-6 py-4 whitespace-nowrap font-semibold text-pink-600">
			{{ componentProps.regNo }}
		</td>
		<td class="px-6 py-4 whitespace-nowrap text-gray-600 font-semibold">
			{{ componentProps.dateTime }}
		</td>
		<td class="px-6 py-4 whitespace-nowrap text-gray-600 font-semibold">
			{{ componentProps.clientName }}
		</td>
		<td
			class="px-6 py-4 whitespace-nowrap text-center font-semibold text-blue-500">
			{{ componentProps.clientPhone }}
		</td>
		<td
			class="px-6 py-4 whitespace-nowrap text-center font-semibold text-green-500">
			{{ componentProps.serviceType }}
		</td>
		<td
			class="px-6 py-4 whitespace-nowrap text-ellipsis overflow-hidden text-end font-semibold text-pink-500">
			{{ componentProps.location }}
		</td>
		<td>
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
					class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg p-2 mt-2 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full border"
					aria-labelledby="hs-dropdown-default">
					<NuxtLink
						:to="{ name: 'ava-incident-report' }"
						class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
						View Report
					</NuxtLink>
				</div>
			</div>
		</td>
	</tr>
</template>

<script setup lang="ts">
	const componentProps = defineProps<{
		index: number;
		regNo: string;
		dateTime: string;
		clientName: string;
		clientPhone: string;
		serviceType: string;
		location: string;
	}>();
</script>
