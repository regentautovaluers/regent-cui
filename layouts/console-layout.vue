<template>
	<main class="hide-scrollbar flex min-h-screen flex-col overflow-y-scroll">
		<!-- button to open/close sidebar -->
		<button
			:class="[
				'fixed top-1/2 z-30 inline-flex size-7 translate-y-1/2 cursor-pointer items-center justify-center rounded-lg border bg-gray-100 shadow-sm',
				!getSidebarCollapsedState ? 'laptop-lg:left-[50px] left-[10px]' : 'left-[235px]',
			]"
			@click="toggleSidebarCollapsedState()">
			<span
				:class="[
					'icon-[material-symbols-light--keyboard-double-arrow-right-rounded] text-xl text-gray-500 transition-transform duration-300 ease-linear',
					getSidebarCollapsedState ? 'rotate-180' : 'rotate-0',
				]"></span>
		</button>
		<aside
			:class="[
				'hide-scrollbar fixed z-10 flex h-screen max-h-screen flex-col justify-between overflow-y-scroll border-r-[.5px] bg-white',
				!getSidebarCollapsedState
					? 'laptop-lg:-translate-x-0 w-[65px] -translate-x-[65px]'
					: 'w-[250px] -translate-x-0',
			]">
			<div>
				<!-- user profile info -->
				<div
					:class="[
						'mx-2 mt-2 flex items-center rounded-lg py-2',
						getSidebarCollapsedState && 'space-x-3 bg-gray-200 px-2',
					]">
					<UserAvatar />
					<div
						class="hidden h-full flex-col overflow-hidden md:flex"
						v-show="getSidebarCollapsedState">
						<h1
							class="overflow-clip text-sm text-ellipsis whitespace-nowrap text-gray-500">
							{{ getPrincipal?.username }}
						</h1>
						<h2
							class="overflow-clip text-xs font-semibold text-ellipsis whitespace-nowrap text-gray-500">
							{{ getPrincipal?.corpName }}
						</h2>
					</div>
				</div>

				<ul class="mt-4 space-y-4">
					<template
						v-for="(link, index) in navigationRoutes.filter((r) => r.renderRoute)"
						:key="index">
						<li
							:class="[
								'relative mx-2 flex h-12 items-center rounded-xl py-5 text-gray-600 transition-colors duration-200 ease-out hover:bg-gray-300/50 hover:text-gray-600',
								fuzzyRouteNameMatch(link.routeName, link) && 'space-x-4',
							]">
							<div
								:class="[
									'absolute -left-2 h-10 max-h-10 w-[4px] max-w-[4px] min-w-[4px] rounded-full',
									fuzzyRouteNameMatch(link.routeName, link)
										? 'bg-blue-600'
										: 'hidden',
								]"></div>
							<NuxtLink
								:to="{ name: link.routeName }"
								:class="[
									'inline-flex size-full max-h-12 max-w-full justify-center',
									!getSidebarCollapsedState
										? 'w-19'
										: 'w-full flex-row items-center justify-center space-x-2',
								]">
								<span class="place-self-center">
									<span :class="['text-[30px]', link.icon]"></span>
								</span>
								<span
									:class="[
										'flex-grow text-sm',
										!getSidebarCollapsedState && 'hidden',
									]"
									>{{ link.screenName }}
								</span>
							</NuxtLink>
							<button
								v-if="
									link.childRoutes &&
									link.childRoutes?.filter((x) => x.renderRoute).length > 0
								"
								:class="
									getSidebarCollapsedState
										? 'block rounded-full pr-4 outline-none'
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
							:class="getSidebarCollapsedState ? 'block' : 'hidden'">
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
			</div>

			<!-- Carousel -->
			<div class="h-fit px-5">
				<ClientOnly>
					<ImageCarousel
						v-show="getSidebarCollapsedState"
						:images="[
							'/images/slides/sidebar/1.jpg',
							'/images/slides/sidebar/2.jpg',
							'/images/slides/sidebar/3.jpg',
						]"
						:links="[
							{
								text: 'Get our 70MAI Dashcams',
								to: 'https://regenttrack.co.ke/product/70mai-m500-dash-cam/',
							},
							{
								text: 'Request Tracking',
								to: 'https://regenttrack.co.ke/vehicle-tracking/',
							},
							{
								text: 'Get our 70MAI Dashcams',
								to: 'https://regenttrack.co.ke/product/70mai-a400-dash-cam/',
							},
						]"
						carousel-height="h-[250px]"
						control-buttons-position="top-4" />
				</ClientOnly>
			</div>

			<!-- sidebar footer -->
			<footer class="h-fit w-full space-y-5 pb-5 text-sm text-gray-600">
				<!-- notifs, logout and settings -->
				<ul class="w-full px-2">
					<!-- notifs -->
					<li
						class="flex h-12 w-full items-center justify-center rounded-xl px-2 text-gray-600 hover:bg-gray-300/50">
						<button
							class="inline-flex size-full cursor-pointer items-center space-x-3"
							:class="!getSidebarCollapsedState && 'w-19 justify-center'"
							@click="attemptLogout">
							<span
								class="icon-[material-symbols-light--notifications-rounded] size-7 text-inherit"></span>
							<span
								class="text-sm transition-all duration-200 ease-out"
								:class="getSidebarCollapsedState ? 'block' : 'hidden'"
								>Notifications</span
							>
						</button>
					</li>

					<!-- settings -->
					<li
						class="flex h-12 w-full items-center rounded-xl px-2 text-gray-600 hover:bg-gray-300/50">
						<NuxtLink
							:to="{ name: 'settings-my-account' }"
							:class="[
								'inline-flex size-full items-center justify-start',
								!getSidebarCollapsedState ? 'w-19 justify-center' : 'space-x-3',
							]">
							<SettingsIcon classes="size-6 text-inherit" />
							<span
								class="text-sm transition-all duration-200 ease-out"
								:class="getSidebarCollapsedState ? 'block' : 'hidden'"
								>Settings</span
							>
						</NuxtLink>
					</li>

					<!-- logout -->
					<li
						class="flex h-12 w-full items-center justify-center rounded-xl px-2 text-gray-600 hover:bg-gray-300/50">
						<button
							class="inline-flex size-full cursor-pointer items-center space-x-3"
							:class="!getSidebarCollapsedState && 'w-19 justify-center'"
							@click="attemptLogout">
							<LogoutIcon classes="size-6 text-inherit" />
							<span
								class="text-sm transition-all duration-200 ease-out"
								:class="getSidebarCollapsedState ? 'block' : 'hidden'"
								>Logout</span
							>
						</button>
					</li>
				</ul>

				<div
					v-show="getSidebarCollapsedState"
					class="text-center">
					<h1>Regent Auto Valuers</h1>
					<h2>
						<span>&copy; 2025.</span>
						<span> All Rights Reserved</span>
					</h2>
				</div>
			</footer>
		</aside>
		<div
			:class="[
				'ease-liner flex flex-1 flex-col bg-[#f8faf8] transition-all duration-300',
				getSidebarCollapsedState
					? 'laptop-lg:translate-x-0 laptop-lg:ml-[250px] translate-x-[250px]'
					: 'laptop-lg:ml-[65px]',
			]">
			<NuxtPage />
		</div>

		<div
			data-popover
			id="notification-popover"
			role="tooltip"
			class="tablet:w-[28rem] laptop invisible absolute z-50 inline-block h-1/2 max-h-1/2 w-full -translate-x-5 translate-y-[05px] rounded-lg border border-gray-200 bg-white text-sm text-gray-500 opacity-0 shadow-xs transition-opacity duration-300">
			<div class="h-[10%] rounded-t-lg border-b border-gray-200 bg-gray-100 p-3">
				<h3 class="text-lg font-semibold text-gray-500">Notifications</h3>
			</div>
			<div class="thin-scrollbar h-[90%] overflow-auto">
				<!-- <div
					class="flex h-20 items-start space-x-3 p-3 hover:bg-gray-100"
					v-for="(e, index) in notifications"
					:key="index">
					<div
						:class="[
							'mt-1 size-2 min-h-2 min-w-2 rounded-full shadow-sm',
							e.isNew && 'bg-blue-600',
						]"></div>
					<div class="flex-grow text-sm">
						<h1 class="text-gray-600">{{ e.message }}</h1>
						<h2 class="inline-flex items-center space-x-2 text-gray-400">
							<span>{{ calculateTimePassed(e.timestamp).durationPassed }}</span>
							<template v-if="e.data.source"
								><span class="text-xl">&middot;</span>
								<span>{{ e.data.source ?? 'Unknown Source' }}</span></template
							>
						</h2>
					</div>
				</div> -->
			</div>
		</div>
	</main>
</template>
<script setup lang="ts">
	const { navigationRoutes, doesRouteNameMatch, fuzzyRouteNameMatch } = useNavigationRoutes();

	const { attemptLogout } = useAuth();
	const userInput: Ref<string> = ref('');
	const { getPrincipal } = useAuth();
	// const {
	// 	user,
	// 	isAuthenticated,
	// 	dataList,
	// 	authError,
	// 	dataError,
	// 	signIn,
	// 	logOut,
	// 	fetchData,
	// 	// writeData,
	// 	deleteData,
	// } = useFirebaseRTDB();

	const config = useRuntimeConfig();

	// const notifications = computed(() =>
	// 	dataList.value
	// 		.sort((e1, e2) => {
	// 			if (e1.timestamp < e2.timestamp) {
	// 				return 1; // a comes after b
	// 			}
	// 			if (e1.timestamp > e2.timestamp) {
	// 				return -1; // a comes before b
	// 			}
	// 			return 0; // timestamps are equal
	// 		})
	// 		.map((e) => {
	// 			const timeMeta = calculateTimePassed(e.timestamp);
	// 			return { ...e, ...timeMeta };
	// 		}),
	// );

	// onMounted(() => {
	// 	// Fetch notifications only after Firebase authentication
	// 	watch(
	// 		isAuthenticated,
	// 		(isAuth) => {
	// 			if (isAuth && user.value) {
	// 				fetchData(`ERP/General/${getPrincipal.value?.corpId}`);
	// 			} else {
	// 				signIn(config.public.FIREBASE_EMAIL, config.public.FIREBASE_PASSWORD);
	// 			}
	// 		},
	// 		{ immediate: true },
	// 	);
	// });
</script>
