<template>
	<form @submit.prevent>
		<div class="flex items-center space-x-3">
			<input
				type="text"
				placeholder="Ask me anything..."
				class="w-3/4 rounded-full border-[1px] border-gray-600 px-5 py-4 text-gray-500 outline-none ring-1 ring-gray-600 transition-all duration-200 ease-in-out focus:border-gray-700 focus:ring-2 focus:ring-gray-700" />
			<button
				type="submit"
				disabled
				class="generic-form-submit mb-0 w-1/4 rounded-full shadow-md disabled:bg-blue-600">
				Send Request
			</button>
		</div>

		<!-- common questions section -->
		<div>
			<h1 class="my-10 text-center text-lg uppercase text-gray-500">Common Questions Are:</h1>
			<div class="space-y-4">
				<div class="grid grid-cols-2 space-x-4">
					<button
						class="ai-trigger-btns"
						disabled>
						I want to see all my valuation reports</button
					><button
						class="ai-trigger-btns"
						disabled>
						I'd like to view my ongoing service requests
					</button>
				</div>
				<div class="grid grid-cols-2 space-x-4">
					<button
						class="ai-trigger-btns"
						disabled>
						I want to request for a vehicle valuation</button
					><button
						class="ai-trigger-btns"
						disabled>
						I need all accident reports from my account
					</button>
				</div>
			</div>
		</div>
	</form>
</template>
