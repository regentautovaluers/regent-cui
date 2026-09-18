export default defineComponent({
  props: {
    item: {
      required: true,
      type: Object as () => RoutesAvailable,
    },
  },
  setup(props) {
    const { sidebarOpen } = useSettings();
    const { activeRouteName, routes } = useNavigation();
    const parentWrappingActiveRouteMatches = computed(() => {
      let matches = false;
      if (props.item.children) {
        for (const child of props.item.children) {
          if (activeRouteName.value == child.name) {
            matches = true;
            break;
          }
        }
      }

      return matches;
    });

    function childRouteMatches(routeName: string): boolean {
      return activeRouteName.value == routeName;
    }

    return () => (
      <div class="accordion">
        <div
          class="accordion-item active"
          id={`sidedd-${props.item.name}-basic`}
        >
          <button
            class="accordion-toggle inline-flex items-center justify-between"
            aria-controls={`sm-${props.item.name}-collapse`}
            aria-expanded="false"
          >
            <div
              class={`flex items-center ${parentWrappingActiveRouteMatches.value && "text-primary"}`}
            >
              <span class={`${props.item.icon!} size-6`}></span>
              {sidebarOpen.value && (
                <span
                  class={`font-medium ${sidebarOpen.value} && ml-4 ${parentWrappingActiveRouteMatches.value && "font-semibold"}`}
                >
                  {props.item.screenName}
                </span>
              )}
            </div>

            {sidebarOpen.value &&
              props.item.children &&
              props.item.showChildren && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  class="accordion-item-active:rotate-90 size-5 transition-transform duration-300 rtl:rotate-180"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path
                    fill="currentColor"
                    d="M12.6 12L8.7 8.1q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7z"
                  />
                </svg>
              )}
          </button>
          <div
            id={`sm-${props.item.name}-collapse`}
            class="accordion-content w-full transition-[height] duration-300"
            aria-labelledby={`sidedd-${props.item.name}-basic`}
            role="region"
          >
            {props.item.children &&
              props.item.showChildren &&
              sidebarOpen.value && (
                <ul class="timeline timeline-vertical timeline-compact ml-3">
                  {props.item.children
                    .filter((e) => e.display)
                    .map((i, idx) => {
                      return (
                        <li key={idx}>
                          <div class="timeline-middle h-fit">
                            <span
                              class={`border-primary border flex w-3 h-6 items-center justify-center rounded-full ${childRouteMatches(i.name) && "bg-primary"}`}
                            ></span>
                          </div>
                          <div
                            class={`timeline-end text-base-content ml-4 ${childRouteMatches(i.name) && "text-primary font-semibold"}`}
                          >
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
