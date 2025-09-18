<template>
	<!-- Main modal -->
	<div
		:id="props.modalId"
		data-modal-backdrop="static"
		tabindex="-1"
		aria-hidden="true"
		class="fixed top-0 right-0 left-0 z-50 hidden h-[calc(100%-1rem)] max-h-full w-full overflow-x-hidden overflow-y-auto p-4 md:inset-0">
		<div
			:class="[
				'relative h-full w-full',
				props.modalSize == 'default' && 'max-w-xl md:h-auto',
				props.modalSize == 'large' && 'max-w-4xl md:h-auto',
				props.modalSize == 'xl' && 'max-w-7xl md:h-auto',
			]">
			<!-- Modal content -->
			<div
				:class="[
					'relative rounded-lg bg-white p-4 shadow sm:p-5',
					props.modalSize == 'full-screen' && 'h-full',
				]">
				<!-- Modal header -->
				<div class="mb-4 flex justify-between rounded-t sm:mb-5">
					<div class="text-lg md:text-xl dark:text-white">
						<h3 class="font-semibold text-gray-900">{{ props.modalTitle }}</h3>
					</div>
					<div>
						<button
							type="button"
							class="inline-flex rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
							:data-modal-toggle="props.modalId"
							@click="emits('close-modal')">
							<svg
								aria-hidden="true"
								class="h-5 w-5"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg">
								<path
									fill-rule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clip-rule="evenodd"></path>
							</svg>
							<span class="sr-only">Close modal</span>
						</button>
					</div>
				</div>

				<!-- Modal body -->
				<slot />
			</div>
		</div>
	</div>
	<!-- end of new modal structure -->
</template>

<script setup lang="ts">
	const props = defineProps({
		modalId: { required: true, type: String || Number },
		modalTitle: { required: true, type: String },
		class: { required: false, type: String },
		modalSize: {
			required: false,
			default: 'default',
			validator: (value: string) => ['default', 'large', 'xl', 'full-screen'].includes(value),
		},
	});
	const emits = defineEmits(['close-modal']);
</script>
