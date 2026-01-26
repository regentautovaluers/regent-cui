<template>
	<ClientOnly>
		<form
			class="tablet:w-3/4 laptop:w-[40vw] laptop-lg:w-[30vw] fixed right-8 bottom-20 z-50 flex h-[calc(100vh-15%)] w-full flex-col rounded-lg border-2 bg-white shadow-md"
			@submit.prevent="requestAnswer()"
			v-show="isChatOpen && computedChatSession && computedChatSession.isVisible">
			<!-- header -->
			<div
				:class="[
					'flex h-fit items-center justify-between border-b p-3',
					computedChatSession?.chatStatus == 'PROCESSING' && 'bg-yellow-300',
					computedChatSession?.chatStatus == 'READY' ||
						(computedChatSession?.chatStatus == 'RESUMED' && 'bg-white'),
				]">
				<h1
					class="bg-linear-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-2xl font-bold text-transparent">
					AVA AI
				</h1>
				<div class="flex size-fit items-center space-x-2 font-semibold">
					<div
						:class="[
							'size-2 rounded-full',
							computedChatSession?.chatStatus === 'READY' && 'bg-green-600',
							computedChatSession?.chatStatus === 'PROCESSING' && 'bg-yellow-600',
						]" />
					<h1 class="text-sm font-semibold text-gray-600">
						<span
							v-if="
								computedChatSession?.chatStatus === 'READY' ||
								computedChatSession?.chatStatus === 'RESUMED'
							"
							>Ready</span
						><span v-else>Processing</span>
					</h1>
				</div>
				<div class="flex w-fit items-center space-x-2">
					<button
						class="jusitfy-center inline-flex size-8 items-center rounded-lg p-1 hover:bg-gray-200"
						type="button"
						@click="deleteChat()">
						<span
							class="icon-[material-symbols-light--delete-rounded] size-[23px] text-red-600 transition-colors duration-200 ease-in-out"
							v-if="!deleteChatRequestLoading"></span>
						<span
							class="icon-[svg-spinners--90-ring] size-[23px] text-red-600"
							v-else></span>
					</button>
					<button
						class="jusitfy-center inline-flex items-center rounded-lg bg-gray-200 p-1 hover:bg-gray-300"
						type="button"
						@click="renderSessionAsHidden()">
						<svg
							aria-hidden="true"
							class="size-[20px]"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg">
							<path
								fill-rule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clip-rule="evenodd"></path>
						</svg>
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
					<p
						class="w-[80%] self-end rounded-lg bg-blue-600 p-3 text-xs text-slate-100 outline-none"
						v-if="m.role == 'user'">
						{{ m.question }}
					</p>

					<!-- AI reponse -->
					<div
						class="markdown-content w-[80%] self-start rounded-lg bg-gray-600 p-3 text-xs text-slate-100 outline-none"
						v-else-if="m.role == 'assistant'"
						v-html="renderMarkdown(m.answer as string)"></div>
				</template>

				<!-- chat suggestions -->
				<div
					class="absolute bottom-0 flex h-fit flex-wrap py-2"
					v-show="computedChatSession && computedChatSession.messages.length == 0">
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
					:placeholder="
						awaitingAnswer || initializingChat
							? 'Please wait...'
							: 'Ask about this report...'
					"
					autocomplete="off"
					v-model="userQuery"
					:disabled="awaitingAnswer || initializingChat" />
				<button
					class="absolute right-5 size-fit -translate-y-[121%]"
					:disabled="awaitingAnswer || initializingChat">
					<span
						class="icon-[material-symbols-light--send-rounded] size-[25px] text-gray-500 transition-colors duration-200 ease-in-out hover:text-gray-700"
						v-if="!awaitingAnswer"></span>
					<span
						class="icon-[svg-spinners--90-ring] size-[25px] text-gray-500"
						v-else></span>
				</button>
			</div>
			<p class="text-center text-xs text-gray-500">
				AVA AI can make mistakes. Double check its responses!
			</p>
		</form>

		<button
			class="ai-chat-button"
			type="button"
			@click="initializeChat(report_url, booking_id, report_type)">
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
	</ClientOnly>
</template>

<script setup lang="ts">
	const { report_url, booking_id, report_type } = defineProps<{
		report_url: string;
		booking_id: string;
		report_type: string;
	}>();

	const {
		isChatOpen,
		sampleQuestions,
		userQuery,
		initializingChat,
		awaitingAnswer,
		computedChatSession,
		deleteChatRequestLoading,
		initializeChat,
		getChatSession,
		requestAnswer,
		renderMarkdown,
		deleteChat,
		renderSessionAsHidden,
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

	/* MD -> HMTL styles */
	.markdown-content :deep(p) {
		margin-bottom: 0.5rem;
	}

	.markdown-content :deep(p:last-child) {
		margin-bottom: 0;
	}

	.markdown-content :deep(ul),
	.markdown-content :deep(ol) {
		margin-left: 1.25rem;
		margin-bottom: 0.5rem;
		list-style-type: disc;
	}

	.markdown-content :deep(strong) {
		font-weight: 700;
		color: #fff; /* Making bold text pop against gray-600 */
	}

	.markdown-content :deep(code) {
		background-color: rgba(0, 0, 0, 0.3);
		padding: 0.1rem 0.3rem;
		border-radius: 4px;
		font-family: monospace;
	}

	.markdown-content :deep(a) {
		color: #60a5fa; /* blue-400 */
		text-decoration: underline;
	}
</style>
