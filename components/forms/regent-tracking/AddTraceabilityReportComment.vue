<template>
	<div class="space-y-8">
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
				<h3 class="text-sm font-semibold text-gray-700">KCA 123A</h3>
			</div>
			<div class="flex h-12 items-center space-x-3">
				<h2 class="inline-flex items-center space-x-1">
					<span
						class="icon-[material-symbols-light--settings-phone] text-xl text-gray-700"></span>
					<span class="text-sm text-gray-500">Phone</span>
				</h2>
				<span class="text-gray-400">&VerticalBar;</span>
				<h3 class="text-sm font-semibold text-gray-700">0723892617</h3>
			</div>
			<div class="flex h-12 items-center space-x-3">
				<h2 class="inline-flex items-center space-x-1">
					<span
						class="icon-[material-symbols-light--person] text-xl text-gray-700"></span>
					<span class="text-sm text-gray-500">Client Name</span>
				</h2>
				<span class="text-gray-400">&VerticalBar;</span>
				<h3 class="text-sm font-semibold text-gray-700">John Doe</h3>
			</div>
			<div class="flex h-12 items-center space-x-3">
				<h2 class="inline-flex items-center space-x-1">
					<span
						class="icon-[material-symbols-light--android-wifi-4-bar-question] text-xl text-gray-700"></span>
					<span class="text-sm text-gray-500">Status</span>
				</h2>
				<span class="text-gray-400">&VerticalBar;</span>
				<h3 class="text-sm font-semibold text-gray-700">offline</h3>
			</div>
		</div>

		<!-- comment -->
		<div
			class="borer-blue-200 min-h-32 space-y-2 rounded-lg border bg-blue-100 p-4 outline-none">
			<div
				v-for="a in 3"
				:key="a"
				class="flex items-start space-x-3">
				<div class="flex items-center space-x-1">
					<span
						class="icon-[material-symbols-light--person] text-2xl text-gray-700"></span>
					<h3 class="text-sm font-semibold whitespace-nowrap text-gray-700">
						Bank Officer
					</h3>
				</div>
				<span class="text-gray-700">&VerticalBar;</span>
				<p class="text-sm text-gray-600">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam eum unde fugiat
					consequuntur molestias accusantium molestiae vitae reprehenderit ipsa porro,
					ipsam corporis, culpa tempore quia totam neque! Eligendi, quia ducimus.
				</p>
			</div>
		</div>

		<!-- comment form -->
		<form>
			<div class="my-5">
				<label
					for="comments-box"
					class="generic-input-label"
					>Comments</label
				>
				<textarea
					id="comments-box"
					class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm text-gray-600 focus:border-blue-500 focus:ring-blue-500"
					rows="8"
					placeholder="What would you like to say about this issue?"></textarea>
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

<script setup lang="ts"></script>
