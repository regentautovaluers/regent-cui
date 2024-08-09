<template>
	<main class="h-screen">
		<nav
			class="sticky top-0 z-20 flex flex-wrap items-center justify-between bg-white px-3 py-4 md:pr-[20px] lg:pl-[340px]">
			<div class="flex w-fit space-x-8 lg:w-1/3">
				<!-- Navigation Toggle -->
				<button
					type="button"
					class="lg:hidden"
					data-hs-overlay="#docs-sidebar"
					aria-controls="docs-sidebar"
					aria-label="Toggle navigation">
					<span class="sr-only">Toggle Navigation</span>
					<img
						src="/images/topnav/hamburger-menu-icon.svg"
						alt="Hamburger Menu Icon" />
				</button>
				<!-- End Navigation Toggle -->
				<h1 class="whitespace-nowrap text-2xl font-semibold md:text-3xl">
					{{ currentRoute || computedCurrentRoute }}
				</h1>
			</div>

			<!-- div with notifications, messages and profile information -->
			<div
				class="mt-2 flex w-full items-center justify-between space-x-3 md:mt-0 md:w-1/3 md:justify-end">
				<!-- notifications & messages -->
				<div class="hs-tooltip mr-4 flex space-x-3 [--placement:bottom] [--trigger:click]">
					<button
						class="hs-tooltip-toggle relative flex size-10 h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-gray-300 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50">
						<img
							src="/images/topnav/notification-icon.svg"
							alt="Chat Icon" />
						<span
							class="absolute -right-3 -top-2 inline-flex size-7 items-center justify-center rounded-full bg-pink-600 p-2 text-xs font-medium text-white"
							>{{ notificationCount }}</span
						>
					</button>
					<div
						class="hs-tooltip-content invisible absolute z-20 inline-block h-[50rem] w-[27rem] rounded-xl border bg-[#f6f9f2] text-sm text-gray-600 opacity-0 shadow-md transition-opacity hs-tooltip-shown:visible hs-tooltip-shown:opacity-100"
						role="tooltip">
						<h1 class="m-4 text-xl font-semibold">Notification Drawer</h1>
						<hr />
					</div>
				</div>

				<ClientOnly
					><!-- profile information chip -->
					<div class="flex items-center space-x-4">
						<img
							class="size-[50px] rounded-full object-cover"
							:src="profilePicture"
							alt="Profile Picture" />
						<div class="flex flex-col">
							<span class="tracking whitespace-nowrap font-bold">{{
								getPrincipal.username
							}}</span>
							<span class="text-gray-500">{{ getPrincipal.corpName }}</span>
						</div>
					</div></ClientOnly
				>
			</div>
			<!-- end of div with notifications, messages and profile information mentioned above -->
		</nav>
		<div
			id="docs-sidebar"
			class="hs-overlay fixed bottom-0 start-0 top-0 z-[60] hidden w-80 -translate-x-full transform overflow-y-auto border-e border-gray-200 bg-white pb-10 transition-all duration-300 hs-overlay-open:translate-x-0 lg:bottom-0 lg:end-auto lg:block lg:translate-x-0">
			<div class="sticky top-0 z-20 bg-white py-4">
				<NuxtLink
					:to="{ name: 'dashboard-home' }"
					aria-label="Brand"
					><img
						src="/images/regent-autovaluers-logo.svg"
						class="object-cover md:w-[90%]"
						alt="Regent Logo"
				/></NuxtLink>
			</div>
			<div
				class="hs-accordion-group flex w-full flex-col flex-wrap pl-2"
				data-hs-accordion-always-open>
				<ul class="space-y-1.5">
					<!-- 'Home' route -->
					<ChildlessParentRoute
						:display-name="applicationRoutes[0].displayName"
						:route-name="applicationRoutes[0].routeName"
						@change-current-route-name="handleChangeCurrentRouteName"
						><HomeIcon
					/></ChildlessParentRoute>

					<!-- 'Vehicle Valuation' route -->
					<!-- <ChildedParentRoute
						:display-name="applicationRoutes[1].displayName"
						:route-name="applicationRoutes[1].routeName"
						:children="applicationRoutes[1].children as ApplicationChildRoute[]"
						@change-current-route-name="handleChangeCurrentRouteName">
						<ValuationIcon />
					</ChildedParentRoute> -->

					<!-- 'Roadside Assistance' route -->
					<ChildedParentRoute
						:display-name="applicationRoutes[2].displayName"
						:route-name="applicationRoutes[2].routeName"
						:children="applicationRoutes[2].children"
						@change-current-route-name="
							(displayName: string) => {
								handleChangeCurrentRouteName(displayName);
							}
						">
						<AssistanceIcon
							classes="flex-shrink-0 size-8 transition duration-75 group-hover:text-blue-600" />
					</ChildedParentRoute>

					<!-- 'Memberships' route -->
					<ChildedParentRoute
						:display-name="applicationRoutes[4].displayName"
						:route-name="applicationRoutes[4].routeName"
						:children="applicationRoutes[4].children"
						@change-current-route-name="
							(displayName: string) => {
								handleChangeCurrentRouteName(displayName);
							}
						">
						<MembershipsIcon
							classes="flex-shrink-0 size-8 transition duration-75 group-hover:text-blue-600" />
					</ChildedParentRoute>
				</ul>
			</div>
			<div class="mt-5">
				<ClientOnly
					><!-- Sidebar advertisement -->
					<SidenavAdvertCarousel
				/></ClientOnly>

				<!-- Ending links -->
				<ul class="flex flex-col flex-wrap space-y-1.5 pl-2">
					<!-- 'Logout Button' -->
					<li>
						<button
							class="group flex w-full items-center gap-x-3.5 rounded-s-xl bg-gray-100 px-2.5 py-4 font-semibold text-gray-500 transition duration-200 hover:bg-gray-200 hover:text-blue-600"
							@click="logout">
							<LogoutIcon />
							<span>Logout</span>
						</button>
					</li>
				</ul>
				<div class="mt-5 flex flex-col px-6 text-sm text-gray-500">
					<span class="font-semibold">Regent Valuers Limited</span>
					<span>&copy; 2024 All Rights Reserved</span>
				</div>
			</div>
		</div>

		<!-- the main place where every route will be shown -->
		<slot />
	</main>
</template>

<script setup lang="ts">
	import applicationRoutes from '~/types/routes';

	const route = useRoute();
	const notificationCount: Ref<number> = ref(0);
	const currentRoute: Ref<string | null> = ref(null);
	const { getPrincipal, logout } = useAuth();
	const profilePicture: Ref<string> = ref('');

	const computedCurrentRoute = computed((): string | null => {
		if (route.name === 'dashboard-home') {
			return 'Home';
		}

		const currentRoutePath = route.path;
		const currentRoutePathTokens = currentRoutePath.split('/');

		return currentRoutePathTokens.length > 2
			? capitalizeFirstLetterOfEachWord(currentRoutePathTokens[2].split('-').join(' '))
			: null;
	});

	const handleChangeCurrentRouteName = (currentClickedRoute: string): void => {
		currentRoute.value = currentClickedRoute;
	};

	onMounted(() => (profilePicture.value = getPrincipal.value.profilePicture));
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
