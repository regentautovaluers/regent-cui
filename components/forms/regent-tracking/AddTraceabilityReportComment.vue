<template>
	<div class="space-y-5">
		<!-- preliminary info -->
		<div class="grid h-fit grid-cols-2 gap-2 rounded-lg bg-gray-200/80 p-4 outline-none">
			<div class="col-span-2">
				<h1 class="font-bold text-gray-700">Vehicle Information</h1>
			</div>
			<div class="flex h-12 items-center space-x-3">
				<h2 class="inline-flex items-center space-x-1">
					<span
						class="icon-[material-symbols-light--barcode-scanner] text-xl text-gray-700"></span>
					<span class="text-sm text-gray-500">Registration</span>
				</h2>
				<span class="text-gray-400">&VerticalBar;</span>
				<h3 class="text-sm font-semibold text-gray-700">{{ props.regNo }}</h3>
			</div>
			<div class="flex h-12 items-center space-x-3">
				<h2 class="inline-flex items-center space-x-1">
					<span
						class="icon-[material-symbols-light--settings-phone] text-xl text-gray-700"></span>
					<span class="text-sm text-gray-500">Phone</span>
				</h2>
				<span class="text-gray-400">&VerticalBar;</span>
				<h3 class="text-sm font-semibold text-gray-700">{{ props.clientPhone }}</h3>
			</div>
			<div class="flex h-12 items-center space-x-3">
				<h2 class="inline-flex items-center space-x-1">
					<span
						class="icon-[material-symbols-light--person] text-xl text-gray-700"></span>
					<span class="text-sm text-gray-500">Client Name</span>
				</h2>
				<span class="text-gray-400">&VerticalBar;</span>
				<h3 class="text-sm font-semibold text-gray-700">{{ clientName }}</h3>
			</div>
			<div class="flex h-12 items-center space-x-3">
				<h2 class="inline-flex items-center space-x-1">
					<span
						class="icon-[material-symbols-light--android-wifi-4-bar-question] text-xl text-gray-700"></span>
					<span class="text-sm text-gray-500">Status</span>
				</h2>
				<span class="text-gray-400">&VerticalBar;</span>
				<h3 class="text-sm font-semibold text-gray-700">{{ props.deviceStatus }}</h3>
			</div>
		</div>

		<h1 class="font-bold text-gray-700">Request Information</h1>
		<!-- comment -->
		<div
			class="borer-blue-200 min-h-32 space-y-2 rounded-lg border bg-blue-100 p-4 outline-none">
			<div
				v-if="props.comments && props.comments?.length > 0"
				v-for="(c, idx) in props.comments"
				:key="idx"
				class="flex items-start space-x-3">
				<div class="flex items-center space-x-1">
					<span
						class="icon-[material-symbols-light--person] text-2xl text-gray-700"></span>
					<h3 class="text-sm font-semibold whitespace-nowrap text-gray-700">
						{{ c.username }}
					</h3>
				</div>
				<span class="text-gray-700">&VerticalBar;</span>
				<p class="text-sm text-gray-600">
					{{ c.comment }}
				</p>
			</div>
			<p
				v-else
				class="text-xs text-gray-500">
				No previous comments for this device!
			</p>
		</div>

		<!-- comment form -->
		<form @submit.prevent="addNewComment(props.id)">
			<div class="my-5">
				<label
					for="comments-box"
					class="generic-input-label"
					>Your Comment</label
				>
				<textarea
					id="comments-box"
					class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm text-gray-600 focus:border-blue-500 focus:ring-blue-500"
					rows="8"
					placeholder="What would you like to say about this device?"
					v-model="newComment"
					required></textarea>
			</div>
			<div class="flex justify-end">
				<!-- submit button -->
				<button
					type="submit"
					:class="['generic-form-submit mt-3 w-1/3', ,]">
					Save Comment
				</button>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
	import { type Comments } from '~/types/regent-tracking/trace-report';

	const props = defineProps<{
		id: number;
		regNo: String;
		clientPhone: String;
		clientName: String;
		deviceStatus: String;
		comments?: Comments[];
	}>();

	const { newComment, addNewComment } = useTraceabilityReportComments();
</script>
