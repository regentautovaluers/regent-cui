<template>
	<button
		v-if="props.triggerButtonIndex === 0"
		type="button"
		class="inline-flex items-center gap-x-2 rounded-md border border-transparent bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
		data-hs-overlay="#hs-basic-modal">
		{{ props.triggerButtonText }}
	</button>
	<button
		data-hs-overlay="#hs-basic-modal"
		v-else-if="props.triggerButtonIndex === 1"
		type="button"
		class="text-start text-sm font-semibold tracking-wide text-blue-600 underline">
		{{ props.triggerButtonText }}
	</button>
	<div
		id="hs-basic-modal"
		class="hs-overlay pointer-events-none fixed start-0 top-0 z-[80] hidden size-full overflow-y-auto overflow-x-hidden opacity-0 transition-all [--overlay-backdrop:static] hs-overlay-open:opacity-100 hs-overlay-open:duration-500">
		<div
			class="m-3 opacity-0 transition-all hs-overlay-open:opacity-100 hs-overlay-open:duration-500 md:mx-auto md:w-full md:max-w-2xl">
			<div class="pointer-events-auto flex flex-col rounded-xl border bg-white shadow-sm">
				<div class="flex items-center justify-between border-b px-4 py-3">
					<h3 class="font-bold text-gray-800">{{ props.modalTitle }}</h3>
					<button
						type="button"
						class="flex size-7 items-center justify-center rounded-full border border-transparent text-sm font-semibold text-gray-800 hover:bg-gray-100"
						data-hs-overlay="#hs-basic-modal">
						<span class="sr-only">Close</span>
						<svg
							class="size-4 flex-shrink-0"
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
				<div class="px-4 py-3">
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
