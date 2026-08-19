import { type PropType } from "vue";

export default defineComponent({
  props: {
    headers: {
      required: true,
      type: Array as PropType<string[]>,
    },
    dataLoading: {
      required: true,
      type: Boolean,
    },
  },
  setup(props, { slots }) {
    return () => (
      <div class="border-base-content/25 w-full rounded-lg border">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr class="h-14">
                {props.headers.map((e) => (
                  <th class="font-bold">{e}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* render default slot or fallback content */}
              {props.dataLoading
                ? Array.from({ length: 10 }, (_, idx) => (
                    <tr key={idx} class="h-20">
                      {Array.from(
                        { length: props.headers.length },
                        (_, idx) => (
                          <td class="animate-pulse" key={idx}>
                            <div class="skeleton skeleton-animated h-4 w-full"></div>
                          </td>
                        ),
                      )}
                    </tr>
                  ))
                : slots.default?.()}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
});
