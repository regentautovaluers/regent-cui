<template>
	<main class="flex h-screen items-center justify-center">
		<div
			class="flex h-[30rem] w-[95%] flex-col items-center space-y-4 rounded-lg border-[.5px] border-gray-300 py-5 shadow-sm md:w-[25%]">
			<img
				src="/images/app-logo.png"
				class="h-14"
				alt="Regent Logo" />
			<div class="w-full flex-grow">
				<slot />
			</div>
		</div>
	</main>
</template>
