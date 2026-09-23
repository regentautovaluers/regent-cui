import type { PropType } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import type { ShallowRef } from "vue";

export default defineComponent({
  props: {
    idx: {
      required: true,
      type: Number,
    },
    timeSpent: {
      required: true,
      type: Number,
    },
    timeSpentFrac: {
      required: true,
      type: Number,
    },
    visitTimes: {
      required: true,
      type: Number,
    },
    ordinates: {
      required: true,
      type: Object as PropType<{ lat: number; lng: number }>,
    },
  },
  emits: {
    "page-change-clicked": (newPage: number) => typeof newPage === "number",
  },
  setup(props) {
    const location: ShallowRef<string | null> = shallowRef(null);
    const entry = useTemplateRef<HTMLElement>("entry");

    const { stop } = useIntersectionObserver(
      entry,
      async ([entry]) => {
        if (entry!.intersectionRatio >= 0.5 && !location.value) {
          location.value = "Loading location...";
          try {
            location.value = await gecodeLocation(
              Number(props.ordinates.lat),
              Number(props.ordinates.lng),
            );
          } catch (_er) {
            location.value = "Failed to find location!";
          }

          stop(); // stop observing after the first observation
        }
      },
      { threshold: 0.5 },
    );

    const displayTag = (index: number) => {
      if (index == 0) {
        return "Most Likely";
      } else if (index == 1) {
        return "Medium Likely";
      } else if (index == 2) {
        return "Least Likely";
      }

      return "Other Places";
    };

    const displayBadge = (index: number) => {
      if (index == 0) {
        return (
          <span class="rounded-full badge badge-outline badge-success">
            Very High
          </span>
        );
      } else if (index == 1) {
        return (
          <span class="rounded-full badge badge-outline badge-warning">
            Medium
          </span>
        );
      } else
        return (
          <span class="rounded-full badge badge-outline badge-error">Low</span>
        );
    };

    return () => (
      <div ref="entry" class="p-3 h-fit w-full space-y-5 rounded-md any-border">
        <div>
          <div class="w-full flex justify-between items-center">
            <span class="text-lg font-semibold">{displayTag(props.idx)}</span>
            {displayBadge(props.idx)}
          </div>
          <span class="mt-2">{location.value ?? "-"}</span>
        </div>
        <div class="grid grid-cols-3">
          <div>
            <h3 class="inline-flex space-x-1 items-center">
              <span class="icon-[material-symbols--nest-clock-farsight-analog-outline]"></span>
              <span class="font-semibold">
                {Math.trunc(props.timeSpent)} hrs
              </span>
            </h3>
            <h4>Time Spent</h4>
          </div>
          <div class=" text-center">
            <h3 class="inline-flex space-x-1 items-center">
              <span class="icon-[material-symbols--table-chart-view-rounded]"></span>
              <span class="font-semibold">
                {Math.trunc(props.timeSpentFrac)}%
              </span>
            </h3>
            <h4>Of Total</h4>
          </div>
          <div class="text-center">
            <h3 class="inline-flex space-x-1 items-center">
              <span class="icon-[material-symbols--pin-drop-rounded]"></span>
              <span class="font-semibold">{Math.trunc(props.visitTimes)}%</span>
            </h3>
            <h4>Visits</h4>
          </div>
        </div>

        <div
          class="progress h-3 bg-primary/10 w-full"
          role="progressbar"
          aria-label="Progressbar"
          aria-valuenow={Math.trunc(props.timeSpentFrac)}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            class={`progress-bar progress-accent w-${Math.trunc(props.timeSpentFrac)}`}
          ></div>
        </div>
      </div>
    );
  },
});
