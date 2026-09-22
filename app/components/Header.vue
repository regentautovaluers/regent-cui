<script setup lang="ts">
const { sidebarOpen, toggleSidebar } = useSettings();
const { activeRouteDisplay } = useNavigation();
</script>

<template>
  <header
    :class="[
      'h-20 right-0 flex items-center bg-base-100 transition-[width] transtion-shared justify-between pl-4 z-10 fixed top-0',
      sidebarOpen ? 'left-[20rem]' : 'left-20',
    ]"
  >
    <div class="w-fit flex items-center space-x-5">
      <button
        class="btn btn-square btn-soft btn-primary"
        aria-label="Soft Icon Button"
        @click="toggleSidebar()"
      >
        <span
          :class="[
            'icon-[material-symbols--menu-open-rounded] size-5 shrink-0 transition-transform transtion-shared',
            !sidebarOpen && 'rotate-180',
          ]"
        ></span>
      </button>

      <!-- active page -->
      <h1 class="text-base-content text-2xl font-bold">
        {{ activeRouteDisplay }}
      </h1>
    </div>

    <!-- user avatar -->
    <div class="w-fit flex items-center space-x-5">
      <!-- notification -->
      <!-- <Notification></Notification> -->

      <!-- user's avatar -->
      <UserAvatar></UserAvatar>
    </div>
  </header>
</template>
