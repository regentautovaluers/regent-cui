<template>
	<div>
		<img
			src="/images/regent-autovaluers-logo.svg"
			alt="Regent Logo"
			class="h-36" />
	</div>
	<div class="h-full w-full">
		<RequiredActionAlert
			alert-type="success"
			width="w-[80%]"
			alert-heading="Operation Blocked">
			<template #alertMessage>
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Est
					excepturi numquam porro eveniet pariatur expedita eaque odit
					vero obcaecati, similique ducimus deserunt corporis ipsum et
					ad dolores nobis sit impedit!
				</p>
			</template>
			<template #actionControls>
				<button
					class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
					Hello World
				</button>
			</template>
		</RequiredActionAlert>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: "forgot-password",
		layout: "auth-pages-layout",
	});
</script>
