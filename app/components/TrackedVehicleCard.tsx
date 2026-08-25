import { type PropType } from "vue";
import TrackedVehicleStatus from "./TrackedVehicleStatus";

export default defineComponent({
  props: {
    id: {
      required: true,
      type: Number,
    },
    regNo: {
      required: true,
      type: String,
    },
    driverName: {
      required: true,
      type: String,
    },
    deviceTime: {
      required: true,
      type: [Object, String] as PropType<Date | TimeEnum>,
    },
    deviceExpirationDate: {
      required: true,
      type: [Object, String] as PropType<Date | null>,
    },
    deviceSpeed: {
      required: false,
      type: Number,
    },
    unitsOfSpeed: {
      required: false,
      type: String as PropType<DistanceUnitHour>,
    },
    iconColor: {
      required: true,
      type: String as PropType<IconColor>,
    },
  },
  emits: {
    "vehicle-open-request": (id: number) => typeof id === "number",
  },
  setup(props, { emit }) {
    const handleOpenRequest = (id: number) => {
      emit("vehicle-open-request", id);
    };

    const designatedTrackerStatus = deriveProperTrackerStatus(props.iconColor);

    return () => (
      <div class="border-base-content/50 p-3 h-fit w-full space-y-5 rounded-md border">
        <div class="flex justify-between space-x-3 items-start">
          <div
            class={`size-13 rounded-md text-white flex items-center justify-center shadow-md bg-${designatedTrackerStatus.prefered_color}`}
          >
            <span class="icon-[material-symbols--delivery-truck-speed-rounded] size-8"></span>
          </div>
          <div class="grow space-y-0.5">
            <p class="font-bold">{props.regNo}</p>
            <p class="text-sm">Open to View Location</p>
          </div>
          <button
            class="btn btn-square btn-soft btn-primary"
            onClick={() => handleOpenRequest(props.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              class="size-6"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                fill="currentColor"
                d="M12.6 12L8.7 8.1q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7z"
              />
            </svg>
          </button>
        </div>
        <div class="flex space-x-2 items-center">
          <span class="inline-flex items-center space-x-2">
            <span class="icon-[material-symbols--account-circle]"></span>
            <span>{props.driverName}</span>
          </span>
          <span>|</span>
          <span class="inline-flex items-center space-x-2">
            <span class="icon-[material-symbols--nest-clock-farsight-analog-outline-rounded]"></span>
            <span>{props.deviceTime}</span>
          </span>
        </div>
        <TrackedVehicleStatus
          onlineStatus={designatedTrackerStatus}
          deviceSpeed={props.deviceSpeed}
          unitsOfSpeed={props.unitsOfSpeed}
        ></TrackedVehicleStatus>
      </div>
    );
  },
});
