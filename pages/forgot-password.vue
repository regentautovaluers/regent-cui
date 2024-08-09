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
			alert-heading="Authorization Warning"
			warning-message="Please contact your administrator to effect the change in a safe way.">
			<template #alertMessage>
				<p class="text-center">
					Attempting to change your password while you're not logged in is not permitted.
				</p>
			</template>
			<template #actionControls>
				<button
					class="rounded-full border border-transparent bg-blue-600 px-2 py-2 text-center font-semibold text-white hover:bg-blue-700">
					Hello World
				</button>
				<button
					class="rounded-full border border-transparent bg-blue-600 px-2 py-2 text-center font-semibold text-white hover:bg-blue-700">
					Hello World
				</button>
			</template>
		</RequiredActionAlert>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'forgot-password',
		layout: 'auth-pages-layout',
	});
</script>
