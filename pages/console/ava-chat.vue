<template>
	<div :class="['flex h-screen bg-[#f8faf8] p-2', sidebarExpanded && 'space-x-4']">
		<!-- nav bar -->
		<aside
			:class="[
				'flex h-full max-h-full flex-col space-y-3 transition-all duration-150 ease-linear',
				sidebarExpanded ? 'laptop:w-[14%] w-52' : 'w-[0%] -translate-x-50',
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

			<!-- action buttons -->
			<div
				class="flex h-[5%] items-center divide-x-1 overflow-clip rounded-xl border border-gray-500">
				<button
					class="inline-flex h-full w-1/2 items-center justify-center space-x-1 text-sm hover:bg-gray-300"
					@click="activeSessionId = null">
					<span class="icon-[material-symbols-light--chat-add-on-outline] size-6"></span>
					<span>New Chat</span>
				</button>
				<!-- <button
					class="inline-flex h-full w-1/2 items-center justify-center space-x-1 text-sm hover:bg-gray-300">
					<span
						class="icon-[material-symbols-light--feature-search-outline] size-6"></span>
					<span>Search</span>
				</button> -->
			</div>

			<!-- chat history -->
			<div class="thin-scrollbar max-h-[calc(100%-(13%))] flex-grow overflow-y-auto">
				<h1 class="font-medium text-gray-700">Recents</h1>
				<div class="space-y-1 overflow-x-hidden">
					<button
						v-for="(e, idx) in getExistingSessions()"
						:key="idx"
						:class="[
							'group relative h-10 w-full max-w-full overflow-clip rounded-xl p-2 text-start text-sm text-nowrap text-ellipsis hover:bg-gray-200',
							activeSessionId == e.session_id
								? 'bg-gray-300 text-gray-700'
								: 'text-gray-500',
						]"
						type="button"
						@click="retrieveSessionChats(e.session_id)">
						{{ e.title }}
						<span
							class="absolute top-[20%] right-2 hidden size-6 rounded-xl bg-red-300 p-1 group-hover:block hover:bg-red-400">
							<span class="icon-[material-symbols-light--delete] text-red-600"></span>
						</span>
					</button>
				</div>
			</div>
		</aside>

		<!-- main chat window for a new chat -->
		<main
			class="relative flex h-full flex-grow flex-col rounded-xl border border-gray-300 bg-white px-2 transition-all duration-150 ease-linear"
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
			class="relative flex h-full flex-grow flex-col rounded-md border border-gray-300"
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
					<UserChatBubble
						v-if="m.origin == 'user'"
						:message="m.message"
						optional-styles="self-end tablet:w-[45%] w-[95%] max-w-[95%] tablet:max-w-[45%]"></UserChatBubble>

					<!-- AI reponse -->
					<AIChatBubble
						v-else-if="m.origin == 'assistant'"
						:message="m.message"
						optional-styles="self-start">
					</AIChatBubble>
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
