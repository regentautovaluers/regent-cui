<template>
	<!-- Main modal -->
	<div
		id="view-member-vehicles-modal"
		data-modal-backdrop="static"
		tabindex="-1"
		aria-hidden="true"
		class="fixed left-0 right-0 top-0 z-50 hidden h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0">
		<div class="relative max-h-full w-full max-w-2xl p-4">
			<!-- Modal content -->
			<div class="relative rounded-lg bg-white shadow">
				<!-- Modal header -->
				<div class="flex items-center justify-between rounded-t border-b p-4">
					<h3 class="text-xl font-semibold text-gray-600">Member Vehicles</h3>
					<button
						type="button"
						class="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
						data-modal-hide="view-member-vehicles-modal">
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
				<div class="relative p-3 py-2 md:p-4">
					<div
						class="flex h-fit space-x-3 overflow-x-auto"
						ref="scrollEl">
						<MemberVehiclesCard
							v-for="a in 5"
							:kay="a" />
					</div>

					<!-- left button -->
					<button
						type="button"
						class="group absolute start-0 top-0 z-30 h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
						@click="x -= 352"
						:class="arrivedState.left ? 'hidden' : 'flex'">
						<span
							class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white">
							<svg
								class="h-4 w-4 text-white rtl:rotate-180"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 6 10">
								<path
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 1 1 5l4 4" />
							</svg>
							<span class="sr-only">Scroll Left</span>
						</span>
					</button>

					<!-- right button -->
					<button
						type="button"
						class="group absolute end-0 top-0 z-30 h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
						:class="arrivedState.right ? 'hidden' : 'flex'"
						@click="x += 352">
						<span
							class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white">
							<svg
								class="h-4 w-4 text-white rtl:rotate-180"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 6 10">
								<path
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="m1 9 4-4-4-4" />
							</svg>
							<span class="sr-only">Scroll Right</span>
						</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useScroll } from '@vueuse/core';
	const scrollEl = ref<HTMLElement | null>(null);

	const { x, arrivedState } = useScroll(scrollEl, {
		behavior: 'smooth',
	});
</script>

<style scoped>
	::-webkit-scrollbar-thumb {
		border-radius: 10px;
	}

	/* Hide scrollbar for Chrome, Safari and Opera */
	::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	.no-scrollbar {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>
