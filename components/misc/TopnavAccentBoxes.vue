<template>
	<div
		class="w-14 relative rounded-3xl h-14 bg-gray-300 flex justify-center items-center">
		<slot name="iconSlot" />
		<span
			class="inline-flex items-center py-1.5 px-2 absolute -top-2 -right-3 rounded-full text-xs font-medium bg-pink-600 text-white"
			><slot name="countSlot"
		/></span>
	</div>
</template>
