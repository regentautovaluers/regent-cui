export default defineComponent({
  setup() {
    return () => (
      <div class="border-base-content/25 h-fit w-full space-y-3 border-y">
        <div class="border-b p-3 border-base-content/25 font-bold">
          <div class="rounded w-[40%] skeleton skeleton-animated h-6"></div>
        </div>
        <div class="pb-3">
          <ul class="timeline timeline-snap-icon timeline-compact timeline-vertical w-full">
            <li>
              <div class="timeline-middle">
                <span class="skeleton skeleton-animated flex size-4 items-center justify-center rounded-full"></span>
              </div>
              <div class="timeline-end mb-0 w-full rounded-lg space-y-2 py-4 pt-1">
                <div class="w-fit text-base-content mb-1 flex gap-2 font-medium max-sm:flex-col-reverse sm:items-center sm:justify-between">
                  <div class="font-semibold skeleton skeleton-animated w-20 h-6"></div>
                  <div class="font-semibold skeleton skeleton-animated w-20 h-6"></div>
                </div>
                <div class="font-semibold skeleton skeleton-animated w-60 h-6"></div>
                <div class="font-semibold skeleton skeleton-animated w-70 h-6"></div>
              </div>
              <hr />
            </li>
          </ul>
        </div>
      </div>
    );
  },
});
