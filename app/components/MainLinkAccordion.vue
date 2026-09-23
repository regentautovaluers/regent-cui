<script setup lang="ts">
import { resolveComponent } from 'vue'

const props = defineProps<{
  item: RoutesAvailable;
}>();

const { sidebarOpen } = useSettings();
const { activeRouteName } = useNavigation();
const NuxtLink = resolveComponent('NuxtLink')
const parentWrappingActiveRouteMatches = computed(() => {
  return props.item.children?.some(
    (child) => activeRouteName.value === child.name,
  );
});

function childRouteMatches(routeName: string): boolean {
  return activeRouteName.value === routeName;
}
</script>

<template>
  <div class="accordion">
    <div class="accordion-item active" :id="`sidedd-${props.item.name}-basic`">
      <component
        :is="props.item.asNuxtLink ? NuxtLink : 'button'"
        :to="{ name: props.item.name }"
        class="accordion-toggle inline-flex items-center justify-between"
        :aria-controls="`sm-${props.item.name}-collapse`"
        aria-expanded="false"
      >
        <div
          class="flex items-center"
          :class="{ 'text-primary': parentWrappingActiveRouteMatches }"
        >
          <span :class="`${props.item.icon} size-6`"></span>
          <span
            v-if="sidebarOpen"
            class="font-medium ml-4"
            :class="{ 'font-semibold': parentWrappingActiveRouteMatches }"
          >
            {{ props.item.screenName }}
          </span>
        </div>
        <svg
          v-if="sidebarOpen && props.item.children && props.item.showChildren"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          class="accordion-item-active:rotate-90 size-5 transition-transform duration-300 rtl:rotate-180"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            fill="currentColor"
            d="M12.6 12L8.7 8.1q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7z"
          />
        </svg>
      </component>
      <div
        :id="`sm-${props.item.name}-collapse`"
        class="accordion-content w-full transition-[height] duration-300"
        :aria-labelledby="`sidedd-${props.item.name}-basic`"
        role="region"
      >
        <ul
          v-if="props.item.children && props.item.showChildren && sidebarOpen"
          class="timeline timeline-vertical timeline-compact ml-3"
        >
          <li
            v-for="(i, idx) in props.item.children.filter((e) => e.display)"
            :key="idx"
          >
            <div class="timeline-middle h-fit">
              <span
                class="border-primary border flex w-3 h-6 items-center justify-center rounded-full"
                :class="{ 'bg-primary': childRouteMatches(i.name) }"
              ></span>
            </div>
            <NuxtLink
              class="timeline-end text-base-content ml-4"
              :to="{ name: i.name }"
              :class="{
                'text-primary font-semibold': childRouteMatches(i.name),
              }"
            >
              {{ i.screenName }}
            </NuxtLink>
            <hr />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
