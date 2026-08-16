<script setup lang="ts"></script>

<template>
  <!-- component rounding -->
  <div class="h-fit">
    <div class="py-2 flex justify-between items-center">
      <h5 class="text-base-content text-lg">Adjust Polygon Rounding</h5>
      <div class="space-x-3">
        <button class="btn btn-soft btn-primary rounded-none">
          No Rounding
        </button>
        <button class="btn btn-soft btn-primary">Some Rounding</button>
        <button class="btn btn-soft btn-primary rounded-full">
          Full Rounding
        </button>
      </div>
    </div>
    <small class="text-base-content/80">
      How rounded do you want various polygons on the screen?
    </small>
  </div>

  <!-- play sounds -->
  <div class="h-fit">
    <div class="py-2 flex justify-between items-center">
      <h5 class="text-base-content text-lg">Disable Feedback Sounds</h5>
      <div class="space-x-3">
        <button class="btn btn-soft btn-primary rounded-none">
          No Rounding
        </button>
        <button class="btn btn-soft btn-primary">Some Rounding</button>
        <button class="btn btn-soft btn-primary rounded-full">
          Full Rounding
        </button>
      </div>
    </div>
    <small class="text-base-content/80"> Turn Subtle Sounds On or Off </small>
  </div>

  <!-- Preview Files Before Downloading -->
</template>
