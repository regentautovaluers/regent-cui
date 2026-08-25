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
    onlineStatus: {
      required: true,
      type: Object as PropType<TrackerStatusMetaWrapper>,
    },
  },
  setup(props) {
    return () => (
      <div class="flex items-center justify-between">
        <div
          class={`flex items-center justify-center border border-${props.onlineStatus.prefered_color} space-x-1 h-10 min-w-20 text-bg-soft-${props.onlineStatus.prefered_color} rounded-lg text-sm`}
        >
          <span class="icon-[material-symbols--android-wifi-3-bar-rounded] size-4"></span>
          <span>{props.onlineStatus.proper_status}</span>
        </div>

        <span>
          {props.deviceSpeed} {props.unitsOfSpeed}
        </span>
      </div>
    );
  },
});
