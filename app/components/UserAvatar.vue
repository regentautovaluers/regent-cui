<script setup lang="ts">
const { supportedThemes, setTheme } = useSettings();
const store = usePrincipalStore();
</script>

<template>
  <div class="dropdown relative inline-flex">
    <button
      id="dropdown-avatar"
      type="button"
      class="dropdown-toggle btn-primary flex w-58 max-w-58 min-w-58 items-center gap-2"
      aria-haspopup="menu"
      aria-expanded="false"
      aria-label="Dropdown"
    >
      <div
        class="size-12 bg-primary rounded-full flex items-center justify-center"
      >
        <span class="text-slate-100 text-xl font-semibold">{{
          getInitials(store.username)
        }}</span>
      </div>

      <div class="h-full flex justify-center items-start flex-col">
        <span class="font-bold text-ellipsis"
          >{{ store.loadUserIdentifiers.username }}
        </span>
        <span class="text-xs text-ellipsis">{{
          store.loadUserIdentifiers.corporate
        }}</span>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        class="dropdown-open:rotate-180 rotate-90 size-7 transition-transform duration-300 rtl:rotate-180"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          fill="currentColor"
          d="M12.6 12L8.7 8.1q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7z"
        />
      </svg>
    </button>
    <ul
      class="dropdown-menu dropdown-open:opacity-100 hidden min-w-60 z-10 any-border"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="dropdown-avatar"
    >
      <li class="dropdown-header gap-3">
        <div class="flex flex-col">
          <h6 class="text-base-content text-base font-semibold">
            {{ store.loadUserIdentifiers.username }}
          </h6>

          <small class="text-base-content/50 text-sm font-normal">{{
            store.loadUserIdentifiers.email
          }}</small>
        </div>
      </li>
      <li class="join flex">
        <button
          class="btn flex-1 btn-soft btn-primary join-item any-border capitalize"
          v-for="t in supportedThemes"
          :key="t"
          @click="setTheme(t)"
        >
          {{ t == "black" ? "Dark" : "Light" }}
        </button>
      </li>
    </ul>
  </div>
</template>
