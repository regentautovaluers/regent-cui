<script setup lang="ts"></script>
<template>
  <div class="h-screen flex">
    <AsideNavigation></AsideNavigation>
    <div class="flex-1 min-h-0 overflow-y-auto relative">
      <Header></Header>
      <main class="pt-20 min-h-screen grid grid-cols-1 lg:grid-cols-[5fr_6fr]">
        <slot></slot>
      </main>
    </div>
  </div>
</template>
