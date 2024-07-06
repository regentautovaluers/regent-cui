<template>
	<main class="h-screen">
		<nav
			class="py-4 flex justify-between items-center px-3 md:pl-[330px] md:pr-[20px] sticky top-0 z-20 bg-white flex-wrap">
			<div class="flex space-x-8 w-fit md:w-1/3">
				<!-- Navigation Toggle -->
				<button
					type="button"
					class="text-gray-500 hover:text-gray-600 md:hidden"
					data-hs-overlay="#docs-sidebar"
					aria-controls="docs-sidebar"
					aria-label="Toggle navigation">
					<span class="sr-only">Toggle Navigation</span>
					<img
						src="/images/topnav/hamburger-menu-icon.svg"
						alt="Hamburger Menu Icon" />
				</button>
				<!-- End Navigation Toggle -->
				<h1 class="text-2xl md:text-3xl font-semibold hidden md:flex">
					{{ currentRoute || computedCurrentRoute }}
				</h1>
			</div>

			<!-- div with notifications, messages and profile information -->
			<div
				class="flex items-center space-x-3 w-full md:w-1/3 justify-between md:justify-end mt-2 md:mt-0">
				<!-- notifications & messages -->
				<div class="flex space-x-3 mr-4">
					<!-- <TopnavAccentBoxes>
						<template #iconSlot>
							<img
								src="/images/topnav/notification-icon.svg"
								alt="Notification Icon" />
						</template>
						<template #countSlot>{{ messageCount }}</template>
					</TopnavAccentBoxes> -->
					<TopnavAccentBoxes>
						<template #iconSlot>
							<img
								src="/images/topnav/message-chat-icon.svg"
								alt="Chat Icon" />
						</template>
						<template #countSlot>
							{{ notificationCount }}
						</template>
					</TopnavAccentBoxes>
				</div>

				<!-- profile information chip -->
				<div class="flex items-center space-x-4">
					<img
						class="size-[50px] rounded-full object-cover"
						:src="getPrincipal.profilePicture"
						alt="Profile Picture" />
					<div class="flex flex-col">
						<span class="font-bold tracking">{{
							getPrincipal.username
						}}</span>
						<span class="text-gray-500">{{
							getPrincipal.corpName
						}}</span>
					</div>
				</div>
			</div>
			<!-- end of div with notifications, messages and profile information mentioned above -->
		</nav>

		<div
			id="docs-sidebar"
			class="hs-overlay hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 start-0 bottom-0 z-[60] w-80 bg-white border-e border-gray-200 pb-10 overflow-y-auto lg:block lg:translate-x-0 lg:end-auto lg:bottom-0">
			<div class="py-4 sticky z-20 top-0 bg-white">
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
				class="hs-accordion-group w-full flex flex-col flex-wrap pl-2"
				data-hs-accordion-always-open>
				<ul class="space-y-1.5">
					<!-- 'Home' route -->
					<ChildlessParentRoute
						:display-name="applicationRoutes[0].displayName"
						:route-name="applicationRoutes[0].routeName"
						@change-current-route-name="
							handleChangeCurrentRouteName
						" />

					<!-- 'Vehicle Valuation' route -->
					<ChildedParentRoute
						:display-name="applicationRoutes[1].displayName"
						:route-name="applicationRoutes[1].routeName"
						:children="applicationRoutes[1].children as ApplicationChildRoute[]"
						@change-current-route-name="
							handleChangeCurrentRouteName
						" />

					<!-- 'Roadside Assistance' route -->
					<ChildedParentRoute
						:display-name="applicationRoutes[2].displayName"
						:route-name="applicationRoutes[2].routeName"
						:children="applicationRoutes[2].children as ApplicationChildRoute[]"
						@change-current-route-name="
							handleChangeCurrentRouteName
						" />

					<!-- 'Memberships' route -->
					<ChildedParentRoute
						:display-name="applicationRoutes[4].displayName"
						:route-name="applicationRoutes[4].routeName"
						:children="applicationRoutes[4].children as ApplicationChildRoute[]"
						@change-current-route-name="
							handleChangeCurrentRouteName
						" />
				</ul>
			</div>
			<div class="mt-5">
				<!-- Sidebar advertisement -->

				<SidenavAdvertCarousel />

				<!-- Ending links -->
				<ul class="space-y-1.5 flex flex-col flex-wrap pl-2">
					<!-- 'Settings' route -->
					<!-- <ChildlessParentRoute
						:display-name="applicationRoutes[3].displayName"
						:icon="applicationRoutes[3].icon"
						:route-name="applicationRoutes[3].routeName"
						@change-current-route-name="
							handleChangeCurrentRouteName
						" /> -->

					<!-- 'Logout Button' -->
					<li>
						<button
							class="flex items-center gap-x-3.5 w-full py-4 rounded-s-xl px-2.5 bg-gray-100 transition duration-200 hover:bg-gray-200 font-semibold text-gray-500"
							@click="logout">
							<span>Logout</span>
						</button>
					</li>
				</ul>
				<div class="text-gray-500 text-sm flex flex-col px-6 mt-5">
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
	import applicationRoutes from "~/types/routes";
	import type { ApplicationChildRoute } from "~/types/types";

	const route = useRoute();
	const notificationCount: Ref<number> = ref(10);
	const messageCount: Ref<number> = ref(10);
	const currentRoute: Ref<string | null> = ref(null);
	const { getPrincipal, logout } = useAuth();

	const computedCurrentRoute = computed((): string | null => {
		if (route.name === "dashboard-home") {
			return "Home";
		}

		const currentRoutePath = route.path;
		const currentRoutePathTokens = currentRoutePath.split("/");

		return currentRoutePathTokens.length > 2
			? capitalizeFirstLetterOfEachWord(
					currentRoutePathTokens[2].split("-").join(" ")
			  )
			: null;
	});

	const handleChangeCurrentRouteName = (
		currentClickedRoute: string
	): void => {
		currentRoute.value = currentClickedRoute;
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
