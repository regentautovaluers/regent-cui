<template>
	<li
		class="hs-accordion"
		id="account-accordion">
		<button
			type="button"
			class="hs-accordion-toggle group flex w-full items-center gap-x-3.5 rounded-s-2xl px-2.5 py-4 text-start font-semibold hover:bg-gray-100 hover:text-blue-600 hs-accordion-active:hover:bg-gray-100"
			:class="
				isActiveRoute
					? 'border-r-[6px] border-r-blue-600 bg-gray-100 text-blue-600'
					: 'text-gray-500'
			">
			<slot />
			<nuxt-link
				:to="{ name: componentProps.routeName }"
				@click="emit('changeCurrentRouteName', componentProps.displayName)"
				>{{ componentProps.displayName }}</nuxt-link
			>

			<svg
				class="ms-auto hidden size-4 text-gray-600 group-hover:text-gray-500 hs-accordion-active:block"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round">
				<path d="m18 15-6-6-6 6" />
			</svg>

			<svg
				class="ms-auto block size-4 text-gray-600 group-hover:text-gray-500 hs-accordion-active:hidden"
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg">
				<path
					d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"></path>
			</svg>
		</button>
		<div
			id="account-accordion"
			class="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300">
			<div class="ps-2 pt-2">
				<!-- Item -->
				<div
					v-for="child in componentProps.children"
					:key="child.id"
					class="group relative flex gap-x-1 rounded-lg">
					<!-- Icon -->
					<div
						class="relative after:absolute after:bottom-0 after:start-3.5 after:top-0 after:w-px after:-translate-x-[0.5px] after:bg-gray-300 last:after:hidden">
						<div class="relative z-10 flex size-7 items-center justify-center">
							<div
								class="h-6 w-3 rounded-full border-2 group-hover:border-blue-600"
								:class="
									route.name === child.routeName
										? 'border-blue-600 bg-blue-600'
										: 'border-gray-300 bg-white'
								" />
						</div>
					</div>
					<!-- End Icon -->

					<!-- Right Content -->
					<div
						class="grow px-2 pb-8 font-medium"
						:class="
							route.name === child.routeName
								? 'font-semibold text-blue-600'
								: 'text-gray-500'
						">
						<NuxtLink
							:to="{ name: child.routeName }"
							@click="emit('changeCurrentRouteName', componentProps.displayName)">
							{{ child.displayName }}
						</NuxtLink>
					</div>
					<!-- End Right Content -->
				</div>
				<!-- End Item -->
			</div>
		</div>
	</li>
</template>

<script setup lang="ts">
	import type { ApplicationChildRoute } from '~/types/types';
	export interface ComponentProps {
		displayName: string;
		routeName: string;
		children: ApplicationChildRoute[] | null;
	}

	const componentProps = defineProps<ComponentProps>();
	const route = useRoute();
	const emit = defineEmits(['changeCurrentRouteName']);

	// Function to check if the current route is the active route
	const isActiveRoute = computed(() => {
		const currentRouteName = route.name;
		return (
			currentRouteName === componentProps.routeName ||
			componentProps.children?.some((child) => child.routeName === currentRouteName)
		);
	});
</script>
