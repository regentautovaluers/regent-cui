<template>
	<form
		class="flex h-full flex-col"
		@submit.prevent="requestAnswer()">
		<!-- header -->
		<div class="flex h-fit items-center justify-between border-b p-3">
			<div>
				<button
					class="ai-chat-button w-fit cursor-auto px-2"
					type="button"
					disabled>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						class="text-slate-100">
						<g fill="none">
							<path
								d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path>
							<path
								fill="currentColor"
								d="M9.107 5.448c.598-1.75 3.016-1.803 3.725-.159l.06.16l.807 2.36a4 4 0 0 0 2.276 2.411l.217.081l2.36.806c1.75.598 1.803 3.016.16 3.725l-.16.06l-2.36.807a4 4 0 0 0-2.412 2.276l-.081.216l-.806 2.361c-.598 1.75-3.016 1.803-3.724.16l-.062-.16l-.806-2.36a4 4 0 0 0-2.276-2.412l-.216-.081l-2.36-.806c-1.751-.598-1.804-3.016-.16-3.724l.16-.062l2.36-.806A4 4 0 0 0 8.22 8.025l.081-.216zM19 2a1 1 0 0 1 .898.56l.048.117l.35 1.026l1.027.35a1 1 0 0 1 .118 1.845l-.118.048l-1.026.35l-.35 1.027a1 1 0 0 1-1.845.117l-.048-.117l-.35-1.026l-1.027-.35a1 1 0 0 1-.118-1.845l.118-.048l1.026-.35l.35-1.027A1 1 0 0 1 19 2"></path>
						</g>
					</svg>
					<span class="text-sm text-slate-100">AVA Assistant</span>
				</button>
			</div>
			<h2 class="text-sm text-gray-500">{{ computedSessionId }}</h2>
			<div class="flex w-fit items-center space-x-2">
				<button class="size-fit">
					<span
						class="icon-[material-symbols-light--download-rounded] size-[25px] text-gray-500 transition-colors duration-200 ease-in-out hover:text-gray-700"></span>
				</button>
				<button class="size-fit">
					<span
						class="icon-[material-symbols-light--delete-rounded] size-[25px] text-red-600 transition-colors duration-200 ease-in-out hover:text-red-700"></span>
				</button>
			</div>
		</div>
		<!-- chat window -->
		<div class="flex-grow p-3"></div>

		<!-- chat suggestions -->
		<div class="flex flex-wrap p-3">
			<button
				class="ai-suggestion-button"
				v-for="(entry, id) in sampleQuestions"
				:key="id"
				type="button"
				@click="requestAnswer(entry)">
				{{ entry }}
			</button>
		</div>

		<!-- bottom bar -->
		<div class="relative h-fit border-t p-3">
			<input
				type="text"
				name="chat-input-send-btn"
				id="chat-input-send-btn"
				class="generic-input"
				placeholder="Ask anything about this report..." />
			<button
				class="absolute right-4 size-fit -translate-y-[120%]"
				:disabled="initializingChatOrAwaitingAnswer">
				<span
					class="icon-[material-symbols-light--send-rounded] size-[25px] text-gray-500 transition-colors duration-200 ease-in-out hover:text-gray-700"
					v-if="!initializingChatOrAwaitingAnswer"></span>
				<span
					class="icon-[svg-spinners--90-ring] size-[25px] text-gray-500"
					v-else></span>
			</button>
		</div>
	</form>
</template>

<script setup lang="ts">
	const {
		sampleQuestions,
		userQuery,
		initializingChatOrAwaitingAnswer,
		computedSessionId,
		initializeChat,
		getChatSession,
		requestAnswer,
	} = useAIChat();
	const { report_url, booking_id, report_type } = defineProps<{
		report_url: string;
		booking_id: string;
		report_type: string;
	}>();

	onMounted(async () => {
		console.log('chat window opened...');
		await initializeChat(report_url, booking_id, report_type);
	});
</script>
