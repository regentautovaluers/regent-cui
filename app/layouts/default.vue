<script setup lang="ts">
const { sidebarOpen, toggleSidebar } = useSettings();
</script>

<template>
  <div class="h-screen flex">
    <AsideNavigation></AsideNavigation>
    <div class="flex flex-col flex-1 min-h-0 overflow-auto relative">
      <header
        class="h-20 flex items-center bg-base-100 justify-between px-4 w-full z-20 flex-shrink-0 sticky top-0 shadow"
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
          <h1 class="text-base-content text-4xl font-bold">Heading 1</h1>
        </div>

        <!-- user avatar -->
        <div class="w-fit flex items-center space-x-5">
          <!-- notification -->
          <Notification></Notification>

          <!-- user's avatar -->
          <UserAvatar></UserAvatar>
        </div>
      </header>
      <main class="p-30">
        <slot></slot>
      </main>
    </div>
  </div>
</template>
