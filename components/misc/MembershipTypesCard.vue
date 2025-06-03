<template>
	<div
		class="group flex h-108 w-140 rounded-lg border-2 border-blue-500 bg-white py-10 text-lg transition-colors duration-300 ease-linear hover:border-none hover:border-blue-700 hover:bg-blue-600">
		<slot name="membershipType" />
		<div class="flex-grow pr-3 text-left">
			<slot name="benefitsAndPricing" />
			<slot name="registrationLink" />
		</div>
	</div>
</template>
