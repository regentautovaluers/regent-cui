<template>
	<!-- Main modal -->
	<div
		:id="props.modalId"
		tabindex="-1"
		:data-modal-placement="props.modalPlacement"
		class="fixed top-0 right-0 left-0 z-50 hidden h-[100%] max-h-full w-full overflow-x-hidden overflow-y-auto bg-white/10 p-4 md:inset-0">
		<div class="relative max-h-full w-full max-w-2xl">
			<!-- Modal content -->
			<div class="relative rounded-xl bg-white shadow-sm">
				<!-- Modal header -->
				<div class="flex items-center justify-between rounded-t-xl bg-blue-50/50 px-5 py-3">
					<h3 class="font-semibold text-gray-500">{{ props.modalTitle }}</h3>
					<button
						type="button"
						class="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
						:data-modal-hide="props.modalId"
						@click="emits('close-modal')">
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
				<div
					class="p-4 md:p-5"
					:class="props.class">
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
		class: { required: false, type: String },
		modalPlacement: {
			required: false,
			default: 'top-center',
		},
	});
	const emits = defineEmits(['close-modal']);
</script>
