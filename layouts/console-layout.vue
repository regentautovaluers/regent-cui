<template>
	<aside
		:class="[
			'mobile-sm:-translate-x-full desktop-4k:-translate-x-0 fixed left-0 z-40 flex h-screen max-h-screen flex-col overflow-y-scroll border-r bg-white transition-all duration-200 ease-out',
			sidebarExpanded ? 'w-68' : 'w-[60px]',
		]">
		<!-- logo on top part of sidebar -->
		<div class="flex h-[70px] w-full items-center p-4 text-center">
			<NuxtLink
				:to="{ name: 'mobivaluer-home' }"
				class="flex items-center"
				v-if="sidebarExpanded">
				<img
					src="/images/app-logo.png"
					class="h-12"
					alt="Regent Logo" />
			</NuxtLink>
			<NuxtLink
				v-else
				:to="{ name: 'mobivaluer-home' }"
				class="flex items-center">
				<img
					src="/images/app-logo-small.png"
					class="size-full"
					alt="Regent Logo" />
			</NuxtLink>
		</div>
		<!-- actual links -->
		<div
			:class="[
				'flex flex-grow flex-col justify-between py-5',
				sidebarExpanded ? 'px-5' : 'px-2',
			]">
			<ul class="space-y-4">
				<template
					v-for="(link, index) in navigationRoutes"
					:key="index">
					<li
						:class="[
							'flex h-11 w-full items-center rounded-lg px-2 py-5 text-gray-600 transition-colors duration-200 ease-out hover:bg-gray-300/50 hover:text-gray-600',
							fuzzyRouteNameMatch(link.routeName, link) && 'bg-blue-600 text-white',
						]"
						:title="link.screenName">
						<NuxtLink
							:to="{ name: link.routeName }"
							class="inline-flex size-full items-center justify-center"
							:class="!sidebarExpanded ? 'w-19' : 'w-full space-x-2'">
							<span>
								<template v-if="link.routeName == 'mobivaluer-home'">
									<HomeIcon classes="size-5 text-inherit" />
								</template>
								<template v-else-if="link.routeName == 'ava-memberships-home'">
									<MembershipsIcon classes="size-5 text-inherit" />
								</template>
								<template v-else-if="link.routeName == 'ra-all-incidents'">
									<AssistanceIcon classes="size-5 text-inherit" />
								</template>
								<template v-else-if="link.routeName == 'vehicle-valuation-home'">
									<VehicleValuationIcon classes="size-5 text-inherit" />
								</template>
								<template
									v-else-if="
										link.routeName == 'fraud-detection-query-fraudsters'
									">
									<FraudDetectionIcon classes="size-5 text-inherit" />
								</template>
								<template v-else-if="link.routeName == 'regent-tracking-home'">
									<VehicleTrackingIcon classes="size-5 text-inherit" />
								</template>
								<template v-else-if="link.routeName == 'emergency-evacuation-home'">
									<EmergencyRescueIcon classes="size-5 text-inherit" />
								</template>
								<template v-else-if="link.routeName == 'accident-management-home'">
									<AccidentManagementIcon classes="size-5 text-inherit" />
								</template>
								<template v-else-if="link.routeName == 'garage-home'">
									<GarageIcon classes="size-5 text-inherit" />
								</template>
								<template v-else-if="link.routeName == 'parts-home'">
									<PartsIcon classes="size-5 text-inherit" />
								</template>
							</span>
							<span
								class="flex-grow text-sm font-semibold transition-all duration-200 ease-out"
								:class="sidebarExpanded ? 'block' : 'hidden'"
								>{{ link.screenName }}
							</span>
						</NuxtLink>

						<button
							v-if="
								link.childRoutes &&
								link.childRoutes?.filter((x) => x.renderRoute).length > 0
							"
							:class="
								sidebarExpanded ? 'block rounded-full p-1 outline-none' : 'hidden'
							"
							type="button"
							:aria-controls="`${link.routeName}-dropdown`"
							:data-collapse-toggle="`${link.routeName}-dropdown`">
							<DropdownChevronIcon />
						</button>
					</li>
					<ul
						v-if="link.childRoutes"
						:id="`${link.routeName}-dropdown`"
						class="ml-5 hidden space-y-2"
						:class="sidebarExpanded ? 'block' : 'hidden'">
						<ol class="border-s border-gray-400">
							<li
								class="group relative ms-4 mb-7"
								v-for="(childLink, index) in link.childRoutes"
								:key="index">
								<template v-if="childLink.renderRoute">
									<div
										:class="[
											'absolute -left-[23px] mt-[3px] h-5 w-3 rounded-full border border-white group-hover:bg-blue-600',
											doesRouteNameMatch(childLink.routeName)
												? 'bg-blue-600'
												: 'bg-gray-400',
										]"></div>
									<NuxtLink
										:class="[
											'text-sm leading-none font-normal',
											doesRouteNameMatch(childLink.routeName)
												? 'font-semibold text-blue-600'
												: 'text-gray-500',
										]"
										:to="{
											name: childLink.routeName,
										}"
										>{{ childLink.screenName }}</NuxtLink
									>
								</template>
							</li>
						</ol>
					</ul>
				</template>
			</ul>
			<!-- Carousel -->
			<SidenavCarousel v-if="sidebarExpanded" />

			<ul class="space-y-2">
				<!-- settings -->
				<li
					class="flex h-12 w-full items-center rounded-xl text-gray-600 hover:bg-gray-300/50">
					<button
						class="inline-flex size-full items-center justify-start space-x-3"
						:class="!sidebarExpanded && 'w-19 justify-center'"
						data-modal-target="settings-modal"
						data-modal-toggle="settings-modal">
						<SettingsIcon classes="size-5 text-inherit" />
						<span
							class="text-sm transition-all duration-200 ease-out"
							:class="sidebarExpanded ? 'block' : 'hidden'"
							>Settings</span
						>
					</button>
				</li>

				<!-- logout -->
				<li
					class="flex h-12 w-full items-center rounded-xl text-gray-600 hover:bg-gray-300/50">
					<button
						class="inline-flex size-full items-center space-x-3"
						:class="!sidebarExpanded && 'w-19 justify-center'"
						@click="attemptLogout">
						<LogoutIcon classes="size-5 text-inherit" />
						<span
							class="text-sm transition-all duration-200 ease-out"
							:class="sidebarExpanded ? 'block' : 'hidden'"
							>Logout</span
						>
					</button>
				</li>
			</ul>
		</div>

		<div
			class="h-12 w-full px-5 pb-5 text-sm text-gray-600"
			v-if="sidebarExpanded">
			<h1>Regent Auto Valuers</h1>
			<h2>
				<span>&copy; 2025.</span>
				<span> All Rights Reserved</span>
			</h2>
		</div>
	</aside>
	<main
		:class="[
			'mobile-sm:pl-0 flex h-screen min-h-screen flex-col overflow-auto transition-all duration-200 ease-out',
			sidebarExpanded ? 'desktop-4k:pl-68' : 'desktop-4k:pl-[60px]',
		]"
		style="background-color: #f8faf8">
		<nav
			class="sticky top-0 z-20 flex h-[7%] max-h-[7%] min-h-[7%] w-full items-center justify-between border-b bg-white px-2"
			id="top-nav">
			<div class="flex items-center space-x-2 text-gray-700">
				<button
					class="text-inherit"
					@click="sidebarExpanded = !sidebarExpanded">
					<MenuButtonIcon />
				</button>
				<h1 class="w-fit text-lg font-semibold md:text-2xl">
					{{ currentScreenName }}
				</h1>
			</div>
			<div
				class="flex h-[70%] flex-grow items-center justify-center"
				id="custom-search-box">
				<!-- any thing can teleport anything here. for now, it's being used by pages for a search bar -->
			</div>
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
							<path d="M8 19c.458 1.725 2.076 3 4 3c1.925 0 3.541-1.275 4-3" />
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
				<div class="flex w-fit max-w-48 items-center space-x-3 px-2 py-1 md:max-w-48">
					<UserAvatar />
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
		</nav>

		<!-- The main UIs for all pages. Let all pages decide their own height. -->
		<slot />
	</main>

	<!-- the notification bar on the right side -->
	<aside
		id="dashboard-sidenotif-bar"
		class="fixed top-0 right-0 z-50 h-screen w-96 translate-x-full overflow-y-auto rounded-l-lg border-2 border-gray-500 bg-white p-4 transition-transform"
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
		class="fixed top-0 right-0 z-50 h-screen w-lg translate-x-full overflow-y-hidden rounded-l-lg border-2 border-gray-500 bg-white p-4 transition-transform"
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

	<!-- Settings modal -->
	<ParentModal
		modal-id="settings-modal"
		modal-title="Account Settings">
		<MyAccountSettings />
	</ParentModal>
</template>
<script setup lang="ts">
	const { navigationRoutes, currentScreenName, fuzzyRouteNameMatch, doesRouteNameMatch } =
		useNavigationRoutes();
	const { getPrincipal, attemptLogout } = useAuth();
	const sidebarExpanded: Ref<boolean> = ref(false);
	const userInput: Ref<string> = ref('');
	const { getConversation, appendTextTypeNode, sendBotpressMessage } = useAssistantConversation();

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
