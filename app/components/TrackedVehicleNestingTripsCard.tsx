export default defineComponent({
  setup() {
    return () => (
      <div class="border-base-content/25 h-fit w-full space-y-3 border-b">
        <div class="border-b p-3 border-base-content/25 font-bold">
          08/12/2025
        </div>
        <div class="pb-3">
          <ul class="timeline timeline-snap-icon timeline-compact timeline-vertical w-full">
            <li>
              <div class="timeline-middle">
                <span class="bg-success flex size-4 items-center justify-center rounded-full"></span>
              </div>
              <div class="timeline-end mb-0 w-full rounded-lg py-4 pt-1">
                <div class="w-fit text-base-content mb-1 flex gap-2 font-medium max-sm:flex-col-reverse sm:items-center sm:justify-between">
                  <span class="font-semibold">Start</span>
                  <span>|</span>
                  <span class="icon-[material-symbols--schedule-outline-rounded]"></span>
                  <span>08:15</span>
                </div>
                <p>Some location here!</p>
                <p class="flex items-center gap-2">
                  <span class="font-semibold">Driving Duration</span>
                  <span>&middot;</span>
                  <span>1hrs 10 min</span>
                </p>
              </div>
              <hr />
            </li>
            <li>
              <div class="timeline-middle">
                <span class="bg-error flex size-4 items-center justify-center rounded-full"></span>
              </div>
              <div class="timeline-end mb-0 w-full rounded-lg py-4 pt-1">
                <div class="w-fit text-base-content mb-1 flex gap-2 font-medium max-sm:flex-col-reverse sm:items-center sm:justify-between">
                  <span class="font-semibold">Stop</span>
                  <span>|</span>
                  <span class="icon-[material-symbols--schedule-outline-rounded]"></span>
                  <span>08:15</span>
                </div>
                <p>Some location here!</p>
                <p class="flex items-center gap-2">
                  <span class="font-semibold">Stop Duration</span>
                  <span>&middot;</span>
                  <span>1hrs 10 min</span>
                </p>
              </div>
              <hr />
            </li>
          </ul>
        </div>
      </div>
    );
  },
});
