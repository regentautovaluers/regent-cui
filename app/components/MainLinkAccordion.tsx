export default defineComponent({
  props: {
    item: {
      required: true,
      type: Object as () => RoutesAvailable,
    },
  },
  setup(props) {
    const { sidebarOpen } = useSettings();

    return () => (
      <div class="accordion">
        <div
          class="accordion-item active"
          id={`sidedd-${props.item.name}-basic`}
        >
          <button
            class="accordion-toggle inline-flex items-center"
            aria-controls={`sm-${props.item.name}-collapse`}
            aria-expanded="false"
          >
            <span class={`${props.item.icon!} size-7`}></span>
            {sidebarOpen.value && (
              <span class={`font-medium ${sidebarOpen.value} && ml-4`}>
                {props.item.screenName}
              </span>
            )}
            {sidebarOpen.value && (
              <span class="icon-[material-symbols--chevron-forward-rounded] accordion-item-active:rotate-90 size-5 shrink-0 transition-transform duration-300 rtl:rotate-180"></span>
            )}
          </button>
          <div
            id={`sm-${props.item.name}-collapse`}
            class="accordion-content w-full transition-[height] duration-300"
            aria-labelledby={`sidedd-${props.item.name}-basic`}
            role="region"
          >
            {props.item.children && sidebarOpen.value && (
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
