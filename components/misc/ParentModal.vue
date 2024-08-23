<template>
	<!-- Main modal -->
	<div
		class="fixed left-0 right-0 top-0 z-50 flex h-screen max-h-screen w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900/80">
		<div class="relative max-h-full w-full max-w-2xl p-4">
			<!-- Modal content -->
			<div class="relative rounded-lg bg-white shadow">
				<!-- Modal header -->
				<div class="flex items-center justify-between rounded-t border-b p-4">
					<h3 class="text-xl font-semibold text-gray-500">{{ props.modalTitle }}</h3>
					<button
						type="button"
						class="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
						@click.prevent="emits('close-modal')">
						<svg
							class="h-3 w-3"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 14 14">
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
						</svg>
						<span class="sr-only">Close modal</span>
					</button>
				</div>
				<!-- Modal body -->
				<div class="p-4 md:p-5">
					<slot />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const props = defineProps({
		modalId: { required: true, type: String || Number },
		modalTitle: { required: true, type: String },
	});
	const emits = defineEmits(['close-modal']);
</script>
