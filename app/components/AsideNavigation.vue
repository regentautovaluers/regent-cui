<script setup lang="ts">
const { routes: aRoutes, routeNameMatch } = useNavigation();
const { sidebarOpen, toggleSidebar } = useSettings();
const { public: publicRC } = useRuntimeConfig();
</script>

<template>
  <aside
    :class="[
      'shadow text-white h-screen flex-shrink-0 flex flex-col transition-[width] transtion-shared overflow-y-auto',
      sidebarOpen ? 'w-72' : 'w-20',
    ]"
  >
    <div class="h-20 flex items-center space-x-2 p-4">
      <!-- emblem logo -->
      <NuxtImg src="/regent-mini-logo.png" densities="x1 x2" class="size-16" />
      <!-- emblem text -->
      <h2 class="text-base-content inline-flex flex-col justify-center">
        <span class="text-3xl font-bold">REGENT</span>
        <span class="text-2xl font-medium">Auto Valuers</span>
      </h2>
    </div>
    <div class="flex flex-col min-h-0 flex-1 overflow-auto">
      <h5 class="text-base-content text-lg font-bold p-4">Main Menu</h5>
      <div class="space-y-3">
        <MainLinkAccordion
          v-for="r in aRoutes"
          :key="r.id"
          :item="r"
          :accordion-id="generateRandomString(r.name, 8)"
        ></MainLinkAccordion>
      </div>
    </div>
    <div class="h-18 text-sm p-4">
      <h5>Powered By Regent Auto Valuers</h5>
      <h6 class="inline-flex space-x-2 items-center">
        <span>&copy; {{ publicRC.COPYRIGHT_YEAR }}</span>
        <span class="text-2xl">&middot;</span>
        <span>Privacy Policy</span>
      </h6>
    </div>
  </aside>
</template>
