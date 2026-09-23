<script setup lang="ts"></script>

<template>
  <div class="h-screen flex">
    <AsideNavigation></AsideNavigation>
    <main class="h-screen grow max-h-screen relative">
      <Header></Header>
      <slot></slot>
    </main>
  </div>
</template>
