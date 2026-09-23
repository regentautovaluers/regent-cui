import { type PropType } from "vue";

export default defineComponent({
  props: {
    deviceSpeed: {
      required: false,
      type: Number,
    },
    unitsOfSpeed: {
      required: false,
      type: String as PropType<DistanceUnitHour>,
    },
    wrappedOnlineStatus: {
      required: true,
      type: String as PropType<TrackerStatusWrapperName>,
    },
  },
  setup(props) {
    const output = () => {
      if (props.wrappedOnlineStatus == "Online") {
        return (
          <>
            <div
              class={`flex items-center justify-center border border-success space-x-1 h-12 min-w-23 text-bg-soft-success rounded-lg text-sm`}
            >
              <span class="icon-[material-symbols--android-wifi-3-bar-rounded] size-4"></span>
              <span>{props.wrappedOnlineStatus}</span>
            </div>

            <span>
              {props.deviceSpeed} {props.unitsOfSpeed}
            </span>
          </>
        );
      }

      if (props.wrappedOnlineStatus == "Expired") {
        return (
          <>
            <div
              class={`flex items-center justify-center border border-error space-x-1 h-12 min-w-23 text-bg-soft-error rounded-lg text-sm`}
            >
              <span class="icon-[material-symbols--android-wifi-3-bar-rounded] size-4"></span>
              <span>{props.wrappedOnlineStatus}</span>
            </div>

            <span>
              {props.deviceSpeed} {props.unitsOfSpeed}
            </span>
          </>
        );
      }

      if (props.wrappedOnlineStatus == "Offline") {
        return (
          <>
            <div
              class={`flex items-center justify-center border border-warning space-x-1 h-12 min-w-23 text-bg-soft-warning rounded-lg text-sm`}
            >
              <span class="icon-[material-symbols--android-wifi-3-bar-rounded] size-4"></span>
              <span>{props.wrappedOnlineStatus}</span>
            </div>
            <span>
              {props.deviceSpeed} {props.unitsOfSpeed}
            </span>
          </>
        );
      }
    };

    return () => (
      <div class="flex items-center justify-between">{output()}</div>
    );
  },
});
