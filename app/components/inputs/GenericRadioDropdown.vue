<script setup lang="ts"></script>

<template>
  <div class="dropdown relative inline-flex [--auto-close:inside]">
    <button
      id="dropdown-transportation"
      type="button"
      class="dropdown-toggle btn btn-primary"
      aria-haspopup="menu"
      aria-expanded="false"
      aria-label="Dropdown"
    >
      Dropdown radio
      <span
        class="icon-[tabler--chevron-down] dropdown-open:rotate-180 size-4"
      ></span>
    </button>
    <div
      class="dropdown-menu dropdown-open:opacity-100 hidden"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="dropdown-transportation"
    >
      <div class="dropdown-item gap-4">
        <input
          id="dropdown-radio-car-2"
          name="dropdown-item-radio"
          type="radio"
          class="radio radio-primary"
          checked
        />
        <label
          for="dropdown-radio-car-2"
          class="label-text text-base-content block text-sm font-semibold"
          >Car
        </label>
      </div>
      <div class="dropdown-item gap-4">
        <input
          id="dropdown-radio-bicycle-2"
          name="dropdown-item-radio"
          type="radio"
          class="radio radio-primary"
        />
        <label
          for="dropdown-radio-bicycle-2"
          class="label-text text-base-content text-sm font-semibold"
        >
          Bicycle
        </label>
      </div>
    </div>
  </div>
</template>
