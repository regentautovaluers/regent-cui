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
          <div>
            <span class="text-lg font-semibold">Primary Location</span>
            <br />
            <span>Some Location Here</span>
          </div>
          <span class="rounded-full badge badge-outline badge-warning">
            Warning
          </span>
        </div>
        <div class="grid grid-cols-3">
          <div>
            <h3 class="inline-flex space-x-1 items-center">
              <span class="icon-[material-symbols--nest-clock-farsight-analog-outline]"></span>
              <span class="font-semibold">33.8 hrs</span>
            </h3>
            <h4>Time Spent</h4>
          </div>
          <div class=" text-center">
            <h3 class="inline-flex space-x-1 items-center">
              <span class="icon-[material-symbols--table-chart-view-rounded]"></span>
              <span class="font-semibold">58%</span>
            </h3>
            <h4>Of Total</h4>
          </div>
          <div class="text-center">
            <h3 class="inline-flex space-x-1 items-center">
              <span class="icon-[material-symbols--table-chart-view-rounded]"></span>
              <span class="font-semibold">58%</span>
            </h3>
            <h4>Of Total</h4>
          </div>
        </div>

        <div
          class="progress h-3 bg-primary/10 w-full"
          role="progressbar"
          aria-label="Progressbar"
          aria-valuenow="50"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div class="progress-bar progress-accent w-1/2"></div>
        </div>
      </div>
    );
  },
});
