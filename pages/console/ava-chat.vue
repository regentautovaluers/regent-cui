<template>
	<div :class="['flex h-screen bg-[#f8faf8] p-2', sidebarExpanded && 'space-x-4']">
		<!-- nav bar -->
		<aside
			:class="[
				'all flex h-full max-h-full flex-col space-y-3 transition duration-150 ease-linear',
				sidebarExpanded ? 'w-[13%]' : 'w-[0%] -translate-x-50',
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
				<div class="ml-3 overflow-x-hidden">
					<button
						v-for="(e, idx) in getExistingSessions()"
						:key="idx"
						:class="[
							'h-12 w-56 max-w-56 overflow-clip rounded-lg p-1 text-start text-sm text-nowrap text-ellipsis hover:bg-gray-100',
							activeSessionId == e.session_id
								? 'bg-gray-300 text-gray-700'
								: 'text-gray-500',
						]"
						type="button"
						@click="retrieveSessionChats(e.session_id)">
						{{ e.title }}
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
					'flex h-[6%] items-center px-2',
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
				class="thin-scrollbar flex flex-grow flex-col items-center justify-center space-y-3 overflow-y-auto">
				<template
					v-for="(m, idx) in getChatMessages(activeSessionId)"
					:key="idx">
					<!-- user question -->
					<p
						class="tablet:max-w-[60%] laptop:max-w-[50%] h-fit max-w-[80%] self-end rounded-2xl bg-gray-100 p-3 text-sm text-gray-700 outline-none"
						v-if="m.origin == 'user'">
						{{ m.response }}
					</p>

					<!-- AI reponse -->
					<div
						class="markdown-content w-[80%] self-start text-gray-700"
						v-else-if="m.origin == 'assistant'"
						v-html="renderMarkdown(m.response as string)"></div>
				</template>
			</div>

			<!-- follow up query strip -->
			<form
				class="my-2 flex h-fit justify-center"
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
	.markdown-content :deep(*) {
		box-sizing: border-box;
	}

	.markdown-content :deep(p) {
		margin-bottom: 1rem;
		line-height: 1.75;
		color: #e5e7eb; /* gray-200 */
	}

	.markdown-content :deep(p:last-child) {
		margin-bottom: 0;
	}

	/* Typography Scale - Major Third (1.25) */
	.markdown-content :deep(h1) {
		font-size: 2.986rem;
		font-weight: 800;
		margin-bottom: 1.5rem;
		margin-top: 2.5rem;
		line-height: 1.2;
		letter-spacing: -0.025em;
		background: linear-gradient(to right, #f9fafb, #d1d5db);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.markdown-content :deep(h2) {
		font-size: 2.488rem;
		font-weight: 700;
		margin-bottom: 1.25rem;
		margin-top: 2rem;
		line-height: 1.3;
		color: #f3f4f6; /* gray-100 */
		border-bottom: 1px solid #374151;
		padding-bottom: 0.5rem;
	}

	.markdown-content :deep(h3) {
		font-size: 2.074rem;
		font-weight: 600;
		margin-bottom: 1rem;
		margin-top: 1.75rem;
		line-height: 1.4;
		color: #f9fafb; /* gray-50 */
	}

	.markdown-content :deep(h4) {
		font-size: 1.728rem;
		font-weight: 600;
		margin-bottom: 0.875rem;
		margin-top: 1.5rem;
		line-height: 1.4;
		color: #f3f4f6;
	}

	.markdown-content :deep(h5) {
		font-size: 1.44rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
		margin-top: 1.25rem;
		line-height: 1.5;
		color: #e5e7eb;
	}

	.markdown-content :deep(h6) {
		font-size: 1.2rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
		margin-top: 1rem;
		line-height: 1.5;
		color: #d1d5db; /* gray-300 */
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* Lists */
	.markdown-content :deep(ul),
	.markdown-content :deep(ol) {
		margin-bottom: 1rem;
		margin-left: 0;
		padding-left: 1.5rem;
		line-height: 1.75;
	}

	.markdown-content :deep(ul) {
		list-style-type: none;
	}

	.markdown-content :deep(ul) > li {
		position: relative;
		padding-left: 0.5rem;
	}

	.markdown-content :deep(ul) > li::before {
		content: '•';
		color: #60a5fa; /* blue-400 */
		font-weight: bold;
		position: absolute;
		left: -1rem;
	}

	.markdown-content :deep(ul) > li > ul > li::before {
		content: '◦';
		color: #34d399; /* emerald-400 */
	}

	.markdown-content :deep(ul) > li > ul > li > ul > li::before {
		content: '▪';
		color: #a78bfa; /* violet-400 */
	}

	.markdown-content :deep(ol) {
		list-style-type: decimal;
	}

	.markdown-content :deep(ol) > li {
		padding-left: 0.25rem;
	}

	.markdown-content :deep(ol) > li::marker {
		color: #60a5fa;
		font-weight: 600;
	}

	.markdown-content :deep(li) {
		margin-bottom: 0.5rem;
	}

	.markdown-content :deep(li > p) {
		margin-bottom: 0.5rem;
	}

	/* Task Lists */
	.markdown-content :deep(input[type='checkbox']) {
		appearance: none;
		width: 1.125rem;
		height: 1.125rem;
		border: 2px solid #4b5563;
		border-radius: 0.25rem;
		margin-right: 0.5rem;
		vertical-align: middle;
		cursor: pointer;
		position: relative;
		top: -1px;
	}

	.markdown-content :deep(input[type='checkbox']:checked) {
		background-color: #3b82f6;
		border-color: #3b82f6;
	}

	.markdown-content :deep(input[type='checkbox']:checked)::after {
		content: '✓';
		position: absolute;
		color: white;
		font-size: 0.75rem;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	/* Text Formatting */
	.markdown-content :deep(strong) {
		font-weight: 700;
		color: #ffffff;
		text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
	}

	.markdown-content :deep(em) {
		font-style: italic;
		color: #c4b5fd; /* violet-300 */
	}

	.markdown-content :deep(strong em),
	.markdown-content :deep(em strong) {
		color: #fbbf24; /* amber-400 */
		font-style: italic;
	}

	.markdown-content :deep(del) {
		text-decoration: line-through;
		color: #6b7280;
		opacity: 0.7;
	}

	.markdown-content :deep(mark) {
		background: linear-gradient(120deg, #fbbf24 0%, #fbbf24 100%);
		background-repeat: no-repeat;
		background-size: 100% 40%;
		background-position: 0 88%;
		color: #1f2937;
		padding: 0.125rem 0.25rem;
		border-radius: 0.125rem;
		font-weight: 600;
	}

	/* Links */
	.markdown-content :deep(a) {
		color: #60a5fa; /* blue-400 */
		text-decoration: none;
		font-weight: 500;
		position: relative;
		transition: color 0.2s ease;
	}

	.markdown-content :deep(a)::after {
		content: '';
		position: absolute;
		width: 100%;
		height: 2px;
		bottom: -2px;
		left: 0;
		background: linear-gradient(90deg, #60a5fa, #a78bfa);
		transform: scaleX(0);
		transform-origin: bottom right;
		transition: transform 0.3s ease;
	}

	.markdown-content :deep(a:hover) {
		color: #93c5fd; /* blue-300 */
	}

	.markdown-content :deep(a:hover)::after {
		transform: scaleX(1);
		transform-origin: bottom left;
	}

	.markdown-content :deep(a:active) {
		color: #3b82f6;
	}

	/* Code */
	.markdown-content :deep(code) {
		background-color: rgba(17, 24, 39, 0.8); /* gray-900 */
		color: #e5e7eb;
		padding: 0.2rem 0.4rem;
		border-radius: 0.375rem;
		font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, Monaco, monospace;
		font-size: 0.875em;
		border: 1px solid #374151;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
	}

	.markdown-content :deep(pre) {
		background-color: #0f172a; /* slate-900 */
		border: 1px solid #1e293b;
		border-radius: 0.75rem;
		padding: 1.25rem;
		margin-bottom: 1.5rem;
		overflow-x: auto;
		position: relative;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
	}

	.markdown-content :deep(pre code) {
		background-color: transparent;
		border: none;
		padding: 0;
		font-size: 0.875rem;
		line-height: 1.7;
		color: #e2e8f0;
		display: block;
	}

	/* Syntax Highlighting Colors */
	.markdown-content :deep(pre code .keyword) {
		color: #c678dd;
	}
	.markdown-content :deep(pre code .string) {
		color: #98c379;
	}
	.markdown-content :deep(pre code .number) {
		color: #d19a66;
	}
	.markdown-content :deep(pre code .function) {
		color: #61afef;
	}
	.markdown-content :deep(pre code .comment) {
		color: #5c6370;
		font-style: italic;
	}
	.markdown-content :deep(pre code .operator) {
		color: #56b6c2;
	}

	/* Keyboard Keys */
	.markdown-content :deep(kbd) {
		background: linear-gradient(180deg, #374151 0%, #1f2937 100%);
		border: 1px solid #4b5563;
		border-bottom-color: #1f2937;
		box-shadow:
			0 2px 0 #1f2937,
			0 3px 3px rgba(0, 0, 0, 0.3);
		color: #f3f4f6;
		font-family: inherit;
		font-size: 0.75em;
		font-weight: 600;
		padding: 0.25rem 0.5rem;
		border-radius: 0.375rem;
		white-space: nowrap;
		position: relative;
		top: -1px;
	}

	.markdown-content :deep(kbd:hover) {
		transform: translateY(1px);
		box-shadow:
			0 1px 0 #1f2937,
			0 2px 2px rgba(0, 0, 0, 0.3);
	}

	/* Blockquotes */
	.markdown-content :deep(blockquote) {
		border-left: 4px solid #3b82f6;
		margin: 1.5rem 0;
		padding: 1rem 1.5rem;
		background: linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%);
		border-radius: 0 0.5rem 0.5rem 0;
		font-style: italic;
		color: #d1d5db;
	}

	.markdown-content :deep(blockquote p:last-child) {
		margin-bottom: 0;
	}

	.markdown-content :deep(blockquote cite) {
		display: block;
		margin-top: 0.5rem;
		font-size: 0.875rem;
		color: #9ca3af;
		font-style: normal;
	}

	.markdown-content :deep(blockquote cite)::before {
		content: '— ';
	}

	/* Tables */
	.markdown-content :deep(table) {
		width: 100%;
		margin-bottom: 1.5rem;
		border-collapse: separate;
		border-spacing: 0;
		border-radius: 0.5rem;
		overflow: hidden;
		border: 1px solid #374151;
	}

	.markdown-content :deep(thead) {
		background-color: #1f2937;
	}

	.markdown-content :deep(th) {
		padding: 0.75rem 1rem;
		text-align: left;
		font-weight: 600;
		color: #f9fafb;
		border-bottom: 2px solid #4b5563;
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.markdown-content :deep(td) {
		padding: 0.75rem 1rem;
		border-bottom: 1px solid #374151;
		color: #d1d5db;
	}

	.markdown-content :deep(tr:last-child td) {
		border-bottom: none;
	}

	.markdown-content :deep(tbody tr) {
		background-color: #111827;
		transition: background-color 0.2s ease;
	}

	.markdown-content :deep(tbody tr:nth-child(even)) {
		background-color: #1f2937;
	}

	.markdown-content :deep(tbody tr:hover) {
		background-color: #374151;
	}

	/* Horizontal Rule */
	.markdown-content :deep(hr) {
		border: none;
		height: 1px;
		background: linear-gradient(90deg, transparent, #4b5563, transparent);
		margin: 2rem 0;
		position: relative;
	}

	.markdown-content :deep(hr)::before {
		content: '§';
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		background-color: #1f2937;
		color: #6b7280;
		padding: 0 1rem;
		font-size: 1rem;
	}

	/* Images */
	.markdown-content :deep(img) {
		max-width: 100%;
		height: auto;
		border-radius: 0.5rem;
		margin: 1.5rem 0;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
		border: 1px solid #374151;
	}

	.markdown-content :deep(figcaption) {
		text-align: center;
		font-size: 0.875rem;
		color: #9ca3af;
		margin-top: -1rem;
		margin-bottom: 1.5rem;
		font-style: italic;
	}

	/* Details/Summary (Collapsible sections) */
	.markdown-content :deep(details) {
		background-color: #1f2937;
		border: 1px solid #374151;
		border-radius: 0.5rem;
		margin-bottom: 1rem;
		overflow: hidden;
	}

	.markdown-content :deep(summary) {
		padding: 1rem 1.25rem;
		cursor: pointer;
		font-weight: 600;
		color: #f3f4f6;
		background-color: #111827;
		user-select: none;
		transition: background-color 0.2s ease;
	}

	.markdown-content :deep(summary:hover) {
		background-color: #1f2937;
	}

	.markdown-content :deep(details[open] summary) {
		border-bottom: 1px solid #374151;
	}

	.markdown-content :deep(details > *) {
		padding: 1rem 1.25rem;
	}

	.markdown-content :deep(details > *:not(summary)) {
		margin: 0;
	}

	/* Definition Lists */
	.markdown-content :deep(dl) {
		margin-bottom: 1rem;
	}

	.markdown-content :deep(dt) {
		font-weight: 600;
		color: #f3f4f6;
		margin-top: 1rem;
	}

	.markdown-content :deep(dd) {
		margin-left: 1.5rem;
		color: #d1d5db;
		margin-bottom: 0.5rem;
	}

	/* Abbreviations */
	.markdown-content :deep(abbr) {
		border-bottom: 1px dotted #6b7280;
		cursor: help;
		text-decoration: none;
	}

	/* Subscript and Superscript */
	.markdown-content :deep(sub),
	.markdown-content :deep(sup) {
		font-size: 0.75em;
		line-height: 0;
		position: relative;
		vertical-align: baseline;
	}

	.markdown-content :deep(sup) {
		top: -0.5em;
		color: #fbbf24;
	}

	.markdown-content :deep(sub) {
		bottom: -0.25em;
		color: #60a5fa;
	}

	/* Selection */
	.markdown-content :deep(::selection) {
		background-color: rgba(59, 130, 246, 0.3);
		color: #ffffff;
	}

	/* Scrollbar for code blocks */
	.markdown-content :deep(pre::-webkit-scrollbar) {
		height: 8px;
		width: 8px;
	}

	.markdown-content :deep(pre::-webkit-scrollbar-track) {
		background: #0f172a;
	}

	.markdown-content :deep(pre::-webkit-scrollbar-thumb) {
		background: #4b5563;
		border-radius: 4px;
	}

	.markdown-content :deep(pre::-webkit-scrollbar-thumb:hover) {
		background: #6b7280;
	}

	/* Footnotes */
	.markdown-content :deep(sup a) {
		text-decoration: none;
		font-size: 0.75em;
		color: #60a5fa;
	}

	.markdown-content :deep(.footnotes) {
		margin-top: 2rem;
		padding-top: 1rem;
		border-top: 1px solid #374151;
		font-size: 0.875rem;
		color: #9ca3af;
	}

	/* Alert/Callout boxes (if your markdown parser supports them) */
	.markdown-content :deep(.alert) {
		padding: 1rem 1.25rem;
		border-radius: 0.5rem;
		margin-bottom: 1rem;
		border-left: 4px solid;
	}

	.markdown-content :deep(.alert-info) {
		background-color: rgba(59, 130, 246, 0.1);
		border-color: #3b82f6;
		color: #bfdbfe;
	}

	.markdown-content :deep(.alert-warning) {
		background-color: rgba(251, 191, 36, 0.1);
		border-color: #fbbf24;
		color: #fde68a;
	}

	.markdown-content :deep(.alert-danger) {
		background-color: rgba(239, 68, 68, 0.1);
		border-color: #ef4444;
		color: #fecaca;
	}

	.markdown-content :deep(.alert-success) {
		background-color: rgba(34, 197, 94, 0.1);
		border-color: #22c55e;
		color: #bbf7d0;
	}
</style>
