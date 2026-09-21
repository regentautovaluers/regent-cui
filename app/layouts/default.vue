<script setup lang="ts"></script>

<template>
  <div class="h-screen w-screen min-h-screen flex">
    <AsideNavigation></AsideNavigation>
    <div class="flex-1 min-h-0 overflow-y-auto relative">
      <Header></Header>
      <main class="p-5 tablet:p-10 laptop:p-20 flex-1 flex flex-col laptop:pt-30 bg-[#f8faf8] dark:bg-base-200 min-h-full ">
        <slot></slot>
      </main>
    </div>
  </div>
</template>
