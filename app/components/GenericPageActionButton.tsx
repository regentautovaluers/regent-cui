export default defineComponent({
  props: {
    actionId: {
      required: true,
      type: String,
    },
  },
  setup(props, { slots }) {
    return () => (
      <div class="dropdown relative inline-flex [--placement:left-start]">
        <button
          id={props.actionId}
          type="button"
          class="btn btn-circle btn-text btn-sm"
          aria-haspopup="menu"
          aria-expanded="false"
          aria-label="Dropdown"
        >
          <span class="icon-[material-symbols--more-vert] size-6"></span>
        </button>
        <ul
          class="dropdown-menu dropdown-open:opacity-100 hidden min-w-60"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby={props.actionId}
        >
          {slots.default?.()}
        </ul>
      </div>
    );
  },
});
