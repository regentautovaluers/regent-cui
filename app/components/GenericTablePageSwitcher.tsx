export default defineComponent({
  props: {
    currentPage: {
      required: true,
      type: Number,
    },
    totalPages: {
      required: true,
      type: Number,
    },
    totalItems: {
      required: false,
      type: Number,
    },
    scrollBackDisabled: {
      required: true,
      type: Boolean,
    },
    scrollForwardDisabled: {
      required: true,
      type: Boolean,
    },
  },
  emits: {
    "page-change-clicked": (newPage: number) => typeof newPage === "number",
  },
  setup(props, { emit }) {
    const handlePageChange = (newPage: number) => {
      emit("page-change-clicked", newPage);
    };

    return () => (
      <div class="flex mt-10 justify-between items-center">
        <span class="text-base-content/80 text-base">
          Showing {props.currentPage + 1} of {props.totalPages} pages
          {props.totalItems! > 0 && <span>. (Total items {props.totalItems})</span>}
        </span>
        <div class="flex space-x-2">
          <button
            class="btn btn-primary h-12 text-lg"
            type="button"
            // @click="handlePageChange(page - 1)"
            disabled={props.scrollBackDisabled}
            onClick={() => handlePageChange(props.currentPage - 1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              class="size-8"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                fill="currentColor"
                d="m10.8 12l3.9 3.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-4.6-4.6q-.15-.15-.212-.325T8.425 12t.063-.375t.212-.325l4.6-4.6q.275-.275.7-.275t.7.275t.275.7t-.275.7z"
              />
            </svg>
            Prev
          </button>

          <button
            class="btn btn-primary h-12 text-lg"
            type="button"
            // @click="handlePageChange(page + 1)"
            disabled={props.scrollForwardDisabled}
            onClick={() => handlePageChange(props.currentPage + 1)}
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              class="size-8"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                fill="currentColor"
                d="M12.6 12L8.7 8.1q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7z"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  },
});
