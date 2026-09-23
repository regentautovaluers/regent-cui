<script setup lang="ts">
interface Props {
  toPage?: string;
  heading?: string;
  subHeading?: string;
}

const props = withDefaults(defineProps<Props>(), {
  toPage: undefined,
});
</script>

<template>
  <div
    class="card w-full flex-1 h-fit flex items-center justify-center"
  >
    <div
      class="card-body flex flex-col space-y-4 items-center justify-center h-full w-full laptop:w-1/3 p-10"
    >
      <span class="text-base-content text-2xl font-bold">Nothing Found!</span>
      
      <NuxtImg src="/not-found-illustration.svg" :width="200"></NuxtImg>

      <!-- CTA 1 -->
      <NuxtLink
        class="btn w-80 h-20 btn-outline inline-flex items-center justify-between"
      >
        <span class="icon-[material-symbols--grid-view-rounded] size-8"></span>
        <div class="text-start">
          <span class="font-semibold text-lg">Take Me Home</span>
          <br />
          <span class="text-sm">Go Home and Start Over</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          class="size-10"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            fill="currentColor"
            d="M12.6 12L8.7 8.1q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7z"
          />
        </svg>
      </NuxtLink>

      <!-- CTA 2 -->
      <NuxtLink
        v-if="toPage"
        class="btn w-80 h-20 btn-outline inline-flex items-center justify-between"
        :to="{ name: toPage }"
      >
        <span
          class="icon-[material-symbols--arrow-forward-rounded] size-8"
        ></span>
        <div class="text-start">
          <span class="font-semibold text-lg">{{ heading }}</span>
          <br />
          <span class="text-sm">{{ subHeading }}</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          class="size-10"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            fill="currentColor"
            d="M12.6 12L8.7 8.1q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7z"
          />
        </svg>
      </NuxtLink>
    </div>
  </div>
</template>
