<template>
	<div>
		<form class="relative h-fit">
			<input
				type="text"
				class="generic-input"
				placeholder="Search Corporate or Broker Name" />
			<button
				type="submit"
				class="absolute right-0 top-0 flex size-14 items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700">
				<SearchIcon />
			</button>
		</form>
	</div>
</template>

<script setup lang="ts"></script>
