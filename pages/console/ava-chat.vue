<template>
	<div class="h-auto min-h-dvh">
		<aside
			:class="[
				'tablet:w-[35%] laptop:w-[25%] laptop-lg:w-[15%] fixed left-0 z-20 h-dvh w-[95%] border-r-2 bg-white transition-all duration-200 ease-linear',
				!sidebarExpanded && 'laptop:-translate-x-[80%] -translate-x-[100%]',
			]">
			<!-- version when sidebar is expanded -->
			<div
				v-if="sidebarExpanded"
				class="tablet:p-4 flex size-full flex-col space-y-4 p-2">
				<div class="flex items-center justify-between">
					<div class="flex items-center space-x-1">
						<div
							class="flex size-12 items-center justify-center rounded-xl border-2 bg-blue-700 p-2">
							<span
								class="icon-[material-symbols-light--grain] size-10 text-white"></span>
						</div>

						<ColouredTextInput
							text="AVA Chat"
							:bold-text="true"
							text-size="text-xl"></ColouredTextInput>
					</div>
					<button
						class="group size-6 cursor-pointer"
						@click="toggleSidebar(false)">
						<span
							class="icon-[material-symbols-light--thumbnail-bar-outline] size-6 text-gray-500 group-hover:text-gray-700"></span>
					</button>
				</div>

				<button
					class="inline-flex h-12 items-center justify-center space-x-1 rounded-xl border-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-gray-800"
					@click="activeSessionId = null">
					<span class="icon-[material-symbols-light--chat-add-on-outline] size-6"></span>
					<span>New Chat</span>
				</button>

				<div class="flex-1 space-y-4 rounded-xl bg-gray-100 p-2">
					<h1 class="rounded-xl bg-gray-200 p-2 text-gray-700">Recents Chats</h1>
					<!-- loading data -->
					<div
						class="space-y-3"
						v-if="fetchChatSessionsPending">
						<div
							class="mb-4 h-8 w-full animate-pulse rounded-xl bg-gray-300"
							v-for="a in 5"
							:key="a"></div>
					</div>
					<div
						class="h-[95%] max-h-[95%] space-y-3 overflow-y-auto"
						v-else>
						<button
							type="button"
							class="group relative flex h-14 w-full cursor-pointer flex-col rounded-xl p-2 text-start hover:bg-gray-200"
							v-for="e in getExistingSessions()"
							:key="e.session_id"
							@click="retrieveSessionChats(e.session_id)">
							<span class="truncate text-sm whitespace-nowrap text-gray-700">{{
								e.title
							}}</span>
							<span class="text-xs text-gray-500">{{
								calculateTimePassed(e.created_at.split('+')[0]).durationPassed
							}}</span>

							<!-- <button
								class="invisible absolute right-2 inline-flex size-8 translate-y-1 items-center justify-center rounded-full bg-gray-300 p-2 group-hover:visible">
								<span
									class="icon-[material-symbols-light--menu] size-9 text-gray-700"></span>
							</button> -->
						</button>
					</div>
				</div>
			</div>

			<!-- version when sidebar is not expanded -->
			<div
				class="flex size-full flex-col items-end space-y-4 p-2"
				v-else>
				<component
					:is="isHovered ? 'button' : 'div'"
					@mouseover="isHovered = true"
					@mouseleave="isHovered = false"
					@click="toggleSidebar(true)"
					:class="[
						'flex size-10 items-center justify-center',
						isHovered ? 'rounded-full border-2' : 'rounded-xl bg-blue-700',
					]">
					<span
						class="icon-[material-symbols-light--grain] size-6 text-white"
						v-if="!isHovered"></span>
					<span
						class="icon-[material-symbols-light--thumbnail-bar-outline] size-6 text-gray-500 group-hover:text-gray-700"
						v-else></span>
				</component>
				<button
					class="inline-flex size-10 items-center justify-center space-x-1 rounded-full bg-gray-100 text-sm text-gray-700 hover:bg-gray-200 hover:text-gray-800"
					@click="activeSessionId = null">
					<span class="icon-[material-symbols-light--chat-add-on-outline] size-6"></span>
				</button>
			</div>
		</aside>
		<main class="relative h-dvh min-h-dvh">
			<!--  top navbar -->
			<nav
				:class="[
					'fixed top-0 flex h-12 w-full items-center justify-between border-b bg-white px-2',
					sidebarExpanded && 'hidden',
					!sidebarExpanded && 'laptop:hidden block',
				]">
				<button
					class="group size-6 cursor-pointer"
					@click="toggleSidebar()">
					<span
						class="icon-[material-symbols-light--thumbnail-bar-outline] size-6 text-gray-500 group-hover:text-gray-700"></span>
				</button>
			</nav>

			<!-- chat interface when no session in progress -->
			<div
				v-if="!activeSessionId"
				class="mobile-md:px-4 tablet:px-[5vw] laptop:px-[10vw] laptop-lg:px-[20vw] desktop-4k:px-[30vw] flex h-full flex-col items-center justify-center px-2">
				<h1 class="mb-4 text-center text-2xl font-bold text-gray-700 uppercase">
					Talk To <br />
					Your Reports
				</h1>

				<!-- follow up query strip -->
				<AIChatInputBox
					v-model:user-query-model="userQuery"
					v-model:awaiting-response-model="awaitingAnswer"
					:show-suggestion-strips="true"
					call-to-action-text="What would you like to know?"
					@formSubmitted="submitQuestion()"></AIChatInputBox>
			</div>

			<!-- chat interface when a session in progress -->
			<div
				v-else
				class="mobile-md:px-4 tablet:px-[5vw] laptop:px-[10vw] laptop-lg:px-[20vw] desktop-4k:px-[30vw] flex h-full min-h-full flex-col overflow-y-auto px-2 pt-20 pb-40">
				<!-- Q&A strip -->
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
						optional-styles="self-start space-y-4"
						:pie-chart-size="400"
						:bar-chart-height="400"
						:chart-config="m.chart_config"
						:suggestions="
							getSuggestions(
								idx,
								getChatMessagesLength(activeSessionId),
								m.suggestions,
							)
						"
						v-model:user-query-model="userQuery">
					</AIChatBubble>
				</template>

				<!-- when loading content e.g. for loading chat messages or awaiting a response -->
				<div
					class="space-y-3"
					v-if="awaitingAnswer">
					<div
						class="mb-4 h-8 w-full animate-pulse rounded-full bg-gray-300"
						v-for="a in 3"
						:key="a"></div>
				</div>
			</div>

			<div
				class="mobile-md:px-4 tablet:px-[5vw] laptop:px-[10vw] laptop-lg:px-[20vw] desktop-4k:px-[30vw] fixed bottom-0 w-full"
				v-if="activeSessionId">
				<AIChatInputBox
					v-model:user-query-model="userQuery"
					v-model:awaiting-response-model="awaitingAnswer"
					call-to-action-text="Ask a follow up question..."
					@formSubmitted="submitQuestion()"></AIChatInputBox>
			</div>
		</main>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'ava-chat',
	});

	const sidebarExpanded: Ref<boolean> = ref(true);
	const isHovered: Ref<boolean> = ref(false);

	function toggleSidebar(t?: boolean) {
		if (t) {
			sidebarExpanded.value = t;
			return;
		}
		sidebarExpanded.value = !sidebarExpanded.value;
	}
	const {
		userQuery,
		awaitingAnswer,
		submitQuestion,
		activeSessionId,
		getChatMessages,
		getChatMessagesLength,
		getExistingSessions,
		retrieveSessionChats,
		getSuggestions,
		fetchChatSessionsPending,
	} = useAVAAIChat();
</script>
