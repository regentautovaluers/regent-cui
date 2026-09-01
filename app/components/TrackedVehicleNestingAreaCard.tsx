export default defineComponent({
  props: {
    
  },
  emits: {
    "page-change-clicked": (newPage: number) => typeof newPage === "number",
  },
  setup(props, { emit }) {
    const handlePageChange = (newPage: number) => {
      emit("page-change-clicked", newPage);
    };

    return () => (
      <></>
    );
  },
});
