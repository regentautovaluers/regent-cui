<script setup lang="ts">
const { routes: aRoutes, routeNameMatch } = useNavigation();
const { sidebarOpen, toggleSidebar } = useSettings();
const { public: publicRC } = useRuntimeConfig();
</script>

<template>
  <aside
    :class="[
      'shadow bg-base-100 h-screen max-h-screen flex-shrink-0 flex flex-col transition-[width] transtion-shared overflow-y-auto',
      sidebarOpen ? 'w-[20rem] p-4' : 'w-20 p-0',
    ]"
  >
    <div class="h-20 flex items-center space-x-2 p-4">
      <!-- emblem logo -->
      <NuxtImg
        src="/regent-mini-logo.png"
        densities="x1 x2"
        :class="[sidebarOpen ? 'size-14' : 'size-12']"
      />
      <!-- emblem text -->
      <h2
        class="text-base-content inline-flex flex-col justify-center"
        v-show="sidebarOpen"
      >
        <span class="text-3xl font-bold">REGENT</span>
        <span class="text-2xl font-medium">Auto Valuers</span>
      </h2>
    </div>
    <div
      class="flex flex-col justify-between min-h-0 flex-1 overflow-auto hide-scrollbar"
    >
      <h5 class="text-base-content text-lg font-bold p-4" v-show="sidebarOpen">
        Main Menu
      </h5>
      <div class="space-y-3">
        <MainLinkAccordion
          v-for="r in aRoutes.filter((e) => e.display)"
          :key="r.id"
          :item="r"
        ></MainLinkAccordion>
      </div>

      <!-- carousel -->

      <!-- other links -->
      <div class="mt-4">
        <button
          class="accordion-toggle inline-flex items-center justify-between text-start"
        >
          <NuxtLink :to="{ name: '' }" class="inline-flex items-center">
            <span
              class="icon-[material-symbols--settings-b-roll-rounded] size-7"
            ></span>
            <span class="ml-4 font-medium" v-show="sidebarOpen">Settings</span>
          </NuxtLink>
        </button>
        <button
          class="accordion-toggle inline-flex items-center justify-between text-start"
          aria-controls="payment-arrow-collapse"
          aria-expanded="true"
        >
          <NuxtLink :to="{ name: '' }" class="inline-flex items-center">
            <span
              class="icon-[material-symbols--power-settings-circle] size-7"
            ></span>
            <span class="ml-4 font-medium" v-show="sidebarOpen">Logout</span>
          </NuxtLink>
        </button>
      </div>
    </div>
    <div class="h-18 text-sm p-4" v-show="sidebarOpen">
      <h5>Powered By Regent Auto Valuers</h5>
      <h6 class="inline-flex space-x-2 items-center">
        <span>&copy; {{ publicRC.COPYRIGHT_YEAR }}</span>
        <span class="text-2xl">&middot;</span>
        <span>Privacy Policy</span>
      </h6>
    </div>
  </aside>
</template>
