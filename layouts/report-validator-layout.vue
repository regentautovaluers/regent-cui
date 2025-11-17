<template>
	<main class="flex h-screen items-center justify-center">
		<div
			class="tablet:w-[50%] laptop-lg:w-[35%] desktop-4k:w-[25%] flex h-fit w-[95%] flex-col items-center space-y-4 rounded-lg border-2 border-gray-300 py-5 shadow-xs">
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
