<template>
	<div class="w-[35rem] bg-blue-600 flex h-fit rounded-sm py-10 text-lg">
		<slot name="membershipType" />
		<div class="flex-grow text-left pr-1">
			<slot name="benefitsAndPricing" />
			<slot name="registrationLink" />
		</div>
	</div>
</template>

<script setup lang="ts"></script>
