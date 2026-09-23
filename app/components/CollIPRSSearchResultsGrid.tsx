import type { PropType } from "vue";

export default defineComponent({
  props: {
    results: {
      required: true,
      type: Object as PropType<IPRSCollateralSearchResultEntry[]>,
    },
  },
  setup(props) {
    return () => (
      <div class="grid grid-cols-3 divide-x divide-y divide-primary border border-primary rounded-lg overflow-x-clip -z-10">
        <h1 class="col-span-3 py-3 bg-primary px-2 inline-flex items-center space-x-2">
          <span class="icon-[material-symbols--search-rounded] text-error-content size-5"></span>
          <span class="uppercase text-error-content">Search Results</span>
        </h1>
        {props.results.map((i, idx) => {
          return (
            <div class="p-2" key={idx}>
              <h3 class="font-semibold text-primary">{i.title}</h3>
              <span class="text-base-content">{i.value || '-'}</span>
            </div>
          );
        })}
      </div>
    );
  },
});
