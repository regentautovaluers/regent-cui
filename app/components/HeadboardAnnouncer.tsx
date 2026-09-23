export default defineComponent({
  props: {
    highlightText: {
      required: true,
      type: String,
    },
    announcerTitle: {
      required: true,
      type: String,
    },
  },
  setup(props, { slots }) {
    return () => (
      <div class="rounded-box ring-primary/20 to-primary/10 from-base-100/10 mb-6 w-full gap-6 bg-linear-to-br p-6 text-start ring-1 sm:flex">
        <div class="flex flex-col gap-1.5 sm:w-7/12">
          <p class="text-primary text-lg font-semibold capitalize">
            {props.highlightText}
          </p>
          <h1 class="text-base-content text-2xl leading-tight font-bold capitalize sm:text-4xl">
            {props.announcerTitle}
          </h1>
          {slots.description?.()}
        </div>

        {slots.aside?.()}
      </div>
    );
  },
});
