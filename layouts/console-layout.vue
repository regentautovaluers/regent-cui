<template>
	<main class="h-screen">
		<!-- the navigation bar on the left side -->
		<aside
			class="fixed z-50 flex h-full max-h-full flex-col overflow-y-auto border-r-2 bg-white transition-all duration-100 ease-out"
			:class="sidebarOpen ? 'w-[16rem] max-w-[16rem]' : 'w-16'"
			@mouseover="sidebarOpen = true"
			@mouseleave="sidebarOpen = false">
			<div
				class="flex min-h-[80px] w-full max-w-[16rem] items-center justify-center border-b-[1px] bg-white text-center">
				<NuxtLink
					:to="{ name: 'mobivaluer-home' }"
					class="flex items-center ps-2.5"
					v-if="sidebarOpen">
					<img
						src="/images/app-logo.png"
						class="me-3 h-12"
						alt="Regent Logo" />
				</NuxtLink>
				<NuxtLink
					v-else
					:to="{ name: 'mobivaluer-home' }"
					class="flex items-center ps-2.5">
					<img
						src="/images/app-logo-small.png"
						class="me-3 h-10"
						alt="Regent Logo" />
				</NuxtLink>
			</div>
			<!-- actual links -->
			<div class="flex flex-grow flex-col justify-between px-1 py-2">
				<ul class="space-y-3">
					<template
						v-for="(link, index) in navigationRoutes"
						:key="index">
						<li
							class="flex h-12 w-full items-center rounded-xl px-2 text-gray-600 hover:bg-gray-300/50">
							<NuxtLink
								:to="{ name: link.routeName }"
								class="inline-flex size-full items-center justify-center"
								:class="!sidebarOpen ? 'w-19' : 'w-full space-x-2'">
								<span>
									<HomeIcon classes="size-6 text-inherit" />
								</span>
								<span
									class="flex-grow font-semibold transition-all duration-200 ease-out"
									:class="sidebarOpen ? 'block' : 'hidden'"
									>{{ link.screenName }}</span
								>
							</NuxtLink>

							<button
								v-if="link.childRoutes"
								:class="sidebarOpen ? 'block' : 'hidden'"
								type="button"
								:aria-controls="`${link.routeName}-dropdown`"
								:data-collapse-toggle="`${link.routeName}-dropdown`">
								<DropdownChevronIcon />
							</button>
						</li>
						<ul
							v-if="link.childRoutes"
							:id="`${link.routeName}-dropdown`"
							class="ml-8 hidden space-y-2"
							:class="sidebarOpen ? 'block' : 'hidden'">
							<ol class="border-s border-gray-400">
								<li
									class="group mb-7 ms-4"
									v-for="(childLink, index) in link.childRoutes"
									:key="index">
									<div
										class="absolute start-[29px] mt-1.5 size-4 rounded-full border border-white bg-gray-400 group-hover:bg-blue-600"></div>
									<NuxtLink
										class="font-normal leading-none text-gray-500"
										:to="{
											name: childLink.routeName,
										}"
										>{{ childLink.screenName }}</NuxtLink
									>
								</li>
							</ol>
						</ul>
					</template>
				</ul>
				<!-- Carousel -->
				<SidenavCarousel v-if="sidebarOpen" />

				<ul class="space-y-2">
					<!-- settings -->
					<li
						class="flex h-12 w-full items-center rounded-xl text-gray-600 hover:bg-gray-300/50">
						<button
							class="inline-flex size-full items-center justify-start space-x-3"
							:class="!sidebarOpen && 'w-19 justify-center'"
							@click="isSettingsModalOpen = true">
							<SettingsIcon classes="size-7 text-inherit" />
							<span
								class="transition-all duration-200 ease-out"
								:class="sidebarOpen ? 'block' : 'hidden'"
								>Settings</span
							>
						</button>
					</li>

					<!-- logout -->
					<li
						class="flex h-12 w-full items-center rounded-xl text-gray-600 hover:bg-gray-300/50">
						<button
							class="inline-flex size-full items-center space-x-3"
							:class="!sidebarOpen && 'w-19 justify-center'"
							@click="attemptLogout">
							<LogoutIcon classes="size-7 text-inherit" />
							<span
								class="transition-all duration-200 ease-out"
								:class="sidebarOpen ? 'block' : 'hidden'"
								>Logout</span
							>
						</button>
					</li>
				</ul>
			</div>

			<div class="flex h-12 w-full flex-col items-center text-sm text-gray-600">
				<h1 v-if="sidebarOpen">Regent Auto Valuers</h1>
				<h2>
					<span>&copy; 2025</span><span v-if="sidebarOpen">. All Rights Reserved</span>
				</h2>
			</div>
		</aside>

		<!-- main UI -->
		<div class="ml-16 h-screen">
			<nav
				class="sticky top-0 z-30 flex h-[7.35%] w-full items-center border-b bg-white"
				id="top-nav">
				<div class="flex h-full flex-grow items-center justify-between px-4">
					<h1 class="text-lg font-semibold md:text-3xl">{{ currentScreenName }}</h1>
					<div class="flex items-center space-x-2">
						<!-- notification button -->
						<button
							class="rounded-lg p-2 text-gray-500 transition-all duration-150 ease-linear hover:bg-blue-600 hover:text-slate-100"
							type="button"
							data-drawer-target="dashboard-sidenotif-bar"
							data-drawer-show="dashboard-sidenotif-bar"
							data-drawer-placement="right"
							data-drawer-backdrop="false"
							aria-controls="dashboard-sidenotif-bar">
							<!-- notification bell -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="30"
								height="30"
								viewBox="0 0 24 24"
								class="text-inherit">
								<g
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									color="currentColor">
									<path
										d="M2.53 14.77c-.213 1.394.738 2.361 1.902 2.843c4.463 1.85 10.673 1.85 15.136 0c1.164-.482 2.115-1.45 1.902-2.843c-.13-.857-.777-1.57-1.256-2.267c-.627-.924-.689-1.931-.69-3.003C19.525 5.358 16.157 2 12 2S4.475 5.358 4.475 9.5c0 1.072-.062 2.08-.69 3.003c-.478.697-1.124 1.41-1.255 2.267" />
									<path
										d="M8 19c.458 1.725 2.076 3 4 3c1.925 0 3.541-1.275 4-3" />
								</g>
							</svg>
						</button>

						<!-- chat button -->
						<button
							class="rounded-lg p-2 text-pink-500 transition-all duration-150 ease-linear hover:bg-pink-600 hover:text-slate-100"
							type="button"
							data-drawer-target="dashboard-chat-window"
							data-drawer-show="dashboard-chat-window"
							data-drawer-placement="right"
							data-drawer-backdrop="false"
							aria-controls="dashboard-chat-window">
							<!-- chat icon -->
							<ChatIcon />
						</button>

						<!-- user profile info -->
						<div
							class="md:w-4max-w-48 flex w-fit max-w-48 items-center space-x-3 rounded-full bg-orange-200 px-2 py-1">
							<img
								class="h-12 min-h-12 w-12 min-w-12 rounded-full object-cover"
								:src="profilePicture"
								alt="User Avatar" />
							<div class="hidden h-full flex-col overflow-hidden text-sm md:flex">
								<h1 class="overflow-clip text-ellipsis whitespace-nowrap">
									{{ getPrincipal.username }}
								</h1>
								<h2 class="overflow-clip text-ellipsis whitespace-nowrap">
									{{ getPrincipal.corpName }}
								</h2>
							</div>
						</div>
					</div>
				</div>
			</nav>

			<div class="h-[92.65%] min-h-[92.65%] p-2">
				<slot />
			</div>
		</div>

		<!-- the notification bar on the right side -->
		<aside
			id="dashboard-sidenotif-bar"
			class="fixed right-0 top-0 z-50 h-screen w-96 translate-x-full overflow-y-auto rounded-l-lg border-2 border-gray-500 bg-white p-4 transition-transform"
			tabindex="-1"
			aria-labelledby="drawer-right-label">
			<h5
				id="drawer-right-label"
				class="mb-4 inline-flex items-center text-base font-semibold text-gray-500">
				Your Notifications
			</h5>
			<button
				type="button"
				data-drawer-hide="dashboard-sidenotif-bar"
				aria-controls="dashboard-sidenotif-bar"
				class="absolute end-2.5 top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900">
				<svg
					class="h-3 w-3"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 14 14">
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
				</svg>
				<span class="sr-only">Close menu</span>
			</button>
			<hr class="text-gray-500" />
			<!-- notification content -->
		</aside>

		<!-- the chat window on the right side -->
		<aside
			id="dashboard-chat-window"
			class="fixed right-0 top-0 z-50 h-screen w-[32rem] translate-x-full overflow-y-hidden rounded-l-lg border-2 border-gray-500 bg-white p-4 transition-transform"
			tabindex="-1"
			aria-labelledby="drawer-right-label">
			<h5
				id="drawer-right-label"
				class="mb-4 inline-flex items-center text-base font-semibold text-gray-500">
				Assistant Conversation
			</h5>
			<button
				type="button"
				id="download-conversation-button"
				class="absolute end-12 top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24">
					<path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M6 20h12M12 4v12m0 0l3.5-3.5M12 16l-3.5-3.5" />
				</svg>
				<span class="sr-only">Download Conversation</span>
			</button>
			<button
				type="button"
				data-drawer-hide="dashboard-chat-window"
				aria-controls="dashboard-chat-window"
				class="absolute end-2.5 top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900">
				<svg
					class="h-3 w-3"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 14 14">
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
				</svg>
				<span class="sr-only">Close menu</span>
			</button>

			<hr class="text-gray-500" />
			<div class="flex h-full flex-col">
				<div
					class="flex flex-grow items-end justify-center overflow-y-scroll font-semibold text-gray-500"
					v-if="getConversation.length == 0">
					<p class="text-center text-sm">
						No conversation history. To start one, say Hi! <br />Conversation is cleared
						when you refresh your browser.
						<br />
						You can download a copy of your conversation in the top right corner.
					</p>
				</div>
				<div
					class="flex-grow overflow-y-scroll px-2"
					v-else>
					<!-- the chat content and interactive bot actions -->
					<template
						v-for="(item, index) in getConversation"
						:key="index">
						<TextNode
							v-if="item.type === 'TextNode'"
							:is-source-bot="item.source === 'Bot' ? true : false"
							:text="item.text" />
						<template v-else-if="item.type === 'ActionGroupNode'">
							<ButtonNode
								v-for="(button, index) in item.buttonNodes"
								:key="index"
								:label="button.label"
								:value="button.value"
								@option-selected="(option) => handleConvActionSelected(option)" />
						</template>
					</template>
				</div>

				<!-- response form -->
				<form
					class="relative mb-2 flex max-h-[10%] min-h-[10%] w-full items-center space-x-2"
					@submit.prevent="handleConvFormSubmitted">
					<input
						type="text"
						placeholder="Type here. Press ENTER to submit..."
						class="generic-input h-[50%] w-full"
						required
						v-model.trim="userInput" />
					<button
						class="absolute end-2 my-2 inline-flex size-10 items-center justify-center rounded-lg bg-blue-600 text-slate-100">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M5.133 18.02q-.406.163-.77-.066T4 17.288v-3.942L9.846 12L4 10.654V6.712q0-.438.364-.666t.77-.067l12.512 5.269q.49.225.49.756q0 .53-.49.748z" />
						</svg>
					</button>
				</form>
			</div>
		</aside>
	</main>

	<!-- Settings modal -->
	<ParentModal
		modal-id="settings-modal"
		modal-title="Account Settings"
		v-if="isSettingsModalOpen"
		@close-modal="isSettingsModalOpen = false">
		<UpdateProfilePicture />
		<MyAccountSettings />
	</ParentModal>
</template>
<script setup lang="ts">
	const { navigationRoutes, currentScreenName } = useNavigationRoutes();
	const { getPrincipal, attemptLogout } = useAuth();
	const sidebarOpen: Ref<boolean> = ref(false);
	const isSettingsModalOpen: Ref<boolean> = ref(false);
	const userInput: Ref<string> = ref('');
	const { getConversation, appendTextTypeNode, sendBotpressMessage } = useAssistantConversation();

	// TODO: render this hack another way
	const profilePicture: Ref<string> = ref('');
	const { clientCoordinates } = useClientGeolocation();

	const handleConvFormSubmitted = () => {
		sendBotpressMessage(userInput.value);
		appendTextTypeNode(userInput.value, 'Human');
		userInput.value = '';
	};

	const handleConvActionSelected = (message: string) => {
		sendBotpressMessage(message);
		appendTextTypeNode(message, 'Human');
		userInput.value = '';
	};

	onMounted(async () => {
		// set the profile picture
		profilePicture.value = getPrincipal.value.profilePicture;
	});
</script>

<style scoped>
	::-webkit-scrollbar-thumb {
		border-radius: 10px;
	}

	/* Hide scrollbar for Chrome, Safari and Opera */
	::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	.no-scrollbar {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>
