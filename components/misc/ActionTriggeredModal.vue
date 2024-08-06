<template>
	<button
		v-if="props.triggerButtonIndex === 0"
		type="button"
		class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
		data-hs-overlay="#hs-basic-modal">
		{{ props.triggerButtonText }}
	</button>
	<button
		data-hs-overlay="#hs-basic-modal"
		v-else-if="props.triggerButtonIndex === 1"
		type="button"
		class="text-start text-sm text-blue-600 font-semibold underline tracking-wide">
		{{ props.triggerButtonText }}
	</button>
	<div
		id="hs-basic-modal"
		class="hs-overlay [--overlay-backdrop:static] hs-overlay-open:opacity-100 hs-overlay-open:duration-500 hidden size-full fixed top-0 start-0 z-[80] opacity-0 overflow-x-hidden transition-all overflow-y-auto pointer-events-none">
		<div
			class="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 opacity-0 transition-all md:max-w-2xl md:w-full m-3 md:mx-auto">
			<div class="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto">
				<div class="flex justify-between items-center py-3 px-4 border-b">
					<h3 class="font-bold text-gray-800">{{ props.modalTitle }}</h3>
					<button
						type="button"
						class="flex justify-center items-center size-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100"
						data-hs-overlay="#hs-basic-modal">
						<span class="sr-only">Close</span>
						<svg
							class="flex-shrink-0 size-4"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round">
							<path d="M18 6 6 18" />
							<path d="m6 6 12 12" />
						</svg>
					</button>
				</div>
				<div class="py-3 px-4">
					<slot name="activeElement" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const props = defineProps<{
		triggerButtonIndex: number;
		triggerButtonText: string;
		modalTitle: string;
	}>();
</script>
