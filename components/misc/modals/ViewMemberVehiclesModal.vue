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
				<div class="space-y-4 p-4 md:p-5">
					<div class="flex h-fit space-x-3 overflow-x-auto py-2">
						<MemberVehiclesCard
							v-for="a in 5"
							:kay="a" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

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
