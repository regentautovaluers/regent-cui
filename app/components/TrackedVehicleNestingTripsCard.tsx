import type { PropType } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
export default defineComponent({
  props: {
    eventDate: {
      required: true,
      type: String,
    },

    // start metadata
    movement: {
      required: true,
      type: Object as PropType<VehicleMovement[]>,
    },
  },
  emits: {
    "show-pin-clicked": (pinInfo: NestingAreaAnalysisMapPin) => {
      return true;
    },
  },
  setup(props, { emit }) {
    function emitShowPin(
      startPin: NestingAreaPlacePin,
      stopPin: NestingAreaPlacePin,
      routePins: NestingAreaAnalysisMapPin["routePins"],
      tripDuration: string,
      distanceCovered: number,
    ) {
      emit("show-pin-clicked", {
        startPin,
        stopPin,
        routePins,
        tripDuration,
        tripDate: props.eventDate,
        distanceCovered,
      });
    }

    // cache for geocoded locations, one per movement entry
    const locations = reactive<
      { startLocation: string; stopLocation: string }[]
    >(
      props.movement.map(() => ({
        startLocation: "Loading...",
        stopLocation: "Loading...",
      })),
    );

    // refs for each entry
    const entryRefs = props.movement.map(() => ref<HTMLElement | null>(null));

    // attach observers once
    entryRefs.forEach((entryRef, idx) => {
      const { stop } = useIntersectionObserver(
        entryRef,
        async ([entry]) => {
          if (
            entry!.intersectionRatio >= 0.5 &&
            locations[idx]!.startLocation === "Loading..."
          ) {
            try {
              const [startAddr, stopAddr] = await Promise.all([
                gecodeLocation(
                  props.movement[idx]!.startAtLat,
                  props.movement[idx]!.startAtLng,
                ),
                gecodeLocation(
                  props.movement[idx]!.stoppedAtLat,
                  props.movement[idx]!.stoppedAtLng,
                ),
              ]);
              locations[idx]!.startLocation = startAddr;
              locations[idx]!.stopLocation = stopAddr;
            } catch {
              locations[idx]!.startLocation = "Failed to find location!";
              locations[idx]!.stopLocation = "Failed to find location!";
            }
            stop(); // stop observing once loaded
          }
        },
        { threshold: 0.5 },
      );
    });

    return () => (
      <div
        ref="entry"
        class="any-border-b h-fit w-full space-y-3"
      >
        <div class="p-4 border-base-content/50 font-bold">
          {props.eventDate}
        </div>
        {props.movement.map((ev, idx) => {
          return (
            <div
              ref={entryRefs[idx]}
              class="any-border-t hover:bg-primary/20 cursor-pointer p-4"
              key={idx}
              onMousedown={(_mdev) =>
                emitShowPin(
                  {
                    lat: ev.startAtLat,
                    lng: ev.startAtLng,
                    name: locations[idx]!.startLocation,
                    time: ev.startedAt,
                    event: "start",
                  },
                  {
                    lat: ev.stoppedAtLat,
                    lng: ev.stoppedAtLng,
                    name: locations[idx]!.stopLocation,
                    time: ev.stoppedAt,
                    event: "stop",
                  },
                  ev.tripRoute,
                  ev.drivingDuration!,
                  ev.totalDistance,
                )
              }
            >
              <ul class="timeline timeline-snap-icon timeline-compact timeline-vertical w-full">
                <li>
                  <div class="timeline-middle">
                    <span class="bg-success flex size-4 items-center justify-center rounded-full"></span>
                  </div>
                  <div class="timeline-end mb-0 w-full rounded-lg py-4 pt-1">
                    <div class="w-fit text-base-content mb-1 flex items-center gap-2 font-medium">
                      <span class="font-semibold">Start</span>
                      <span>|</span>
                      <span class="icon-[material-symbols--schedule-outline-rounded]"></span>
                      <span>{ev.startedAt}</span>
                    </div>
                    <p>{locations[idx]!.startLocation}</p>
                    <p class="flex items-center gap-2">
                      <span class="font-semibold">Driving Duration</span>
                      <span>&middot;</span>
                      <span>{ev.drivingDuration}</span>
                    </p>
                  </div>
                  <hr />
                </li>
                <li>
                  <div class="timeline-middle">
                    <span class="bg-error flex size-4 items-center justify-center rounded-full"></span>
                  </div>
                  <div class="timeline-end mb-0 w-full rounded-lg py-4 pt-1">
                    <div class="w-fit text-base-content mb-1 flex items-center gap-2 font-medium">
                      <span class="font-semibold">Stop</span>
                      <span>|</span>
                      <span class="icon-[material-symbols--schedule-outline-rounded]"></span>
                      <span>{ev.stoppedAt}</span>
                    </div>
                    <p>{locations[idx]!.stopLocation}</p>
                    <p class="flex items-center gap-2">
                      <span class="font-semibold">Stop Duration</span>
                      <span>&middot;</span>
                      <span>{ev.stopDuration}</span>
                    </p>
                  </div>
                  <hr />
                </li>
              </ul>
            </div>
          );
        })}
      </div>
    );
  },
});
