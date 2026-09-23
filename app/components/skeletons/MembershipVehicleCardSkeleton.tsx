export default defineComponent({
  props: {},
  setup(props, {}) {
    return () => (
      <div class="h-fit rounded-lg overflow-clip shadow bg-pink-700 text-slate-200">
        <div class="py-2 px-4 h-36">
          <div class="h-fit flex items-center justify-between">
            <h3 class="w-20 h-8 skeleton skeleton-animated size-12"></h3>
            <button class="skeleton skeleton-animated size-12 w-20 h-8"></button>
          </div>

          <div class="grid grid-cols-2 mt-4">
            <h4 class="col-span-2 mb-2 skeleton skeleton-animated w-1/2 h-8"></h4>
            <div class="skeleton skeleton-animated h-8 w-30"></div>
            <div class="skeleton skeleton-animated h-8 w-30"></div>
          </div>
        </div>
        <div class="inline-flex justify-between h-12 w-full  bg-base-300/50 items-center py-2 px-4  ">
          <div class="inline-flex items-center space-x-1 skeleton skeleton-animated w-30 h-8"></div>

          <a
            href="tel:254735567767"
            target="_blank"
            class=" skeleton skeleton-animated w-20 h-8"
          ></a>
        </div>
      </div>
    );
  },
});
