<template>
	<main class="flex h-screen flex-col">
		<div class="sticky top-0 z-40 flex max-h-20 min-h-20 items-center border-b bg-white">
			<div class="w-fit lg:w-[20rem]">
				<button
					data-drawer-target="system-sidebar"
					data-drawer-toggle="system-sidebar"
					aria-controls="system-sidebar"
					type="button"
					class="ms-3 mt-2 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
					<span class="sr-only">Open sidebar</span>
					<svg
						class="h-6 w-6"
						aria-hidden="true"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg">
						<path
							clip-rule="evenodd"
							fill-rule="evenodd"
							d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
					</svg>
				</button>
			</div>
			<div class="flex h-full flex-grow items-center justify-between px-4">
				<h1 class="text-lg font-extrabold md:text-3xl">{{ currentScreenName }}</h1>
				<div class="md:w-4max-w-48 flex w-fit max-w-48 items-center space-x-3">
					<img
						class="h-12 min-h-12 w-12 min-w-12 rounded-full object-cover"
						:src="profilePicture"
						alt="User Avatar" />
					<div class="hidden h-full flex-col overflow-hidden md:flex">
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

		<aside
			id="system-sidebar"
			class="fixed left-0 top-0 z-40 h-screen w-[20rem] -translate-x-full overflow-y-auto bg-white shadow-md transition-transform xl:translate-x-0"
			aria-label="Sidebar">
			<div class="flex h-full flex-col bg-white px-3">
				<div class="sticky top-0 z-30 flex min-h-20 items-center border-b bg-white">
					<NuxtLink
						:to="{ name: 'mobivaluer-home' }"
						class="flex items-center ps-2.5">
						<img
							src="/images/app-logo.png"
							class="me-3 h-10"
							alt="Regent Logo" />
						<span class="self-center whitespace-nowrap text-xl font-semibold"
							>Regent Valuers</span
						>
					</NuxtLink>
				</div>
				<div class="flex-grow">
					<ul class="mt-1 space-y-3 font-medium">
						<li>
							<NuxtLink
								:to="{ name: navigationRoutes[0].routeName }"
								class="group inline-flex w-full items-center rounded-lg p-2 hover:bg-gray-100">
								<HomeIcon
									classes="flex-shrink-0 size-7 transition duration-75 text-gray-500 group-hover:text-blue-600" />
								<span
									class="ms-3 font-semibold text-gray-500 group-hover:text-blue-600"
									>{{ navigationRoutes[0].screenName }}</span
								>
							</NuxtLink>
						</li>
						<li>
							<div>
								<div class="inline-flex w-full items-center">
									<NuxtLink
										:to="{ name: navigationRoutes[3].routeName }"
										class="group inline-flex w-[90%] items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100">
										<VehicleValuationIcon
											classes="flex-shrink-0 size-7 transition duration-75 text-gray-500 group-hover:text-blue-600" />
										<span
											class="ms-3 font-semibold text-gray-500 group-hover:text-blue-600"
											>{{ navigationRoutes[3].screenName }}</span
										>
									</NuxtLink>
									<button
										type="button"
										class="inline-flex flex-grow items-center justify-center"
										aria-controls="vehicle-valuation-dropdown"
										data-collapse-toggle="vehicle-valuation-dropdown">
										<DropdownChevronIcon />
									</button>
								</div>
								<ul
									id="vehicle-valuation-dropdown"
									class="ml-8 hidden space-y-2">
									<ol class="relative border-s border-gray-400">
										<li
											class="group mb-7 ms-4"
											v-for="link in navigationRoutes[3].childRoutes"
											:key="link.id">
											<div
												class="absolute -start-2 mt-1.5 size-4 rounded-full border border-white bg-gray-400 group-hover:bg-blue-600"></div>
											<NuxtLink
												class="font-normal leading-none text-gray-500"
												:to="{ name: link.routeName }"
												>{{ link.screenName }}</NuxtLink
											>
										</li>
									</ol>
								</ul>
							</div>
						</li>
						<li>
							<div>
								<div class="inline-flex w-full items-center">
									<NuxtLink
										:to="{ name: navigationRoutes[1].routeName }"
										class="group inline-flex w-[90%] items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100">
										<MembershipsIcon
											classes="flex-shrink-0 size-7 transition duration-75 text-gray-500 group-hover:text-blue-600" />
										<span
											class="ms-3 font-semibold text-gray-500 group-hover:text-blue-600"
											>{{ navigationRoutes[1].screenName }}</span
										>
									</NuxtLink>
									<button
										type="button"
										class="inline-flex flex-grow items-center justify-center"
										aria-controls="ava-members-dropdown"
										data-collapse-toggle="ava-members-dropdown">
										<DropdownChevronIcon />
									</button>
								</div>
								<ul
									id="ava-members-dropdown"
									class="ml-8 hidden space-y-2">
									<ol class="relative border-s border-gray-400">
										<li
											class="group mb-7 ms-4"
											v-for="link in navigationRoutes[1].childRoutes"
											:key="link.id">
											<div
												class="absolute -start-2 mt-1.5 size-4 rounded-full border border-white bg-gray-400 group-hover:bg-blue-600"></div>
											<NuxtLink
												class="font-normal leading-none text-gray-500"
												:to="{ name: link.routeName }"
												>{{ link.screenName }}</NuxtLink
											>
										</li>
									</ol>
								</ul>
							</div>
						</li>
						<li>
							<div>
								<div class="inline-flex w-full items-center">
									<NuxtLink
										:to="{ name: navigationRoutes[2].routeName }"
										class="group inline-flex w-[90%] items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100">
										<AssistanceIcon
											classes="flex-shrink-0 size-7 transition duration-75 text-gray-500 group-hover:text-blue-600" />
										<span
											class="ms-3 font-semibold text-gray-500 group-hover:text-blue-600"
											>{{ navigationRoutes[2].screenName }}</span
										>
									</NuxtLink>
									<button
										type="button"
										class="inline-flex flex-grow items-center justify-center"
										aria-controls="roadside-assistance-dropdown"
										data-collapse-toggle="roadside-assistance-dropdown">
										<DropdownChevronIcon />
									</button>
								</div>
								<ul
									id="roadside-assistance-dropdown"
									class="ml-8 hidden space-y-2">
									<ol class="relative border-s border-gray-400">
										<li class="group mb-7 ms-4">
											<div
												class="absolute -start-2 mt-1.5 size-4 rounded-full border border-white bg-gray-400 group-hover:bg-blue-600"></div>
											<NuxtLink
												class="font-normal leading-none text-gray-500"
												:to="{
													name: navigationRoutes[2].childRoutes?.[0]
														.routeName,
												}"
												>{{
													navigationRoutes[2].childRoutes?.[0].screenName
												}}</NuxtLink
											>
										</li>
										<li
											class="group mb-7 ms-4"
											v-for="link in navigationRoutes[2].childRoutes?.slice(
												1,
											)"
											:key="link.id">
											<div
												class="absolute -start-2 mt-1.5 size-4 rounded-full border border-white bg-gray-400 group-hover:bg-blue-600"></div>
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
							</div>
						</li>
					</ul>

					<!-- Carousel -->
					<SidenavCarousel />
					<!-- End of Carousel -->
					<ul class="mt-1 space-y-3 font-medium">
						<li>
							<button
								class="group inline-flex w-full items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100"
								type="button"
								@click="isSettingsModalOpen = true">
								<SettingsIcon
									classes="flex-shrink-0 size-7 transition duration-75 text-gray-500 group-hover:text-blue-600" />
								<span
									class="ms-3 font-semibold text-gray-500 group-hover:text-blue-600"
									>Settings</span
								>
							</button>
						</li>
						<li>
							<button
								class="group inline-flex w-full items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100"
								type="button"
								@click.prevent="attemptLogout">
								<LogoutIcon
									classes="flex-shrink-0 size-7 transition duration-75 text-gray-500 group-hover:text-blue-600" />
								<span
									class="ms-3 font-semibold text-gray-500 group-hover:text-blue-600"
									>Logout</span
								>
							</button>
						</li>
					</ul>
				</div>
				<div class="text-sm text-gray-500">
					<h1 class="font-semibold">Regent Valuers Limited</h1>
					<div class="flex h-fit space-x-1">
						<span
							>&copy; {{ runtimeConfig.public.COPYRIGHT_YEAR }} All Rights
							Reserved</span
						>
						<span>&middot;</span>
						<span>{{ runtimeConfig.public.APP_VERSION }}</span>
					</div>
				</div>
			</div>
		</aside>

		<div class="flex-grow p-2 lg:ml-[20rem] lg:p-4">
			<slot />
		</div>
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
	const isSettingsModalOpen: Ref<boolean> = ref(false);
	const runtimeConfig = useRuntimeConfig();
	const route = useRoute();

	// TODO: render this hack another way
	const profilePicture: Ref<string> = ref('');
	const { getClientLocation, clientCoordinates } = useClientGeolocation();

	onMounted(async () => {
		// set the profile picture
		profilePicture.value = getPrincipal.value.profilePicture;

		// get the client's location
		try {
			const clientCoords = await getClientLocation();
			clientCoordinates.value = clientCoords;
		} catch (error) {
			console.error(error);
		}
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
