<script setup lang="ts">
const { supportedThemes, setTheme } = useSettings();
const store = usePrincipalStore();
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
      {{ store.loadUserIdentifiers.username }}
      <span
        class="icon-[material-symbols--chevron-backward-rounded] dropdown-open:rotate-180 size-4"
      ></span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        class="dropdown-open:rotate-180 size-4 transition-transform duration-300 rtl:rotate-180"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          fill="currentColor"
          d="M12.6 12L8.7 8.1q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7z"
        />
      </svg>
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
          <h6 class="text-base-content text-base font-semibold">
            {{ store.loadUserIdentifiers.username }}
          </h6>
          <small class="text-base-content/50 text-sm font-normal">{{
            store.loadUserIdentifiers.email
          }}</small>
        </div>
      </li>
      <li class="space-x-1">
        <button
          class="btn btn-soft btn-primary join-item w-1/2"
          v-for="t in supportedThemes"
          :key="t"
          @click="setTheme(t)"
        >
          {{ t }}
        </button>
      </li>
      <li><a class="dropdown-item" href="#">Logout</a></li>
    </ul>
  </div>
</template>
