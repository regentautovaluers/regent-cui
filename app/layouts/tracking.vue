<script setup lang="ts"></script>

<template>
  <div class="h-screen flex">
    <AsideNavigation></AsideNavigation>
    <div class="flex flex-col flex-1 min-h-0 overflow-auto relative">
      <Header></Header>
      <main class="min-h-screen h-fit">
        <slot></slot>
      </main>
    </div>
  </div>
</template>
