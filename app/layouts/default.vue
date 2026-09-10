<script setup lang="ts">
</script>

<template>
  <div class="h-screen flex">
    <AsideNavigation></AsideNavigation>
    <div class="flex-1 min-h-0 overflow-y-auto relative">
      <Header></Header>
      <main class="p-5 tablet:p-10 laptop:p-15 laptop-lg:p-25 lg:pt-40 min-h-screen h-screen">
        <slot></slot>
      </main>
    </div>
  </div>
</template>
