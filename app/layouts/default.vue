<script setup lang="ts"></script>

<template>
  <div class="flex flex-row min-h-screen">
    <!-- Sidebar -->
    <AsideNavigation />

    <!-- Main content -->
    <div class="flex-1 bg-[#f8faf8] dark:bg-base-200 overflow-y-auto h-screen">
      <!-- Slot wrapper: fills height, grows with content -->
      <div
        class="p-5 relative tablet:p-10 laptop:p-20 flex flex-col laptop:py-30 min-h-full"
      >
      <Header></Header>
        <slot />
      </div>
    </div>
  </div>
</template>
