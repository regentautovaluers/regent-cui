export default defineComponent({
  setup() {
    return () => (
      <div class="border-base-content/25 p-3 h-fit w-full space-y-3 rounded-md border">
        <div class="flex justify-between space-x-2 items-start">
          <div class="skeleton skeleton-animated size-12 rounded-md"></div>
          <div class="grow space-y-0.5">
            <p class="skeleton skeleton-animated w-[75%] p-1"></p>
            <p class="skeleton skeleton-animated w-[50%] p-1"></p>
          </div>
          <button></button>
        </div>
        <div class="flex text-sm space-x-1 items-center w-[75%] skeleton skeleton-animated p-2"></div>
        <div class="flex items-center justify-between">
          <button class="h-10 skeleton skeleton-animated w-20 border-0"></button>
          <span class="p-1 skeleton skeleton-animated w-[25%] h-10"></span>
        </div>
      </div>
    );
  },
});
