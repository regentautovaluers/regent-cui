<template>
	<!-- Main modal -->
	<div
		:id="modalId"
		data-modal-backdrop="static"
		modal-backdrop
		tabindex="-1"
		aria-hidden="true"
		class="fixed top-0 right-0 left-0 z-50 hidden h-[calc(100%-1rem)] max-h-full w-full overflow-x-hidden overflow-y-hidden p-4 md:inset-0"
		ref="customModal">
		<div
			:class="[
				'relative h-full w-full',
				modalSize == 'default' && 'max-w-xl md:h-auto',
				modalSize == 'large' && 'max-w-4xl md:h-auto',
				modalSize == 'xl' && 'max-w-7xl md:h-auto',
			]">
			<!-- Modal content -->
			<div
				:class="[
					'relative flex flex-col rounded-2xl border-2 border-gray-500 bg-white',
					modalSize == 'full-screen' && 'h-full',
				]">
				<!-- Modal header -->
				<div class="mb-2 flex justify-between rounded-t border-b px-4 py-2">
					<div>
						<h2 class="text-sxm font-semibold text-gray-500">{{ modalTitle }}</h2>
						<h3
							class="text-xs text-gray-500"
							v-if="modalSubtitle">
							{{ modalSubtitle }}
						</h3>
					</div>
					<div class="flex items-center space-x-2">
						<!-- an optional action button -->
						<slot name="action-btn"></slot>
						<button
							type="button"
							class="inline-flex rounded-lg bg-transparent p-1.5 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-700"
							:data-modal-toggle="modalId"
							ref="closeModalButton"
							@click="$emit('close-modal')">
							<span
								class="icon-[material-symbols-light--close-rounded] size-6"></span>
							<span class="sr-only">Close modal</span>
						</button>
					</div>
				</div>

				<div
					class="thin-scrollbar overflow-y-auto px-4 py-2"
					id="report-modal-body">
					<!-- Modal body -->
					<slot />
				</div>
			</div>
		</div>
	</div>
	<!-- end of new modal structure -->
</template>

<script setup lang="ts">
	interface Props {
		modalId: string | number;
		modalTitle: string;
		modalSubtitle?: string;
		class?: string;
		modalSize?: 'default' | 'large' | 'xl' | 'full-screen';
	}

	const {
		modalId,
		modalTitle,
		modalSubtitle,
		class: className,
		modalSize = 'default',
	} = defineProps<Props>();
	const emits = defineEmits(['close-modal']);
	const closeButtonModal: Ref<HTMLButtonElement | null> = useTemplateRef('closeModalButton');

	const close = () => {
		if (closeButtonModal.value) {
			closeButtonModal.value.click();
		}
	};
	defineExpose({ close });
</script>
