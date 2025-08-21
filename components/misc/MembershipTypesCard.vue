<template>
	<div
		class="group laptop:flex-row laptop:space-x-3 flex flex-col rounded-lg border-2 border-blue-600 bg-white px-5 py-10 transition-colors duration-150 ease-linear hover:bg-blue-600">
		<slot name="membershipType"></slot>
		<div class="flex flex-grow flex-col pr-3 text-left">
			<div class="h-3/4">
				<slot name="benefitsAndPricing"></slot>
			</div>
			<div class="flex-grow place-content-end">
				<slot name="registrationLink"></slot>
			</div>
		</div>
	</div>
</template>
