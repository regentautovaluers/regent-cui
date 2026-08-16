<script setup lang="ts">
const { supportedThemes, setTheme } = useSettings();
</script>

<template>
  <div class="dropdown relative inline-flex">
    <button
      id="dropdown-avatar"
      type="button"
      class="dropdown-toggle btn btn-lg btn-outline btn-primary flex items-center gap-2 rounded-full"
      aria-haspopup="menu"
      aria-expanded="false"
      aria-label="Dropdown"
    >
      <div class="avatar">
        <div class="size-6 rounded-full">
          <img
            src="https://cdn.flyonui.com/fy-assets/avatar/avatar-3.png"
            alt="User Avatar"
          />
        </div>
      </div>
      John Doe
      <span
        class="icon-[tabler--chevron-down] dropdown-open:rotate-180 size-4"
      ></span>
    </button>
    <ul
      class="dropdown-menu dropdown-open:opacity-100 hidden min-w-60 z-10"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="dropdown-avatar"
    >
      <li class="dropdown-header gap-3">
        <div class="avatar">
          <div class="w-10 rounded-full">
            <img
              src="https://cdn.flyonui.com/fy-assets/avatar/avatar-3.png"
              alt="User Avatar"
            />
          </div>
        </div>
        <div>
          <h6 class="text-base-content text-base font-semibold">John Doe</h6>
          <small class="text-base-content/50 text-sm font-normal"
            >jhon@doe.com</small
          >
        </div>
      </li>
      <li class="bg-red-500">
        <div class="w-full join">
          <button
            class="btn btn-soft btn-primary join-item"
            v-for="t in supportedThemes"
            :key="t"
            @click="setTheme(t)"
          >
            {{ t }}
          </button>
        </div>
      </li>
      <li><a class="dropdown-item" href="#">Logout</a></li>
    </ul>
  </div>
</template>
