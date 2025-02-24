<template>
	<form
		@submit.prevent
		class="w-full">
		<div class="flex items-center space-x-3">
			<input
				type="text"
				placeholder="Say hi or hello or konichiwa..."
				class="w-3/4 rounded-full border-[1px] border-gray-600 px-5 py-4 text-gray-500 outline-none ring-1 ring-gray-600 transition-all duration-200 ease-in-out focus:border-gray-700 focus:ring-2 focus:ring-gray-700" />
			<button
				type="submit"
				disabled
				class="generic-form-submit mb-0 w-1/4 rounded-full shadow-md disabled:bg-blue-600">
				Send Request
			</button>
		</div>
	</form>
</template>
