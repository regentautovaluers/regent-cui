<template>
	<div :class="['flex h-screen bg-[#f8faf8] p-2', sidebarExpanded && 'space-x-4']">
		<!-- nav bar -->
		<aside
			:class="[
				'flex h-full max-h-full flex-col space-y-3 transition-all duration-150 ease-linear',
				sidebarExpanded ? 'laptop:w-[13%] w-52' : 'w-[0%] -translate-x-50',
			]">
			<!-- title -->
			<div class="inline-flex h-[6%] w-full items-center justify-between p-1">
				<span class="ava-ai-chat-label">AVA Chat</span>
				<button
					class="group size-6 cursor-pointer"
					@click="() => (sidebarExpanded = !sidebarExpanded)">
					<span
						class="icon-[material-symbols-light--thumbnail-bar-outline] size-6 text-gray-500 group-hover:text-gray-700"></span>
				</button>
			</div>

			<!-- new chat button -->
			<button
				class="inline-flex h-[5%] w-full items-center space-x-2 rounded-xl border border-gray-500 bg-gray-50 px-3 transition duration-150 ease-linear hover:bg-gray-100"
				type="button"
				@click="activeSessionId = null">
				<span class="icon-[material-symbols-light--chat-add-on-outline] size-6"></span>
				<span class="font-medium text-gray-700">New Chat</span>
			</button>

			<!-- chat history -->
			<div class="thin-scrollbar max-h-[calc(100%-(13%))] flex-grow overflow-y-auto">
				<div
					class="inline-flex h-[5%] w-full items-center space-x-2 transition duration-150 ease-linear">
					<span
						class="icon-[material-symbols-light--save-clock-outline-sharp] size-6 text-gray-500"></span>
					<span class="font-medium text-gray-700">Chat History</span>
				</div>
				<div class="ml-2 overflow-x-hidden space-y-1">
					<button
						v-for="(e, idx) in getExistingSessions()"
						:key="idx"
						:class="[
							'h-10 relative w-56 max-w-56 overflow-clip rounded-xl p-2 text-start text-sm text-nowrap text-ellipsis hover:bg-gray-200 group',
							activeSessionId == e.session_id
								? 'bg-gray-300 text-gray-700'
								: 'text-gray-500',
						]"
						type="button"
						@click="retrieveSessionChats(e.session_id)">
						{{ e.title }}

						<button class="rounded-xl p-1 bg-red-300 hover:bg-red-400 absolute hidden group-hover:block right-2 top-[20%] size-6">
							<span class="icon-[material-symbols-light--delete] text-red-600"></span>	
						</button>
					</button>
				</div>
			</div>
		</aside>

		<!-- main chat window for a new chat -->
		<main
			class="relative flex h-full flex-grow flex-col rounded-md border border-gray-300 bg-white px-2 transition-all duration-150 ease-linear"
			v-if="!activeSessionId">
			<div
				:class="[
					'flex h-[6%] items-center',
					sidebarExpanded ? 'justify-center' : 'justify-between',
				]">
				<button
					class="group cursor-pointer"
					@click="() => (sidebarExpanded = true)"
					v-if="!sidebarExpanded">
					<span
						class="icon-[material-symbols-light--thumbnail-bar-outline] size-6 text-gray-500 group-hover:text-gray-700"></span>
				</button>
				<button
					disabled
					class="inline-flex items-center space-x-1 rounded-full bg-blue-200 px-3 py-1 text-blue-700">
					<span class="icon-[material-symbols-light--experiment] size-5"></span>
					<span>Experimental</span>
				</button>
				<div></div>
			</div>
			<div class="flex flex-grow flex-col items-center justify-center">
				<h1 class="mb-4 text-center text-3xl font-bold text-gray-700 uppercase">
					Chat With <br />
					Your Reports
				</h1>
				<form
					class="tablet:w-[60%] laptop:w-[40%] relative h-fit w-[80%]"
					@submit.prevent="submitQuestion()">
					<textarea
						id="comments"
						class="generic-text-area resize-none rounded-3xl text-base"
						rows="5"
						placeholder="What would you like to know?..."
						v-model="userQuery"
						:disabled="awaitingAnswer"></textarea>
					<button
						type="submit"
						class="absolute right-4 bottom-4 inline-flex size-10 items-center justify-center rounded-full bg-blue-600 text-white disabled:bg-gray-300 disabled:text-gray-700"
						:disabled="!userQuery || awaitingAnswer">
						<span
							class="icon-[svg-spinners--90-ring] size-7"
							v-if="awaitingAnswer"></span>
						<span
							class="icon-[material-symbols-light--arrow-upward-alt-rounded] size-7"
							v-else></span>
					</button>
				</form>

				<!-- sample questions -->
				<div
					class="tablet:w-[60%] laptop:w-[40%] relative mt-4 flex h-fit w-[80%] flex-wrap space-y-2 space-x-2">
					<button
						v-for="(q, idx) in sampleQuestions"
						:key="idx"
						class="rounded-full border p-2 text-sm text-gray-700 transition-colors duration-150 ease-in-out outline-none hover:border-gray-300 hover:bg-gray-100/70">
						{{ q }}
					</button>
				</div>
			</div>
		</main>

		<!-- chat window for existing chat -->
		<main
			class="relative flex h-full flex-grow flex-col rounded-md border border-gray-300 bg-white"
			v-else>
			<div
				:class="[
					'flex h-[6%] min-h-12 items-center px-2',
					sidebarExpanded ? 'justify-center' : 'justify-between',
				]">
				<button
					class="group cursor-pointer"
					@click="() => (sidebarExpanded = true)"
					v-if="!sidebarExpanded">
					<span
						class="icon-[material-symbols-light--thumbnail-bar-outline] size-6 text-gray-500 group-hover:text-gray-700"></span>
				</button>
				<button
					disabled
					class="inline-flex items-center space-x-1 rounded-full bg-blue-200 px-3 py-1 text-blue-700">
					<span class="icon-[material-symbols-light--experiment] size-5"></span>
					<span>Experimental</span>
				</button>
				<div></div>
			</div>

			<!-- Q & A strip -->
			<div
				class="thin-scrollbar laptop:px-[28rem] flex h-[calc(100%-(6%+10%))] max-h-[calc(100%-(6%+10%))] flex-grow flex-col space-y-2 overflow-y-scroll px-5">
				<template
					v-for="(m, idx) in getChatMessages(activeSessionId)"
					:key="idx">
					<!-- user question -->
					<p
						class="tablet:max-w-[60%] laptop:max-w-[50%] h-fit max-w-[80%] self-end rounded-2xl bg-gray-200 p-3 text-sm text-gray-700 outline-none"
						v-if="m.origin == 'user'">
						{{ m.message }}
					</p>

					<!-- AI reponse -->
					<div
						class="markdown-content tablet:max-w-[60%] laptop:max-w-[50%] h-fit max-w-[80%] self-start rounded-2xl p-2 text-sm text-gray-700 outline-none"
						v-else-if="m.origin == 'assistant'"
						v-html="renderMarkdown(m.message as string)"></div>
				</template>
			</div>

			<!-- follow up query strip -->
			<form
				class="my-2 flex h-[10%] justify-center"
				@submit.prevent="submitQuestion()">
				<div
					class="tablet:w-[75%] laptop:w-[55%] laptop-lg:w-[45%] relative size-fit w-[95%]">
					<textarea
						id="comments"
						class="generic-text-area resize-none rounded-2xl text-base shadow-sm"
						rows="3"
						placeholder="Ask a follow up question..."
						v-model="userQuery"
						:disabled="awaitingAnswer"></textarea>
					<button
						type="submit"
						class="absolute right-3 bottom-3 inline-flex size-10 items-center justify-center rounded-full bg-blue-600 text-white disabled:bg-gray-300 disabled:text-gray-700"
						:disabled="!userQuery || awaitingAnswer">
						<span
							class="icon-[svg-spinners--90-ring] size-7"
							v-if="awaitingAnswer"></span>
						<span
							class="icon-[material-symbols-light--arrow-upward-alt-rounded] size-7"
							v-else></span>
					</button>
				</div>
			</form>
		</main>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'ava-chat',
	});

	const sidebarExpanded: Ref<boolean> = ref(true);
	const {
		userQuery,
		awaitingAnswer,
		sampleQuestions,
		submitQuestion,
		activeSessionId,
		getChatMessages,
		getExistingSessions,
		retrieveSessionChats,
	} = useAVAAIChat();
</script>

<style scoped>
	/* Base Container */
	.markdown-content :deep(*) {
		box-sizing: border-box;
	}

	.markdown-content {
		color: #364153;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
		line-height: 1.6;
	}

	/* Paragraphs */
	.markdown-content :deep(p) {
		margin-bottom: 1.25rem;
		line-height: 1.75;
		color: #364153;
	}

	.markdown-content :deep(p:last-child) {
		margin-bottom: 0;
	}

	/* Typography Scale */
	.markdown-content :deep(h1),
	.markdown-content :deep(h2),
	.markdown-content :deep(h3),
	.markdown-content :deep(h4),
	.markdown-content :deep(h5),
	.markdown-content :deep(h6) {
		color: #364153;
		font-weight: 700;
		line-height: 1.2;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	.markdown-content :deep(h1) {
		font-size: 2.25rem;
		border-bottom: 2px solid #e2e8f0;
		padding-bottom: 0.5rem;
	}

	.markdown-content :deep(h2) {
		font-size: 1.875rem;
		border-bottom: 1px solid #e2e8f0;
		padding-bottom: 0.3rem;
	}

	.markdown-content :deep(h3) {
		font-size: 1.5rem;
	}
	.markdown-content :deep(h4) {
		font-size: 1.25rem;
	}

	/* Lists */
	.markdown-content :deep(ul),
	.markdown-content :deep(ol) {
		margin-bottom: 1.25rem;
		padding-left: 1.5rem;
	}

	.markdown-content :deep(li) {
		margin-bottom: 0.5rem;
	}

	/* Links */
	.markdown-content :deep(a) {
		color: #2563eb; /* A classic blue for visibility */
		text-decoration: underline;
		text-underline-offset: 2px;
		transition: color 0.2s;
	}

	.markdown-content :deep(a:hover) {
		color: #1d4ed8;
	}

	/* Blockquotes */
	.markdown-content :deep(blockquote) {
		border-left: 4px solid #cbd5e1;
		margin: 1.5rem 0;
		padding: 0.5rem 1rem;
		background-color: #f8fafc;
		color: #475569;
		font-style: italic;
	}

	/* Code Blocks */
	.markdown-content :deep(code) {
		background-color: #f1f5f9;
		color: #e11d48; /* Contrast color for inline code */
		padding: 0.2rem 0.4rem;
		border-radius: 0.25rem;
		font-family: monospace;
		font-size: 0.9em;
	}

	.markdown-content :deep(pre) {
		background-color: #1e293b; /* Keeping code blocks dark for syntax highlighting */
		color: #f8fafc;
		padding: 1rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		margin-bottom: 1.5rem;
	}

	.markdown-content :deep(pre code) {
		background-color: transparent;
		color: inherit;
		padding: 0;
	}

	/* Tables */
	.markdown-content :deep(table) {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 1.5rem;
		font-size: 0.9rem;
	}

	.markdown-content :deep(th) {
		background-color: #f8fafc;
		border: 1px solid #e2e8f0;
		padding: 0.75rem;
		text-align: left;
		font-weight: 600;
	}

	.markdown-content :deep(td) {
		border: 1px solid #e2e8f0;
		padding: 0.75rem;
	}

	.markdown-content :deep(tr:nth-child(even)) {
		background-color: #fcfcfc;
	}

	/* Horizontal Rule */
	.markdown-content :deep(hr) {
		border: 0;
		border-top: 1px solid #e2e8f0;
		margin: 2rem 0;
	}

	/* Images */
	.markdown-content :deep(img) {
		max-width: 100%;
		height: auto;
		border-radius: 0.375rem;
		margin: 1rem 0;
	}

	/* Checkboxes (Task Lists) */
	.markdown-content :deep(input[type='checkbox']) {
		margin-right: 0.5rem;
		accent-color: #364153;
	}
</style>
