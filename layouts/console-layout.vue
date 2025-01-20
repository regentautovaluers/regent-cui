<template>
	<main class="h-screen">
		<!-- the navigation bar on the left side -->
		<aside
			class="fixed z-20 flex h-screen max-h-screen flex-col overflow-y-auto border-r-2 bg-white transition-all duration-100 ease-out"
			:class="sidebarOpen ? 'w-[16rem] max-w-[16rem]' : 'w-16'">
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
						class="me-3 h-12"
						alt="Regent Logo" />
				</NuxtLink>
			</div>
			<!-- actual links -->
			<div class="flex-grow px-1 py-2">
				<ul class="space-y-2">
					<!-- home page -->
					<li
						class="flex h-12 w-full items-center rounded-xl px-2 text-gray-600 hover:bg-gray-300/50">
						<NuxtLink
							:to="{ name: navigationRoutes[0].routeName }"
							class="inline-flex items-center"
							:class="!sidebarOpen ? 'w-19' : 'w-full space-x-2'">
							<span>
								<HomeIcon classes="size-6 text-inherit" />
							</span>
							<span
								class="flex-grow font-semibold transition-all duration-200 ease-out"
								:class="sidebarOpen ? 'block' : 'hidden'"
								>{{ navigationRoutes[0].screenName }}</span
							>
						</NuxtLink>
					</li>

					<!-- Vehicle Valuation -->
					<li class="h-12 w-full rounded-xl px-2 text-gray-600 hover:bg-gray-300/50">
						<div class="flex size-full items-center justify-between">
							<NuxtLink
								:to="{ name: navigationRoutes[2].routeName }"
								class="inline-flex items-center"
								:class="!sidebarOpen ? 'w-19' : 'w-full space-x-2'">
								<VehicleValuationIcon classes="size-6 text-inherit" />
								<span
									class="flex-grow font-semibold transition-all duration-200 ease-out"
									:class="sidebarOpen ? 'block' : 'hidden'"
									>{{ navigationRoutes[2].screenName }}</span
								></NuxtLink
							>
							<button
								:class="sidebarOpen ? 'block' : 'hidden'"
								type="button"
								aria-controls="vehicle-valuation-dropdown"
								data-collapse-toggle="vehicle-valuation-dropdown">
								<DropdownChevronIcon />
							</button>
						</div>
					</li>
					<ul
						id="vehicle-valuation-dropdown"
						class="ml-8 hidden space-y-2"
						:class="sidebarOpen ? 'block' : 'hidden'">
						<ol class="border-s border-gray-400">
							<li
								class="group mb-7 ms-4"
								v-for="link in navigationRoutes[3].childRoutes"
								:key="link.id">
								<div
									class="absolute start-[29px] mt-1.5 size-4 rounded-full border border-white bg-gray-400 group-hover:bg-blue-600"></div>
								<NuxtLink
									class="font-normal leading-none text-gray-500"
									:to="{
										name: link.routeName,
										query: {
											client_lat: clientCoordinates.lat,
											client_lng: clientCoordinates.lng,
										},
									}"
									>{{ link.screenName }}</NuxtLink
								>
							</li>
						</ol>
					</ul>

					<!-- AVA memberships -->
					<li class="h-12 w-full rounded-xl px-2 text-gray-600 hover:bg-gray-300/50">
						<div class="flex size-full items-center justify-between">
							<NuxtLink
								:to="{ name: navigationRoutes[1].routeName }"
								class="inline-flex items-center"
								:class="!sidebarOpen ? 'w-19' : 'w-full space-x-2'">
								<MembershipsIcon classes="size-6 text-inherit" />
								<span
									class="flex-grow font-semibold transition-all duration-200 ease-out"
									:class="sidebarOpen ? 'block' : 'hidden'"
									>{{ navigationRoutes[1].screenName }}</span
								></NuxtLink
							>
							<button
								:class="sidebarOpen ? 'block' : 'hidden'"
								type="button"
								aria-controls="ava-members-dropdown"
								data-collapse-toggle="ava-members-dropdown">
								<DropdownChevronIcon />
							</button>
						</div>
					</li>
					<ul
						id="ava-members-dropdown"
						class="ml-8 hidden space-y-2"
						:class="sidebarOpen ? 'block' : 'hidden'">
						<ol class="border-s border-gray-400">
							<li
								class="group mb-7 ms-4"
								v-for="link in navigationRoutes[1].childRoutes"
								:key="link.id">
								<div
									class="absolute start-[29px] mt-1.5 size-4 rounded-full border border-white bg-gray-400 group-hover:bg-blue-600"></div>
								<NuxtLink
									class="font-normal leading-none text-gray-500"
									:to="{ name: link.routeName }"
									>{{ link.screenName }}</NuxtLink
								>
							</li>
						</ol>
					</ul>

					<!-- Roadside Assistance -->
					<li class="h-12 w-full rounded-xl px-2 text-gray-600 hover:bg-gray-300/50">
						<div class="flex size-full items-center justify-between">
							<NuxtLink
								:to="{ name: navigationRoutes[2].routeName }"
								class="inline-flex items-center"
								:class="!sidebarOpen ? 'w-19' : 'w-full space-x-2'">
								<AssistanceIcon classes="size-6 text-inherit" />
								<span
									class="flex-grow font-semibold transition-all duration-200 ease-out"
									:class="sidebarOpen ? 'block' : 'hidden'"
									>{{ navigationRoutes[2].screenName }}</span
								></NuxtLink
							>
							<button
								:class="sidebarOpen ? 'block' : 'hidden'"
								type="button"
								aria-controls="roadside-assistance-dropdown"
								data-collapse-toggle="roadside-assistance-dropdown">
								<DropdownChevronIcon />
							</button>
						</div>
					</li>
					<ul
						id="roadside-assistance-dropdown"
						class="ml-8 hidden space-y-2"
						:class="sidebarOpen ? 'block' : 'hidden'">
						<ol class="border-s border-gray-400">
							<li class="group mb-7 ms-4">
								<div
									class="absolute start-[29px] mt-1.5 size-4 rounded-full border border-white bg-gray-400 group-hover:bg-blue-600"></div>
								<NuxtLink
									class="font-normal leading-none text-gray-500"
									:to="{ name: navigationRoutes[2].childRoutes?.[0].routeName }"
									>{{ navigationRoutes[2].childRoutes?.[0].screenName }}</NuxtLink
								>
							</li>
							<li
								class="group mb-7 ms-4"
								v-for="link in navigationRoutes[2].childRoutes?.slice(1)"
								:key="link.id">
								<div
									class="absolute start-[29px] mt-1.5 size-4 rounded-full border border-white bg-gray-400 group-hover:bg-blue-600"></div>
								<NuxtLink
									class="font-normal leading-none text-gray-500"
									:to="{
										name: link.routeName,
										query: {
											client_lat: clientCoordinates.lat,
											client_lng: clientCoordinates.lng,
										},
									}"
									>{{ link.screenName }}</NuxtLink
								>
							</li>
						</ol>
					</ul>

					<!-- Carousel -->
					<SidenavCarousel v-if="sidebarOpen" />

					<!-- settings -->
					<li
						class="flex h-12 w-full items-center rounded-xl text-gray-600 hover:bg-gray-300/50">
						<button
							class="inline-flex items-center"
							:class="!sidebarOpen ? 'w-19' : 'w-full space-x-2'"
							@click="isSettingsModalOpen = true">
							<span>
								<SettingsIcon classes="size-7 text-inherit" />
							</span>
							<span
								class="flex-grow text-lg font-semibold transition-all duration-200 ease-out"
								:class="sidebarOpen ? 'block' : 'hidden'"
								>Settings</span
							>
						</button>
					</li>

					<!-- logout -->
					<li
						class="flex h-12 w-full items-center rounded-xl text-gray-600 hover:bg-gray-300/50">
						<button
							class="inline-flex items-center"
							:class="!sidebarOpen ? 'w-19' : 'w-full space-x-2'"
							@click="attemptLogout">
							<span>
								<LogoutIcon classes="size-7 text-inherit" />
							</span>
							<span
								class="flex-grow text-lg font-semibold transition-all duration-200 ease-out"
								:class="sidebarOpen ? 'block' : 'hidden'"
								>Logout</span
							>
						</button>
					</li>
				</ul>
			</div>

			<div class="flex h-12 w-full items-center justify-center">
				<button
					@click="sidebarOpen = !sidebarOpen"
					:class="sidebarOpen ? 'rotate-180' : ''"
					class="inline-flex size-7 items-center justify-center rounded-full bg-gray-500 transition-transform duration-150 ease-in-out">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M9.29 6.71a.996.996 0 0 0 0 1.41L13.17 12l-3.88 3.88a.996.996 0 1 0 1.41 1.41l4.59-4.59a.996.996 0 0 0 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01" />
					</svg>
				</button>
			</div>
		</aside>

		<!-- main UI -->
		<div
			class="min-h-screen"
			:class="sidebarOpen ? 'sidebar-open' : 'sidebar-closed'">
			<nav
				class="sticky top-0 flex min-h-20 w-full items-center border-b bg-white"
				:class="sidebarOpen && 'pl-12'"
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

						<!-- chat with AI button -->
						<button
							disabled
							class="inline-flex h-12 items-center space-x-2 rounded-full bg-pink-200/50 px-4 py-1 text-pink-600">
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
									d="m10 7l-.516 1.394c-.676 1.828-1.014 2.742-1.681 3.409s-1.581 1.005-3.409 1.681L3 14l1.394.516c1.828.676 2.742 1.015 3.409 1.681s1.005 1.581 1.681 3.409L10 21l.516-1.394c.676-1.828 1.015-2.742 1.681-3.409s1.581-1.005 3.409-1.681L17 14l-1.394-.516c-1.828-.676-2.742-1.014-3.409-1.681s-1.005-1.581-1.681-3.409zm8-4l-.221.597c-.29.784-.435 1.176-.72 1.461c-.286.286-.678.431-1.462.72L15 6l.598.221c.783.29 1.175.435 1.46.72c.286.286.431.678.72 1.462L18 9l.221-.597c.29-.784.435-1.176.72-1.461c.286-.286.678-.431 1.462-.72L21 6l-.598-.221c-.783-.29-1.175-.435-1.46-.72c-.286-.286-.431-.678-.72-1.462z"
									color="currentColor" />
							</svg>
							<span>Chat With AVA</span>
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

			<div class="flex-grow p-2">
				<slot />
			</div>
		</div>

		<!-- the notification bar on the right side -->
		<aside
			id="dashboard-sidenotif-bar"
			class="fixed right-0 top-0 z-40 h-screen w-96 translate-x-full overflow-y-auto rounded-lg border-2 border-gray-500 bg-white p-4 transition-transform"
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
	const sidebarOpen: Ref<boolean> = ref(true);
	const isSettingsModalOpen: Ref<boolean> = ref(false);
	const runtimeConfig = useRuntimeConfig();

	// TODO: render this hack another way
	const profilePicture: Ref<string> = ref('');
	const { clientCoordinates } = useClientGeolocation();

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

	.sidebar-open {
		margin-left: 255px; /* or whatever width you want for the sidebar */
	}

	.sidebar-closed {
		margin-left: 67px;
	}
</style>
