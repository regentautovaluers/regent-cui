<template>
	<li
		class="hs-accordion"
		id="account-accordion">
		<button
			type="button"
			class="hs-accordion-toggle rounded-s-2xl hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent w-full text-start flex items-center gap-x-3.5 py-5 px-2.5 font-semibold hover:bg-gray-100 text-gray-500">
			<nuxt-icon :name="icon" />
			<nuxt-link
				:to="{ name: componentProps.routeName }"
				@click="
					emit('changeCurrentRouteName', componentProps.displayName)
				"
				>{{ componentProps.displayName }}</nuxt-link
			>

			<svg
				class="hs-accordion-active:block ms-auto hidden size-4 text-gray-600 group-hover:text-gray-500 dark:text-gray-400"
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
				class="hs-accordion-active:hidden ms-auto block size-4 text-gray-600 group-hover:text-gray-500 dark:text-gray-400"
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
			class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden">
			<div class="pt-2 ps-2">
				<!-- Item -->
				<div
					v-for="child in componentProps.children"
					:key="child.id"
					class="flex gap-x-1 relative group rounded-lg">
					<!-- Icon -->
					<div
						class="relative last:after:hidden after:absolute after:top-0 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200">
						<div
							class="relative z-10 size-7 flex justify-center items-center">
							<div
								class="h-6 w-3 rounded-full bg-white border-2 border-gray-300 group-hover:border-blue-600" />
						</div>
					</div>
					<!-- End Icon -->

					<!-- Right Content -->
					<div class="grow px-2 pb-8 text-gray-500">
						<NuxtLink
							:to="{ name: child.routeName }"
							@click="
								emit(
									'changeCurrentRouteName',
									componentProps.displayName
								)
							">
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
	import type { ApplicationChildRoute } from "~/types/types";
	export interface ComponentProps {
		displayName: string;
		routeName: string;
		icon: string;
		children: ApplicationChildRoute[];
	}

	const componentProps = defineProps<ComponentProps>();
	const emit = defineEmits(["changeCurrentRouteName"]);
</script>
