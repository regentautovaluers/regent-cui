<template>
	<div class="relative flex min-h-screen flex-col">
		<nav
			class="fixed top-0 z-40 flex h-[75px] min-h-[75px] w-full items-center justify-between bg-white">
			<div class="flex items-center space-x-2">
				<button
					class="inline-flex size-10 items-center justify-center rounded-full outline-none"
					@click="() => (sidebarOpen = !sidebarOpen)">
					<MenuButtonIcon />
				</button>
				<img
					src="/images/app-logo.png"
					class="tablet:h-9 h-8"
					alt="Regent Logo" />
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
						viewBox="0 0 24 24"
						class="tablet:size-9 size-8 text-inherit">
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
				<!-- <button
					class="rounded-lg p-2 text-pink-500 transition-all duration-150 ease-linear hover:bg-pink-600 hover:text-slate-100"
					type="button"
					data-drawer-target="dashboard-chat-window"
					data-drawer-show="dashboard-chat-window"
					data-drawer-placement="right"
					data-drawer-backdrop="false"
					aria-controls="dashboard-chat-window">
					
					<ChatIcon />
				</button> -->

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
		<main class="hide-scrollbar mt-[75px] flex min-h-screen flex-grow overflow-x-scroll">
			<aside
				:class="[
					'hide-scrollbar fixed z-40 flex h-[calc(100vh-3.5rem)] max-h-[calc(100%-3.5rem)] flex-col justify-between overflow-y-scroll border-r-[.5px] bg-white py-5',
					!sidebarOpen
						? 'laptop-lg:-translate-x-0 w-[60px] -translate-x-[60px]'
						: 'w-68 -translate-x-0',
				]">
				<!-- links -->
				<div
					:class="[
						'flex flex-grow flex-col justify-between',
						sidebarOpen ? 'px-5' : 'px-2',
					]">
					<ul class="space-y-4">
						<template
							v-for="(link, index) in navigationRoutes"
							:key="index">
							<li
								:class="[
									'flex h-11 w-full items-center rounded-lg px-2 py-5 text-gray-600 transition-colors duration-200 ease-out hover:bg-gray-300/50 hover:text-gray-600',
									fuzzyRouteNameMatch(link.routeName, link) &&
										'bg-blue-600 text-white',
								]"
								:title="link.screenName">
								<NuxtLink
									:to="{ name: link.routeName }"
									class="inline-flex size-full items-center justify-center"
									:class="!sidebarOpen ? 'w-19' : 'w-full space-x-2'">
									<span>
										<template v-if="link.routeName == 'mobivaluer-home'">
											<HomeIcon classes="size-5 text-inherit" />
										</template>
										<template
											v-else-if="link.routeName == 'ava-memberships-home'">
											<AssistanceIcon classes="size-5 text-inherit" />
										</template>
										<template
											v-else-if="link.routeName == 'vehicle-valuation-home'">
											<VehicleValuationIcon classes="size-5 text-inherit" />
										</template>
										<template
											v-else-if="
												link.routeName ==
												'collateral-verification-query-collateral'
											">
											<FraudDetectionIcon classes="size-5 text-inherit" />
										</template>
										<template
											v-else-if="link.routeName == 'regent-tracking-home'">
											<VehicleTrackingIcon classes="size-5 text-inherit" />
										</template>
										<template
											v-else-if="
												link.routeName == 'emergency-evacuation-home'
											">
											<EmergencyRescueIcon classes="size-5 text-inherit" />
										</template>
										<template
											v-else-if="
												link.routeName == 'accident-management-home'
											">
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
										:class="sidebarOpen ? 'block' : 'hidden'"
										>{{ link.screenName }}
									</span>
								</NuxtLink>
								<button
									v-if="
										link.childRoutes &&
										link.childRoutes?.filter((x) => x.renderRoute).length > 0
									"
									:class="
										sidebarOpen
											? 'block rounded-full p-1 outline-none'
											: 'hidden'
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
								:class="sidebarOpen ? 'block' : 'hidden'">
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
					<ClientOnly>
						<ImageCarousel
							v-show="sidebarOpen"
							:images="[
								'/images/slides/landingpage/1.jpg',
								'/images/slides/landingpage/2.jpg',
								'/images/slides/landingpage/3.jpg',
								'/images/slides/landingpage/4.jpg',
							]"
							carousel-height="h-68"
							control-buttons-position="top-4" />
					</ClientOnly>

					<ul class="space-y-2">
						<!-- settings -->
						<li
							class="flex h-12 w-full items-center rounded-xl text-gray-600 hover:bg-gray-300/50">
							<NuxtLink
								:to="{ name: 'settings-my-account' }"
								class="inline-flex size-full items-center justify-start space-x-3"
								:class="!sidebarOpen && 'w-19 justify-center'">
								<SettingsIcon classes="size-5 text-inherit" />
								<span
									class="text-sm transition-all duration-200 ease-out"
									:class="sidebarOpen ? 'block' : 'hidden'"
									>Settings</span
								>
							</NuxtLink>
						</li>

						<!-- logout -->
						<li
							class="flex h-12 w-full items-center rounded-xl text-gray-600 hover:bg-gray-300/50">
							<button
								class="inline-flex size-full items-center space-x-3"
								:class="!sidebarOpen && 'w-19 justify-center'"
								@click="attemptLogout">
								<LogoutIcon classes="size-5 text-inherit" />
								<span
									class="text-sm transition-all duration-200 ease-out"
									:class="sidebarOpen ? 'block' : 'hidden'"
									>Logout</span
								>
							</button>
						</li>
					</ul>
				</div>

				<!-- sidebar footer -->
				<footer
					class="h-12 w-full px-5 pb-5 text-sm text-gray-600"
					v-show="sidebarOpen">
					<h1>Regent Auto Valuers</h1>
					<h2>
						<span>&copy; 2025.</span>
						<span> All Rights Reserved</span>
					</h2>
				</footer>
			</aside>
			<div
				:class="[
					'flex flex-1 flex-col',
					sidebarOpen
						? 'laptop-lg:translate-x-0 laptop-lg:ml-68 translate-x-68'
						: 'laptop-lg:ml-[60px]',
				]"
				@click="() => (sidebarOpen = false)">
				<NuxtPage />
			</div>
		</main>
	</div>
</template>
<script setup lang="ts">
	const { navigationRoutes, currentScreenName, fuzzyRouteNameMatch, doesRouteNameMatch } =
		useNavigationRoutes();

	const { getPrincipal, attemptLogout } = useAuth();
	const sidebarOpen: Ref<boolean> = ref(false);
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
