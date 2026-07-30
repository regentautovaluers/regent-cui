export default defineComponent({
  props: {
    item: {
      required: true,
      type: Object as () => RoutesAvailable,
    },
    accordionId: {
      required: true,
      type: String as () => String,
    },
  },
  setup(props) {
    const { sidebarOpen } = useSettings();

    return () => (
      <div class="accordion divide-neutral/20 divide-y">
        <div class="accordion-item active" id={props.accordionId as string}>
          <button
            class="accordion-toggle inline-flex items-center justify-between text-start"
            aria-controls="payment-arrow-collapse"
            aria-expanded="true"
          >
            <NuxtLink to={{ name: "" }} class="inline-flex items-center">
              <span class={`${props.item.icon!} size-7`}></span>
              <span class="ml-4 font-medium">{props.item.screenName}</span>
            </NuxtLink>
            <span class="icon-[material-symbols--chevron-forward-rounded] accordion-item-active:rotate-90 size-5 shrink-0 transition-transform duration-300 rtl:rotate-180"></span>
          </button>
          <div
            id="payment-arrow-collapse"
            class="accordion-content w-full transition-[height] duration-300"
            aria-labelledby={props.accordionId as string}
            role="region"
          >
            {props.item.children && (
              <ul class="timeline timeline-vertical timeline-compact ml-4">
                {props.item.children.map((i, idx) => {
                  return (
                    <li key={idx}>
                      <div class="timeline-middle h-fit">
                        <span class="border-primary border flex w-3 h-6 items-center justify-center rounded-full"></span>
                      </div>
                      <div class="timeline-end text-base-content ml-4">
                        {i.screenName}
                      </div>
                      <hr />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  },
});
