<template>
	<div
		class="flex max-h-full w-[15rem] min-w-[15rem] flex-col items-center justify-center rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-gray-200 my-2">
		<img
			src="https://ava-media.sfo3.digitaloceanspaces.com/profiles/160e256b-036/2b3c6b07-d1c3-40.jpeg"
			class="size-[9rem] rounded-full shadow-sm"
			alt="Vehicle Image" />
		<h1 class="text-lg font-semibold">John Doe</h1>
		<h1 class="font-medium text-gray-500">Mazda Demio</h1>
		<div class="mt-2 flex w-full justify-center space-x-2">
			<span class="font-semibold text-pink-600">KCF 888Y</span>
			<NuxtLink class="font-medium text-blue-600">View Report</NuxtLink>
		</div>
	</div>
</template>
