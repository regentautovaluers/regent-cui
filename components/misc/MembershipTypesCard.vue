<template>
	<div
		class="w-[35rem] bg-white border-2 border-blue-500 flex h-[29rem] py-10 transition-colors duration-300 ease-linear hover:bg-blue-600 hover:border-none hover:border-blue-700 rounded-lg text-lg group">
		<slot name="membershipType" />
		<div class="flex-grow text-left pr-3">
			<slot name="benefitsAndPricing" />
			<slot name="registrationLink" />
		</div>
	</div>
</template>
