export default defineComponent({
  props: {},
  emits: {
    "page-change-clicked": (newPage: number) => typeof newPage === "number",
  },
  setup(props, { emit }) {
    const handlePageChange = (newPage: number) => {
      emit("page-change-clicked", newPage);
    };

    return () => (
      <div class="p-3 h-fit w-full space-y-5 rounded-md border border-base-content/50 bg-base-300/5">
        <div class="flex items-center justify-between">
          <div class="skeleton skeleton-animated w-[55%] h-16"></div>
          <span class="rounded h-5 w-25 skeleton skeleton-animated"></span>
        </div>
        <div class="grid grid-cols-3 gap-x-2">
          <div class="skeleton skeleton-animated h-16"></div>
          <div class="skeleton skeleton-animated h-16"></div>
          <div class="skeleton skeleton-animated h-16"></div>
        </div>

        <div
          class="progress skeleton skeleton-animated h-3 bg-base-200 w-full"
          role="progressbar"
          aria-label="Progressbar"
          aria-valuenow="50"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div class="skeleton skeleton-animated progress-bar  w-1/2"></div>
        </div>
      </div>
    );
  },
});
