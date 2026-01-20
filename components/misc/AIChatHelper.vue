<template>
	<!-- chat with AI button -->

	<form
		class="tablet:w-3/4 laptop:w-[40vw] laptop-lg:w-[30vw] fixed right-8 bottom-20 z-50 flex h-[calc(100vh-15%)] w-full flex-col rounded-lg border-2 bg-white"
		@submit.prevent="requestAnswer()"
		v-show="isChatOpen">
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
			<h2 class="text-xs font-semibold text-gray-600">
				{{ computedChatSession?.sessionId }}
			</h2>
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
		<div
			class="thin-scrollbar relative flex max-h-full flex-grow flex-col space-y-3 overflow-y-scroll p-3">
			<template
				v-if="computedChatSession && computedChatSession.messages.length > 0"
				v-for="(m, idx) in computedChatSession.messages"
				:key="idx">
				<!-- user question -->
				<div
					class="w-[80%] self-end rounded-lg bg-blue-600 p-2 text-xs text-slate-100 outline-none"
					v-if="m.origin == 'user'">
					{{ m.question }}
				</div>

				<!-- AI reponse -->
				<div
					class="w-[80%] self-start rounded-lg bg-gray-300 p-2 text-xs text-gray-600 outline-none"
					v-if="m.origin == 'assistant'">
					{{ m.answer }}
				</div>
			</template>

			<!-- chat suggestions -->
			<div class="absolute bottom-0 flex h-fit flex-wrap py-2">
				<button
					class="ai-suggestion-button"
					v-for="(entry, id) in sampleQuestions"
					:key="id"
					type="button"
					@click="requestAnswer(entry)">
					{{ entry }}
				</button>
			</div>
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
				class="absolute right-5 size-fit -translate-y-[121%]"
				:disabled="awaitingAnswer">
				<span
					class="icon-[material-symbols-light--send-rounded] size-[25px] text-gray-500 transition-colors duration-200 ease-in-out hover:text-gray-700"
					v-if="!awaitingAnswer"></span>
				<span
					class="icon-[svg-spinners--90-ring] size-[25px] text-gray-500"
					v-else></span>
			</button>
		</div>
		<p class="text-center text-xs text-gray-500">
			AVA can make mistakes. Double check its responses!
		</p>
	</form>

	<button
		class="ai-chat-button"
		type="button"
		@click="initializeChat(report_url, booking_id, 'VALUATION')">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 16 16"
			:class="[initializingChat && 'animate-variable-spin', 'text-slate-100']">
			<path
				fill="currentColor"
				d="M7.198.57c.275-.752 1.34-.752 1.615 0l.849 2.317a5.82 5.82 0 0 0 3.462 3.463l2.317.848c.753.275.753 1.34 0 1.615l-2.317.849a5.82 5.82 0 0 0-3.462 3.462l-.849 2.317c-.275.753-1.34.753-1.615 0l-.848-2.317a5.82 5.82 0 0 0-3.463-3.462L.57 8.813c-.752-.275-.752-1.34 0-1.615l2.317-.848A5.82 5.82 0 0 0 6.35 2.887zm.562 2.833A7.32 7.32 0 0 1 3.403 7.76l-.673.246l.673.246a7.32 7.32 0 0 1 4.357 4.356l.246.673l.246-.673a7.32 7.32 0 0 1 4.356-4.356l.673-.246l-.673-.246a7.32 7.32 0 0 1-4.356-4.357l-.246-.673z" />
		</svg>
		<span class="text-slate-100">Ask AVA</span>
	</button>

	<!-- chat with AI form -->
</template>

<script setup lang="ts">
	const { report_url, booking_id, report_type } = defineProps<{
		report_url: string;
		booking_id: string;
		report_type: string;
	}>();

	const {
		sampleQuestions,
		isChatOpen,
		userQuery,
		initializingChat,
		awaitingAnswer,
		computedChatSession,
		initializeChat,
		getChatSession,
		requestAnswer,
	} = useAIChat(booking_id);
</script>

<style scoped>
	.animate-variable-spin {
		/* Set total duration to 3 seconds for a noticeable rhythm */
		animation: variable-spin 3s infinite linear;
	}

	@keyframes variable-spin {
		/* Rapid spin (first 30%) */
		0% {
			transform: rotate(0deg);
		}
		30% {
			transform: rotate(360deg);
		}

		/* Drastic slowdown (up to 70%) */
		70% {
			transform: rotate(450deg); /* Only rotates 90 degrees in 40% of the time */
		}

		/* Rapid pick up again to finish the cycle */
		100% {
			transform: rotate(720deg);
		}
	}
</style>
